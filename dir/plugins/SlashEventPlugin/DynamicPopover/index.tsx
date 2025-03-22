import React, { forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MenuItemProps } from "../types";

interface DynamicPopoverProps {
  open: boolean;
  position: DOMRect | null;
  selectedIndex: number;
  filteredItems: MenuItemProps[];
  onSelect: (item: MenuItemProps) => void;
}

const DynamicPopover = forwardRef<HTMLDivElement, DynamicPopoverProps>(
  ({ open, position, selectedIndex, filteredItems, onSelect }, ref) => {
    const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties | undefined>(undefined);

    useEffect(() => {
      if (!position || !open) return;

      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;
      const viewportMiddle = (viewportBottom + viewportTop) / 2;
      const popoverHeight = 300; // Set a max height for the popover

      // Adjust the slash position to be relative to the page
      const absoluteSlashTop = position.top + window.scrollY;
      const absoluteSlashBottom = position.bottom + window.scrollY;

      const isAbove = absoluteSlashTop >= viewportMiddle;
      console.log("========== Popover Debug Info ==========");
      console.log("Absolute Slash Top:", absoluteSlashTop);
      console.log("Absolute Slash Bottom:", absoluteSlashBottom);
      console.log("Viewport Top (Page Scroll):", viewportTop);
      console.log("Viewport Bottom (Page Scroll):", viewportBottom);
      
      let newStyle: React.CSSProperties;
      let popoverTop, popoverBottom;
      

      if (isAbove) {
        // Popover above the slash
        popoverBottom = window.innerHeight - absoluteSlashTop;
        const maxAllowedHeight = absoluteSlashTop - viewportTop - 4; // Prevent overflow

        newStyle = {
          position: "absolute",
          bottom: `${popoverBottom}px`,
          left: `${position.left}px`,
          maxHeight: `${Math.min(popoverHeight, maxAllowedHeight)}px`,
          overflowY: "auto",
        };

      } else {
        // Popover below the slash
        popoverTop = absoluteSlashBottom;
        const maxAllowedHeight = viewportBottom - popoverTop - 4; // Prevent overflow

        newStyle = {
          position: "absolute",
          top: `${popoverTop}px`,
          left: `${position.left}px`,
          maxHeight: `${Math.min(popoverHeight, maxAllowedHeight)}px`,
          overflowY: "auto",
        };
      }

      console.log("Is Popover Above:", isAbove);
      console.log("Popover Top:", popoverTop !== undefined ? popoverTop : "N/A");
      console.log("Popover Bottom:", popoverBottom !== undefined ? popoverBottom : "N/A");
      console.log("========================================");

      setPopoverStyle(newStyle);
    }, [position, open]);

    // If no matching items, don't render the popover
    if (!open || !position || filteredItems.length === 0 || !popoverStyle) return null;

    const handleClick = (item: MenuItemProps, event: React.MouseEvent) => {
      event.stopPropagation(); // Stop event from propagating to other handlers
      onSelect(item);
    };

    return createPortal(
      <div
        ref={ref}
        className="dynamic-popover absolute min-w-[350px] max-w-[500px] rounded-md shadow-xl z-[1000]"
        style={popoverStyle}
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
                <div className="dynamic-popover-icon flex h-8 w-8 items-center justify-center rounded-md">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs">{item.description}</div>
                </div>
                {item.shortcut && (
                  <div className="dynamic-popover-shortcut rounded px-2 py-1 text-xs font-medium">
                    {item.shortcut}
                  </div>
                )}
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
