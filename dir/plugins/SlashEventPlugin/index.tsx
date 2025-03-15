import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect } from "react";

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

        // Ensure we have enough characters to check " /| "
        if (cursorOffset >= 2) {
          const prevChar = textContent[cursorOffset - 2]; // Space before slash
          const slashChar = textContent[cursorOffset - 1]; // Slash itself
          const nextChar = textContent[cursorOffset]; // Space after slash

          // Check if the format is " / "
          if (prevChar === " " && slashChar === "/" && (!nextChar || nextChar === " ")) {
            console.log("slash triggered");
          }
        }
      });
    });

    return () => removeListener();
  }, [editor]);

  return null;
};

export default SlashEventPlugin;
