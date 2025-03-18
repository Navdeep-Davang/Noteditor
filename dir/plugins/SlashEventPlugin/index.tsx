import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, BLUR_COMMAND } from "lexical";
import { useEffect, useState } from "react";
import DynamicPopover from "./DynamicPopover";
import { AlignLeft, Code, File, FileAudio, FileVideo, ImageIcon, ListChecks, Smile, Table } from "lucide-react";
import { MenuItemProps } from "./types";


const MAX_COMMAND_LENGTH = 50;

// All menu items
const MENU_ITEMS: MenuItemProps[] = [
  { icon: <ListChecks className="h-5 w-5 text-gray-600" />, title: "Check List", description: "List with checkboxes", shortcut: "CTRL-SHIFT-9" },
  { icon: <AlignLeft className="h-5 w-5 text-gray-600" />, title: "Paragraph", description: "The body of your document", shortcut: "CTRL-ALT-0" },
  { icon: <Code className="h-5 w-5 text-gray-600" />, title: "Code Block", description: "Code block with syntax highlighting", shortcut: "CTRL-ALT-C" },
  { icon: <Table className="h-5 w-5 text-gray-600" />, title: "Table", description: "Table with editable cells" },
  { icon: <ImageIcon className="h-5 w-5 text-gray-600" />, title: "Image", description: "Resizable image with caption" },
  { icon: <FileVideo className="h-5 w-5 text-gray-600" />, title: "Video", description: "Resizable video with caption" },
  { icon: <FileAudio className="h-5 w-5 text-gray-600" />, title: "Audio", description: "Embedded audio with caption" },
  { icon: <File className="h-5 w-5 text-gray-600" />, title: "File", description: "Embedded file" },
  { icon: <Smile className="h-5 w-5 text-gray-600" />, title: "Emoji", description: "Search for and insert an emoji" },
];

const SlashEventPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isSlashActive, setIsSlashActive] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;
  
        const anchorNode = selection.anchor.getNode();
        const cursorOffset = selection.anchor.offset;
        const textContent = anchorNode.getTextContent().slice(0, cursorOffset);
  
        // Extract the last word before the cursor
        const match = textContent.match(/\S+$/);
        const currentWord = match ? match[0] : "";
  
        // Check if the word starts with `/`
        if (currentWord.startsWith("/") && currentWord.length <= MAX_COMMAND_LENGTH ) {
          setIsSlashActive(true);
          setQuery(currentWord.slice(1)); // Store query without `/`

          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const domRange = domSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();

            setPosition({
              top: rect.bottom + window.scrollY + 2,
              left: rect.left,
            });
          }
        } else {
          setIsSlashActive(false);
        }
      });
    });
  
    const removeBlurListener = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        setIsSlashActive(false);
        return false;
      },
      1
    );

    return () =>{
      removeUpdateListener();
      removeBlurListener();
    };
  }, [editor]);


  // Filter menu items based on query
  const filteredItems =
  query.trim() === ""
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSlashActive) return; // Only handle keys when popover is open

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredItems.length) % filteredItems.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        console.log("Selected:", filteredItems[selectedIndex].title);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSlashActive, selectedIndex, filteredItems]);


  return (
    <DynamicPopover
      open={isSlashActive}
      position={position}
      selectedIndex = {selectedIndex}
      filteredItems = {filteredItems}
    />
  );
};

export default SlashEventPlugin;
