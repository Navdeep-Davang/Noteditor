import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, TextNode } from "lexical";
import { useEffect, useState } from "react";
import DynamicPopover from "./DynamicPopover";

const MAX_COMMAND_LENGTH = 50;

const SlashEventPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [commandText, setCommandText] = useState<string | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const removeListener = editor.registerTextContentListener(() => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          setCommandText(null);
          return;
        }

        const anchorNode = selection.anchor.getNode();
        if (!(anchorNode instanceof TextNode)) {
          setCommandText(null);
          return;
        }

        const textContent = anchorNode.getTextContent();
        const cursorOffset = selection.anchor.offset;

        if (cursorOffset >= 1) {
          const typedText = textContent.slice(0, cursorOffset); // Get text before cursor
          const match = typedText.match(/(?:^|\s)\/(\w*)?$|^\/$/);
        
          console.log("Typed Text:", typedText);
          console.log("Match Result:", match);
        
          if (match) {
            const command = match[1] || ""; // Ensure empty string if no command is typed
            console.log("Trigger Command:", command);
        
            if (command.length <= MAX_COMMAND_LENGTH) {
              setCommandText(command);
        
              // Compute trigger position
              const domSelection = window.getSelection();
              if (domSelection && domSelection.rangeCount > 0) {
                const domRange = domSelection.getRangeAt(0);
                const rect = domRange.getBoundingClientRect();
        
                console.log("Popover Position:", rect);
        
                setPosition({
                  top: rect.bottom + window.scrollY + 2,
                  left: rect.left,
                });
              }
        
              return;
            }
          }
        }
        

        setCommandText(null);
      });
    });

    return () => removeListener();
  }, [editor]);

  return (
    <DynamicPopover
      open={commandText !== null} 
      onOpenChange={(state) => {
        if (!state) setCommandText(null);
      }}
      position={position}
      query={commandText || ""}
    />
  );
};

export default SlashEventPlugin;
