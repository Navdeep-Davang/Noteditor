
import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Code, Link, CaseUpper, CaseLower } from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  getDOMSelection,
  LexicalEditor,
 
} from 'lexical';
import {$isCodeHighlightNode} from '@lexical/code';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';

import {getDOMRangeRect} from '@/dir/utils/getDOMRangeRect';
import {getSelectedNode} from '@/dir/utils/getSelectedNode';
import { Dispatch, useEffect, useRef, useState, useCallback, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { Popover, PopoverContent } from '@/components/ui/popover';

function TextFormatFloatingToolbar({
  editor,  
  isPopoverOpen,
  popoverPosition,
  setIsPopoverOpen,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isUppercase,
  isLowercase,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isPopoverOpen: boolean,
  popoverPosition: { x: number, y: number },
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>,
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isUppercase: boolean;
  isLowercase: boolean;
  isCode: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isLink: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}) {

  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);



  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverContent
        align="start"
        style={{ left: `${popoverPosition.x}px`, top: `${popoverPosition.y}px` }}
      >
        <div ref={popupCharStylesEditorRef}>
          <div           
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={'popup-item ' + (isBold ? 'active' : '')}
            title="Bold"
            aria-label="Format text as bold">
            <Bold size={16} className="icon-color" />
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={'popup-item ' + (isItalic ? 'active' : '')}
            title="Italic"
            aria-label="Format text as italics">
            <Italic size={16} className="icon-color" />
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={'popup-item spaced ' + (isUnderline ? 'active' : '')}
            title="Underline"
            aria-label="Format text to underlined">
            <Underline size={16} className="icon-color" />
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
            className={'popup-item spaced ' + (isStrikethrough ? 'active' : '')}
            title="Strikethrough"
            aria-label="Format text with a strikethrough">
            <Strikethrough size={16} className="icon-color"/>
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
            }}
            className={'popup-item spaced ' + (isSubscript ? 'active' : '')}
            title="Subscript"
            aria-label="Format Subscript">
            <Subscript size={16} className="icon-color" />
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
            }}
            className={'popup-item spaced ' + (isSuperscript ? 'active' : '')}
            title="Superscript"
            aria-label="Format Superscript">
            <Superscript size={16} className="icon-color" />
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase');
            }}
            className={'popup-item spaced ' + (isUppercase ? 'active' : '')}
            title="Uppercase"
            aria-label="Format text to uppercase">
            <CaseUpper size={16} className="icon-color" />
          </div>
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase');
            }}
            className={'popup-item spaced ' + (isLowercase ? 'active' : '')}
            title="Lowercase"
            aria-label="Format text to lowercase">
            <CaseLower size={16} className="icon-color" />
          </div>          
          <div
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            className={'popup-item spaced ' + (isCode ? 'active' : '')}
            title="Insert code block"
            aria-label="Insert code block">
            <Code size={16} className="icon-color"/>
          </div>
          <div
            onClick={insertLink}
            className={'popup-item spaced ' + (isLink ? 'active' : '')}
            title="Insert link"
            aria-label="Insert link">
            <Link size={16} className="icon-color"/>
          </div>
          {/* Add other buttons like the original code */}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function useFloatingToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  setIsLinkEditMode: Dispatch<boolean>,
): React.JSX.Element | null {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  
  const updatePopoverPosition = useCallback(() => {
    editor.getEditorState().read(() => {

      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      
      const rootElement = editor.getRootElement();
      if (!rootElement || !nativeSelection || !selection) return;

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }
    
      const selectedNode = getSelectedNode(selection);

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsUppercase(selection.hasFormat('uppercase'));
      setIsLowercase(selection.hasFormat('lowercase'));      
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const parent = selectedNode.getParent();
      if ($isLinkNode(parent) || $isLinkNode(selectedNode)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
      // Update text as per the codehighlight
      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(selectedNode) || $isParagraphNode(selectedNode));
      } else {
        setIsText(false);
      }
      // Update raw text if blankspace
      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
        return;
      }

      //specific to the popover component
      if (selectedNode) {
        const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
        setPopoverPosition({ x: rangeRect.x, y: rangeRect.y });
        setIsPopoverOpen(true); // Open the popover when text is selected
      }

    })
    
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopoverPosition);
    return () => {
      document.removeEventListener('selectionchange', updatePopoverPosition);
    };
  }, [updatePopoverPosition]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopoverPosition();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopoverPosition]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isPopoverOpen= {isPopoverOpen}
      popoverPosition= {popoverPosition}
      setIsPopoverOpen={setIsPopoverOpen}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUppercase={isUppercase}
      isLowercase={isLowercase}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem,
  );
}



export default function FloatingToolbarPlugin({
  anchorElem = document.body,
  setIsLinkEditMode,
}: {
  anchorElem?: HTMLElement;
  setIsLinkEditMode: Dispatch<boolean>;
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingToolbar(editor, anchorElem, setIsLinkEditMode);
}
