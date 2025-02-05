import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CodeBlockHeader } from './CodeBlockHeader';
import { JSX, useCallback, useEffect, useState } from 'react';
import { useToolbarState } from '@/dir/context/ToolbarContext'; // Import the toolbar state to get language
import { $getNodeByKey, $getSelection, $isRangeSelection, $isRootOrShadowRoot, COMMAND_PRIORITY_CRITICAL, NodeKey, SELECTION_CHANGE_COMMAND } from 'lexical';
import { $isCodeNode } from '@/dir/nodes/CodeNode';
import { CODE_LANGUAGE_MAP } from '@/dir/nodes/CodeHighlightNode';
import { $findMatchingParent } from '@lexical/utils';

export default function CodeBlockPlugin({ activeEditor, setActiveEditor, onCopy, isEditable }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { toolbarState, updateToolbarState } = useToolbarState(); // Assuming toolbarState contains the language
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  
  const language = toolbarState.codeLanguage;

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
    <CodeBlockHeader
      language={language} // Pass the language directly
      onLanguageChange={onCodeLanguageSelect} // Pass the language change handler
      editor={editor}
      activeEditor={activeEditor}
      setActiveEditor={setActiveEditor}
      onCopy={onCopy}
      isEditable={isEditable}
    />
  );
}
