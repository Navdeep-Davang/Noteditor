import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { JSX, useEffect } from 'react';
import { $createMonacoNode, MonacoNode } from '../../nodes/MonacoNode';
export const INSERT_MONACO_COMMAND: LexicalCommand<{ language: string; code: string }> =
  createCommand('INSERT_MONACO_COMMAND');

// export function InsertMonacoDialog({
//   activeEditor,
//   onClose,
// }: {
//   activeEditor: LexicalEditor;
//   onClose: () => void;
// }): JSX.Element {
//   const [language, setLanguage] = useState('javascript');
//   const [code, setCode] = useState('');

//   const onClick = () => {
//     activeEditor.dispatchCommand(INSERT_MONACO_COMMAND, { language, code });
//     onClose();
//   };

//   return (
//     <>
//       <TextInput label="Language" onChange={setLanguage} value={language} />
//       <TextInput label="Code" onChange={setCode} value={code} multiline />
//       <DialogActions>
//         <Button disabled={code.trim() === ''} onClick={onClick}>
//           Confirm
//         </Button>
//       </DialogActions>
//     </>
//   );
// }

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
        const monacoNode = $createMonacoNode(language, code);
        $insertNodes([monacoNode]);

        if ($isRootOrShadowRoot(monacoNode.getParentOrThrow())) {
          $wrapNodeInElement(monacoNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
