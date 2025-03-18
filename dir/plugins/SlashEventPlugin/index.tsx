import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, BLUR_COMMAND, LexicalEditor } from "lexical";
import { useCallback, useEffect, useState } from "react";
import DynamicPopover from "./DynamicPopover";
import { AlignLeft, Code, File, FileAudio, FileVideo, ImageIcon, ListChecks, Smile, Table } from "lucide-react";
import { MenuItemProps } from "./types";
import { INSERT_CHECK_LIST_COMMAND } from "@lexical/list";
import { INSERT_MONACO_COMMAND } from "../MonacoPlugin";
import { $setBlocksType } from "@lexical/selection";


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


const executeCommand = (editor: LexicalEditor, commandTitle: string) => {
  switch (commandTitle) {
    case "Check List":
      // editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      console.log("Check List is inserted")
      break;
    case "Paragraph":
      // editor.update(() => {
      //   const selection = $getSelection();
      //   $setBlocksType(selection, () => $createParagraphNode());
      // });
      console.log("Paragraph is inserted")
      break;
    case "Code Block":
      // editor.dispatchCommand(INSERT_MONACO_COMMAND, {language: 'javascript', code:''});
      console.log("Code is inserted")
      break;
    case "Table":
      // editor.dispatchCommand(INSERT_TABLE_COMMAND, undefined);
      console.log("Table is inserted")
      break;
    case "Image":
      // editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: "https://example.com/image.png" });
      console.log("Image is inserted")
      break;
    case "Video":
      // editor.dispatchCommand(INSERT_VIDEO_COMMAND, { src: "https://example.com/video.mp4" });
      console.log("Video is inserted")
      break;
    case "Audio":
      // editor.dispatchCommand(INSERT_AUDIO_COMMAND, { src: "https://example.com/audio.mp3" });
      console.log("Audio is inserted")
      break;
    case "File":
      // editor.dispatchCommand(INSERT_FILE_COMMAND, { src: "https://example.com/file.pdf" });
      console.log("File is inserted")
      break;
    case "Emoji":
      // editor.dispatchCommand(INSERT_EMOJI_COMMAND, "😊");
      console.log("Emoji is inserted")
      break;
    default:
      console.warn("No command mapped for", commandTitle);
  }
};



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

  const handleSelection = useCallback((item: MenuItemProps) => {
    if (!editor) return; // Ensure editor is available
    console.log("Event from", item.title);
    executeCommand(editor, item.title); // Execute the mapped command
    setIsSlashActive(false); // Hide popover after selection
  }, [editor]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSlashActive) return; // Only handle keys when popover is open

      console.log("Key Pressed:", event.key);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredItems.length) % filteredItems.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        console.log("Enter Pressed - Executing Command");
        handleSelection(filteredItems[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isSlashActive, selectedIndex, filteredItems, handleSelection]);


  return (
    <DynamicPopover
      open={isSlashActive}
      position={position}
      selectedIndex = {selectedIndex}
      filteredItems = {filteredItems}
      onSelect={handleSelection}
    />
  );
};

export default SlashEventPlugin;
