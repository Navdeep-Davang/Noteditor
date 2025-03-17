import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect } from "react";


const MAX_COMMAND_LENGTH = 50;

const SlashEventPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerTextContentListener(() => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

        const anchorNode = selection.anchor.getNode();
        const textContent = anchorNode.getTextContent();
        const cursorOffset = selection.anchor.offset;

        if (cursorOffset >= 1) {
          const typedText = textContent.slice(0, cursorOffset); // Get text before cursor
          const afterCursor = textContent.slice(cursorOffset); // Text after cursor

          // Match if `/` is at the start or preceded by a space
          const match = typedText.match(/(?:^|\s)\/(\w*)$/);

          if (match) {
            const commandText = match[1];
            
            // Ensure it's within max length and no text follows cursor
            // Trigger only if nothing comes after the cursor
            if (commandText.length <= MAX_COMMAND_LENGTH && (!afterCursor || afterCursor.match(/^\s*$/))) {
              console.log("Slash Command Detected:", match[0].trim()); // Trim to remove leading space
            }
          }
        }
      });
    });

    return () => removeListener();
  }, [editor]);

  return null;
};

export default SlashEventPlugin;
