import { Axis3d } from "lucide-react";
import { useState, ReactNode, useEffect, useRef } from "react";

interface VerticalAdjustableProps {
  children: ReactNode;
  contentHeight?: number;
}

export const VerticalAdjustable = ({ children, contentHeight }: VerticalAdjustableProps) => {
  const DEFAULT_HEIGHT = 200;
  const DEFAULT_LOWER_LIMIT = 200;
  const DEFAULT_UPPER_LIMIT = 300;

  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const monacoContainerRef = useRef<HTMLDivElement>(null);

  const computeLimits = (contentHeight?: number) => {
    if (contentHeight === undefined) {
      return { lowerLimit: DEFAULT_LOWER_LIMIT, upperLimit: DEFAULT_UPPER_LIMIT };
    }

    const adjustedHeight = contentHeight + 40;

    if (adjustedHeight < DEFAULT_LOWER_LIMIT) {
      return { lowerLimit: adjustedHeight, upperLimit: DEFAULT_LOWER_LIMIT };
    } else if (adjustedHeight > DEFAULT_UPPER_LIMIT) {
      return { lowerLimit: DEFAULT_UPPER_LIMIT, upperLimit: adjustedHeight };
    } else {
      return { lowerLimit: DEFAULT_LOWER_LIMIT, upperLimit: DEFAULT_UPPER_LIMIT };
    }
  };

  const { lowerLimit, upperLimit } = computeLimits(contentHeight);

  useEffect(() => {
    if (contentHeight !== undefined) {
      const adjustedHeight = contentHeight + 40;

      setHeight((prevHeight) => {
        if (adjustedHeight >= DEFAULT_UPPER_LIMIT) {
          if (prevHeight > adjustedHeight) {
            return upperLimit;
          }
          return prevHeight < lowerLimit ? lowerLimit : prevHeight;
        }

        if (adjustedHeight < DEFAULT_LOWER_LIMIT) {
          if (prevHeight < adjustedHeight) {
            return prevHeight < lowerLimit ? upperLimit : prevHeight;
          }
          if (prevHeight > adjustedHeight) {
            return prevHeight > upperLimit ? upperLimit : prevHeight;
          }
        }

        if (prevHeight > adjustedHeight) {
          return upperLimit;
        }

        return prevHeight;
      });
    }
  }, [contentHeight, lowerLimit, upperLimit]);

  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = "none";
      hiddenInputRef.current?.focus();
    } else {
      document.body.style.userSelect = "";
    }
  }, [isResizing]);

  useEffect(() => {
    const resize = (e: MouseEvent) => {
      if (!isResizing) return;

      const editorElement = monacoContainerRef.current;

      if (!editorElement) return;

      const scrollTop = editorElement.scrollTop;

      requestAnimationFrame(() => {
        setHeight((prevHeight) => {
          const newHeight = Math.min(upperLimit, Math.max(lowerLimit, prevHeight + e.movementY));

          setTimeout(() => {
            if (editorElement) {
              editorElement.scrollTop = scrollTop;
            }
          }, 0);

          return newHeight;
        });
      });
    };

    const stopResizing = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, lowerLimit, upperLimit]);

  const handleHeightChange = (newHeight: number) => {
    const editorElement = monacoContainerRef.current;
    const scrollTop = editorElement?.scrollTop ?? 0;

    setHeight(newHeight);

    setTimeout(() => {
      if (editorElement) {
        editorElement.scrollTop = scrollTop;
      }
    }, 0);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
  };

  return (
    <div
      className="vertical-adjustable relative w-full rounded-lg border shadow-md overflow-hidden"
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={monacoContainerRef}
    >
      <input
        type="text"
        ref={hiddenInputRef}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />

      {children}

      <div className="adjustable-footer absolute bottom-1 w-full h-16 flex flex-col items-center justify-center bg-slate-100">
        <input
          type="number"
          className="border p-1 rounded"
          value={height}
          onChange={(e) => handleHeightChange(Number(e.target.value))}
        />
      </div>

      <div
        className={`absolute bottom-1 right-1 p-1 -rotate-90 cursor-ns-resize transition-all
          ${isResizing || isHovered ? "text-slate-400" : "opacity-0"}
          ${isResizing ? "bg-slate-400/50 rounded-full" : ""}
          hover:bg-slate-400/50 hover:rounded-full
        `}
        onMouseDown={handleMouseDown}
      >
        <Axis3d size={20} />
      </div>
    </div>
  );
};
