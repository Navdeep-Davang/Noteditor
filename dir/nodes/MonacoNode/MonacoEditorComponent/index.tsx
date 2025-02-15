import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monacoEditor from 'monaco-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VerticalAdjustable } from "./VerticalAdjustable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { $getNodeByKey, COMMAND_PRIORITY_LOW, KEY_DELETE_COMMAND } from "lexical";
import { $isMonacoNode, MonacoNode } from "..";

interface MonacoEditorProps {
  nodeKey : string
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ nodeKey }) => {

  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);


  const [code, setCode] = useState('');
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

    const updateContentHeight = () => {
      if (!monacoeditor) return; // Ensure editor exists

      const newHeight = monacoeditor.getContentHeight(); // This considers folded sections
      setContentHeight(newHeight);
      console.log("Updated content height:", newHeight);
    };



    // Listen for content changes & update height
    monacoeditor.onDidChangeModelContent(() => {
      updateContentHeight();
    });

    // Listen for folding/unfolding changes & update height
    monacoeditor.onDidChangeModelDecorations(() => {
      updateContentHeight();
      console.log("Model decorations changed:");
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

  return (
    <div 
      className='monaco-block-wrapper my-4 w-full max-w-[800px] justify-center'
      onClick={(event) => {
        if (!event.shiftKey) {
          clearSelection();
        }
        setSelected(!isSelected);
      }}
    >

    <div className="monaco-block overflow-hidden flex flex-col w-full h-full border rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50 ">
        <Select onValueChange={(value) => handleLanguageChange(value)} value={language}>
          <SelectTrigger className="flex items-center justify-between w-28 h-8 text-xs px-2 py-1 border rounded-md shadow-sm  focus:ring-0 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <SelectValue placeholder="Select Language" />
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
      </div>

      {/* Editor */}
      <VerticalAdjustable contentHeight= {contentHeight}>
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={(value) => handleCodeChange(value || "" )}
          onMount={handleEditorMount}
          theme= "vs-dark"
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
