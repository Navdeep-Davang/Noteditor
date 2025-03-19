import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import { MenuItemProps } from "../types";



interface DynamicPopoverProps {
  open: boolean;
  position: { top: number; left: number } | null;
  selectedIndex: number;
  filteredItems : MenuItemProps[];
  onSelect: (item: MenuItemProps) => void;
}

const DynamicPopover = forwardRef<HTMLDivElement, DynamicPopoverProps>(
  ({ open, position, selectedIndex, filteredItems, onSelect }, ref) => {
  
    // If no matching items, don't render the popover
    if (!open || !position || filteredItems.length === 0) return null;  
    
    const handleClick = (item: MenuItemProps, event: React.MouseEvent) => {
      event.stopPropagation(); // Stop event from propagating to other handlers
      onSelect(item);
    };
    
    return createPortal(
      <div
        ref={ref} 
        className="dynamic-popover absolute min-w-[350px] max-w-[500px] rounded-md shadow-xl z-[1000]"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="max-h-[500px] max-w-[500px] w-full overflow-y-auto">
          <div className="p-1">
            {filteredItems.map((item, index) => (
              <div
                key={item.title}
                onClick={(event) => handleClick(item, event)}
                className={`dynamic-popover-item flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 ${
                  index === selectedIndex ? "active" : ""
                }`}
              >
                <div className="dynamic-popover-icon flex h-8 w-8 items-center justify-center rounded-md">{item.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs">{item.description}</div>
                </div>
                {item.shortcut && <div className="dynamic-popover-shortcut rounded px-2 py-1 text-xs font-medium">{item.shortcut}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

DynamicPopover.displayName = "DynamicPopover";

export default DynamicPopover;
