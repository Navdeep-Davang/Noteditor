import { CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP, getLanguageFriendlyName } from '@/dir/nodes/CodeHighlightNode';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { $getNodeByKey, $getSelection, $isRangeSelection, $isRootOrShadowRoot, COMMAND_PRIORITY_CRITICAL, LexicalEditor, NodeKey, SELECTION_CHANGE_COMMAND } from 'lexical';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'; // Assuming you're using a Select component from your library
import { dropDownActiveClass } from '@/dir/utils/dropDownActiveClass';
import { $isCodeNode } from '@/dir/nodes/CodeNode';
import { $findMatchingParent } from '@lexical/utils';
import { useToolbarState } from '@/dir/context/ToolbarContext';

interface CodeBlockHeaderProps {
  editor: LexicalEditor
  activeEditor: LexicalEditor,
  setActiveEditor : Dispatch<React.SetStateAction<LexicalEditor>>,
  language: string;
  onLanguageChange: (newLanguage: string) => void;
  onCopy: () => void;
  isEditable: boolean;
}

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();


export const CodeBlockHeader: React.FC<CodeBlockHeaderProps> = ({editor, activeEditor,setActiveEditor, onCopy, isEditable }) => {

  const {toolbarState, updateToolbarState} = useToolbarState();
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);

  // Language selection callback
  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value); // Update the code block's language
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });
  
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
  
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
  
      // If it's a code block element, update the selected element key
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isCodeNode(element)) {
          const language =
            element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
          updateToolbarState(
            'codeLanguage',
            language ? CODE_LANGUAGE_MAP[language] || language : '',
          );
        }
      }
    }
  }, [activeEditor, updateToolbarState]);
  
  

   //UseEffect to $updateToolbar
    useEffect(() => {
      return editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          setActiveEditor(newEditor);
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      );
    }, [editor, $updateToolbar, setActiveEditor]);
  
    useEffect(() => {
      activeEditor.getEditorState().read(() => {
        $updateToolbar();
      });
    }, [activeEditor, $updateToolbar]);
    

  return (
    <div className="code-block-header">
      <Select
        disabled={!isEditable}
        value={toolbarState.codeLanguage}
        onValueChange={onCodeLanguageSelect}
        aria-label="Select language"
      >
        <SelectTrigger>
          <SelectValue>{getLanguageFriendlyName(toolbarState.codeLanguage)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="toolbar-item code-language">
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => (
            <SelectItem
              key={value}
              value={value}
              className={`item ${dropDownActiveClass(value === toolbarState.codeLanguage)}`}
            >
              <span className="text">{name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button onClick={onCopy}>Copy</button>
    </div>
  );
};
