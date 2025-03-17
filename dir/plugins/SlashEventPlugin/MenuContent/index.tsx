import React from "react";
import { AlignLeft, Code, File, FileAudio, FileVideo, ImageIcon, ListChecks, Smile, Table } from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  shortcut?: string;
}

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

interface MenuContentProps {
  query: string; // The text typed after `/`
}

export function MenuContent({ query }: MenuContentProps) {
  // Filter items based on query
  const filteredItems = MENU_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md rounded-md bg-white shadow-lg">
      <div className="max-h-[500px] overflow-y-auto">
        <div className="p-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MenuItem key={item.title} {...item} />
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, title, description, shortcut }: MenuItemProps) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      {shortcut && <div className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600">{shortcut}</div>}
    </div>
  );
}
