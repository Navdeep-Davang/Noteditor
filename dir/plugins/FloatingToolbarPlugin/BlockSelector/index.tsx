import * as React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, Code, AlignLeft } from "lucide-react";
import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from "@lexical/rich-text";
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { SHORTCUTS } from "../../ShortcutsPlugin/shortcuts";
import { dropDownActiveClass } from "@/dir/utils/dropDownActiveClass";

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};


interface BlockSelectorProps {
  blockType: keyof typeof blockTypeToBlockName; 
  editor: LexicalEditor;
  disabled?: boolean;
}


const blockTypeIcons = {
  paragraph: <AlignLeft className="icon paragraph" />,
  h1: <Heading1 className="icon h1" />,
  h2: <Heading2 className="icon h2" />,
  h3: <Heading3 className="icon h3" />,
  bullet: <List className="icon bullet-list" />,
  number: <ListOrdered className="icon numbered-list" />,
  check: <CheckSquare className="icon check-list" />,
  quote: <Quote className="icon quote" />,
  code: <Code className="icon code" />,
};

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
};

export const formatHeading = (
  editor: LexicalEditor,
  blockType: string,
  headingSize: HeadingTagType,
) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  }
};

export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatNumberedList = (
  editor: LexicalEditor,
  blockType: string,
) => {
  if (blockType !== 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatCheckList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'check') {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatQuote = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createQuoteNode());
    });
  }
};



export function BlockSelector({ editor, blockType, disabled = false }: BlockSelectorProps): React.JSX.Element {
  return (
    <Select
      value={blockType}
      onValueChange={(value) => {
        switch (value) {
          case "paragraph":
            formatParagraph(editor);
            break;
          case "h1":
            formatHeading(editor, blockType, "h1");
            break;
          case "h2":
            formatHeading(editor, blockType, "h2");
            break;
          case "h3":
            formatHeading(editor, blockType, "h3");
            break;
          case "bullet":
            formatBulletList(editor, blockType);
            break;
          case "number":
            formatNumberedList(editor, blockType);
            break;
          case "check":
            formatCheckList(editor, blockType);
            break;
          case "quote":
            formatQuote(editor, blockType);
            break;          
          default:
            break;
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger className="toolbar-item block-controls">
        <SelectValue placeholder="Select Format" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(blockTypeIcons).map((type) => (
            <SelectItem key={type} value={type} className={`item wide ${dropDownActiveClass(blockType === type)}`}>
              <div className="icon-text-container">
                {blockTypeIcons[type as keyof typeof blockTypeIcons]}
                <span className="text">{blockTypeToBlockName[type as keyof typeof blockTypeToBlockName]}</span>
              </div>
              <span className="shortcut">{SHORTCUTS[type.toUpperCase() as keyof typeof SHORTCUTS]}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
