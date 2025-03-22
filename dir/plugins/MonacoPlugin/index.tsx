import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createNodeSelection,
  $getRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { JSX, useEffect } from 'react';
import { $createMonacoNode, MonacoNode } from '../../nodes/MonacoNode';
export const INSERT_MONACO_COMMAND: LexicalCommand<{ language: string; code: string }> =
  createCommand('INSERT_MONACO_COMMAND');


export default function MonacoPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([MonacoNode])) {
      throw new Error('MonacoPlugin: MonacoNode not registered on editor');
    }

    return editor.registerCommand<{ language: string; code: string }>(
      INSERT_MONACO_COMMAND,
      (payload) => {
        const { language, code } = payload;
        editor.update(() => {
          const monacoNode = $createMonacoNode(language, code);
          const editorRoot = editor.getRootElement();

          const nodeKey = monacoNode.getKey();
          // Ensure it's inserted at the root level
          const root = $getRoot();
          root.append(monacoNode);
          
          // Always create a fresh NodeSelection and set it
          const selection = $createNodeSelection();
          selection.add(nodeKey);
          $setSelection(selection);

          setTimeout(() => {
            editorRoot?.focus();
            console.log('Editor refocused');
          }, 0);

        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
