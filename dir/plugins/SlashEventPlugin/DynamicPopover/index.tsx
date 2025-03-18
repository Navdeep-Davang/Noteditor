import React from "react";
import { createPortal } from "react-dom";
import { MenuItemProps } from "../types";



interface DynamicPopoverProps {
  open: boolean;
  position: { top: number; left: number } | null;
  selectedIndex: number;
  filteredItems : MenuItemProps[]
}

const DynamicPopover = ({ open, position, selectedIndex, filteredItems }: DynamicPopoverProps) => {
  
  // If no matching items, don't render the popover
  if (!open || !position || filteredItems.length === 0) return null;  
  
  
  return createPortal(
    <div
      className="absolute min-w-[350px] max-w-[500px] rounded-md shadow-xl border border-black border-opacity-20 bg-white z-[1000]"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="max-h-[500px] max-w-[500px] w-full overflow-y-auto">
        <div className="p-1">
          {filteredItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 ${
                index === selectedIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">{item.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              {item.shortcut && <div className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600">{item.shortcut}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DynamicPopover;
