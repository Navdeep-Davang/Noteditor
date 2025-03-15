/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import {$isLinkNode} from '@lexical/link';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  getDOMSelection,
  LexicalEditor,
} from 'lexical';
import {Dispatch, useCallback, useEffect, useState} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';

import {getSelectedNode} from '@/dir/utils/getSelectedNode';
import TextFormatFloatingToolbar from './TextFormatFloatingToolbar';


function useFloatingToolbar(
  activeEditor: LexicalEditor,
  setActiveEditor : Dispatch<React.SetStateAction<LexicalEditor>>,
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  setIsLinkEditMode: Dispatch<boolean>,
): React.JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isCapitalize, setIsCapitalize] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      // console.log("Selection:", selection);
      // console.log("Native Selection:", nativeSelection);
      // console.log("Root Element:", rootElement);

      if (
        nativeSelection === null || 
        !$isRangeSelection(selection) || 
        rootElement === null || 
        !rootElement.contains(nativeSelection.anchorNode) 
      ) {
        // console.log("Invalid selection, setting isText to false");
        setIsText(false);
        return;
      }

      if (selection.isCollapsed()) {
        // console.log("Collapsed selection detected, hiding toolbar.");
        setIsText(false);
        return;
      }

      const node = getSelectedNode(selection);
      // console.log("Selected Node:", node);

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        // console.log("No visible text selected, hiding toolbar.");
        setIsText(false);
        return;
      }

      // TODO :: Uncomment the below to show the FloatingToolbar, currently not setted to true for developement purpose  
      // setIsText(true);

      
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsUppercase(selection.hasFormat('uppercase'));
      setIsLowercase(selection.hasFormat('lowercase'));
      setIsCapitalize(selection.hasFormat('capitalize'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));    

      
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem} 
      activeEditor = {activeEditor}
      setActiveEditor = {setActiveEditor}     
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUppercase={isUppercase}
      isLowercase={isLowercase}
      isCapitalize={isCapitalize}
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
  activeEditor,
  setActiveEditor,
  anchorElem = activeEditor.getRootElement() || document.body,
  setIsLinkEditMode,
}: {
  activeEditor: LexicalEditor
  setActiveEditor: Dispatch<React.SetStateAction<LexicalEditor>>
  anchorElem?: HTMLElement;
  setIsLinkEditMode: Dispatch<boolean>;
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const floatingToolbar = useFloatingToolbar(
    activeEditor,
    setActiveEditor,
    editor,
    anchorElem,
    setIsLinkEditMode
  );
  // console.log("Floating toolbar component:", floatingToolbar);
  return floatingToolbar;
}
