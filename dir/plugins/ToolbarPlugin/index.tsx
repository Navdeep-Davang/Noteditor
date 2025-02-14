/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Redo, Strikethrough, TerminalSquare, Underline, Undo } from 'lucide-react';
import {useCallback, useEffect, useRef, useState} from 'react';
import { INSERT_MONACO_COMMAND } from '../MonacoPlugin';

const LowPriority = 1;

function Divider() {
    return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar-container my-4" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="toolbar-btn "
        aria-label="Undo">
        <Undo size={18} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="toolbar-btn"
        aria-label="Redo">
        <Redo size={18} />
      </button>
      <Divider />
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`toolbar-btn  ${isBold ? 'active' : ''}`}
        aria-label="Bold">
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`toolbar-btn  ${isItalic ? 'active' : ''}`}
        aria-label="Italic">
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`toolbar-btn  ${isUnderline ? 'active' : ''}`}
        aria-label="Underline">
        <Underline size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={`toolbar-btn  ${isStrikethrough ? 'active' : ''}`}
        aria-label="Strikethrough">
        <Strikethrough size={18} />
      </button>
      <Divider />
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className="toolbar-btn "
        aria-label="Left Align">
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className="toolbar-btn "
        aria-label="Center Align">
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className="toolbar-btn "
        aria-label="Right Align">
        <AlignRight size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        className="toolbar-btn"
        aria-label="Justify Align">
        <AlignJustify size={18} />
      </button>
      <Divider />
      <button
        onClick={() => editor.dispatchCommand(INSERT_MONACO_COMMAND, {language: 'javascript', code:''})}
        className="monaco-btn"
        aria-label="Monaco Block">
        <TerminalSquare size={18} />
      </button>
    </div>
  );
}