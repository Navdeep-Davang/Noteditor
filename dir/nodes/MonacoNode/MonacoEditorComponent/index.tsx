import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monacoEditor from 'monaco-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VerticalAdjustable } from "./VerticalAdjustable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { $getNodeByKey, COMMAND_PRIORITY_LOW, KEY_DELETE_COMMAND } from "lexical";
import { $isMonacoNode, MonacoNode } from "..";
import { useTheme } from "next-themes";
import { Check, ChevronDown, Copy } from "lucide-react";

interface MonacoEditorProps {
  nodeKey : string
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ nodeKey }) => {
  const { theme } = useTheme();
  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);

  const [isFocused, setIsFocused] = useState(false);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('plaintext');

  
  const [contentHeight, setContentHeight] = useState(0);

  // Helper function to update MonacoNode
  const withMonacoNode = (
    cb: (node: MonacoNode) => void,
    onUpdate? : () => void
  ) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isMonacoNode(node)) {
        cb(node);
      }
    }, { onUpdate });
  };

  //UseEffect to update the MonacoNode content
  useEffect(() => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isMonacoNode(node)) {
        setCode(node.getCode());
        setLanguage(node.getLanguage());
      }
    });
  }, [editor, nodeKey]);

  //UseEffect to delete the MonacoNode content
  useEffect(() => {
    const $onDelete = (payload: KeyboardEvent) => {
      if (isSelected) {
        payload.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isMonacoNode(node)) {
            node.remove();
          }
        });
      }
      return false;
    };

    return editor.registerCommand(
      KEY_DELETE_COMMAND,
      $onDelete,
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isSelected, nodeKey]);


  const handleEditorMount = (monacoeditor: monacoEditor.editor.IStandaloneCodeEditor) => {
    const model = monacoeditor.getModel();
    if (model) {
      model.updateOptions({ tabSize: 2, insertSpaces: true });
    }

     // Listen for editor focus and blur
    monacoeditor.onDidFocusEditorText(() => {
      setIsFocused(true);
    });

    monacoeditor.onDidBlurEditorText(() => {
      setIsFocused(false);
    });

    const updateContentHeight = () => {
      if (!monacoeditor) return; // Ensure editor exists

      const newHeight = monacoeditor.getContentHeight(); // This considers folded sections
      setContentHeight(newHeight);
    };

    // Listen for content changes & update height
    monacoeditor.onDidChangeModelContent(() => {
      updateContentHeight();
    });

    // Listen for folding/unfolding changes & update height
    monacoeditor.onDidChangeModelDecorations(() => {
      updateContentHeight();
    });

  };
  

  const handleLanguageChange = (newLang: string) => {
    withMonacoNode((node) => {
      node.setLanguage(newLang);
    });
    setLanguage(newLang);
  };
  
  const handleCodeChange = (newCode: string) => {
    withMonacoNode((node) => {
      node.setCode(newCode);
    });
    setCode(newCode);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);      
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };


  // todo :: Delete the below useEffect, because it is used for only debugging
  useEffect(() => {
    console.log("isSelected:", isSelected, "isFocused:", isFocused);
  }, [isSelected, isFocused]);

  const handleSelection = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents event bubbling to unwanted elements
  
    if (!isSelected) {
      // Select if not already selected
      setSelected(true);
      return;
    }
  
    
  };

  return (
    <div
      className={`monaco-block-wrapper my-4 w-full justify-center border rounded-lg transition-all
        ${isSelected ? (isFocused ? "border-blue-200 dark:border-blue-900" : "border-blue-500") : "border-transparent"}`}
      onClick={handleSelection}
    >


    <div className="monaco-block overflow-hidden flex flex-col w-full h-full border rounded-lg shadow-md">
      {/* Header */}
      <div 
        className={`monaco-header flex items-center justify-between p-1 border-b 
          ${isSelected && isFocused ? "bg-blue-50 dark:bg-blue-950" : ""}`}
      >
        <Select 
          onValueChange={(value) => handleLanguageChange(value)} 
          value={language}
          onOpenChange={(open) => {
            if (open) setSelected(true); // Set selected when dropdown opens
          }}
        >
          <SelectTrigger className="monaco-button flex items-center justify-between w-fit h-fit gap-2 text-xs px-1.5 py-1 border rounded-md shadow-sm  focus:ring-0">
            <SelectValue placeholder="Select Language" />
            <ChevronDown className="h-3 w-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
            <SelectItem value="swift">Swift</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={copyToClipboard}
          disabled={copied} // Disable when copied
          className={`monaco-button flex items-center justify-between w-fit h-fit gap-1 text-xs px-1.5 py-1 border rounded-md shadow-sm 
            ${copied ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {copied ? (
            <>
              Copied <Check className="w-3 h-3" />
            </>
          ) : (
            <>
              Copy <Copy className="w-3 h-3" /> 
            </>
          )}
        </button>

      </div>

      {/* Editor */}
      <VerticalAdjustable contentHeight= {contentHeight} setSelected={setSelected}>
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={(value) => handleCodeChange(value || "" )}
          onMount={handleEditorMount}
          theme={monacoTheme}
          options={{
            minimap: { enabled: false }, // Disable minimap
            overviewRulerLanes: 0, // Hide decorationsOverviewRuler
            scrollBeyondLastLine: false, // Prevent extra space below content
            scrollBeyondLastColumn: 0, // Prevents scrolling beyond the last character
            tabSize: 2 ,
            detectIndentation: false, // Prevents Monaco from auto-detecting indentation
            fontFamily: "Fira Code, monospace", 
            scrollbar: {                
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,                
            },
            wordWrap: "off",
          }}
        />
      </VerticalAdjustable>      
    </div>

  </div>
  );
};

export default MonacoEditorComponent;
