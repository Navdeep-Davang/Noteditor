

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import ContentEditable from '../ContentEditable';
import ShortcutsPlugin from "@/dir/plugins/ShortcutsPlugin";
import { CAN_USE_DOM } from "@/dir/shared/canUseDOM";
import FloatingLinkEditorPlugin from "@/dir/plugins/FloatingLinkEditorPlugin";
import FloatingToolbarPlugin from "@/dir/plugins/FloatingToolbarPlugin";
import TreeViewPlugin from "@/dir/plugins/TreeViewPlugin";
import MonacoPlugin from "@/dir/plugins/MonacoPlugin";
import ToolbarPlugin from "@/dir/plugins/ToolbarPlugin";
// import ComponentPickerMenuPlugin from "@/dir/plugins/ComponentPickerPlugin";
import SlashMenuPlugin from "@/dir/plugins/SlashMenuPlugin";
import SlashEventPlugin from "@/dir/plugins/SlashEventPlugin";


export default function Editor(): React.JSX.Element {
  const isEditable = useLexicalEditable();

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);     
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 756px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

    
  // console.log("floatingAnchorElem:", floatingAnchorElem);
  // console.log("isSmallWidthViewport:", isSmallWidthViewport);
  // console.log("Should render FloatingToolbarPlugin:", floatingAnchorElem && !isSmallWidthViewport);

  return (
    <div className="editor-container">
      <ToolbarPlugin/>
      <AutoFocusPlugin />
      <ClearEditorPlugin />
      <HashtagPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin/>
      {/* <ComponentPickerMenuPlugin/> */}
      <SlashMenuPlugin/>
      <SlashEventPlugin/>
      <CheckListPlugin />
      <MonacoPlugin/>
      <TablePlugin />
      <TabIndentationPlugin maxIndent={7} />
      <SelectionAlwaysOnDisplay />      
      <ClickableLinkPlugin disabled={!isEditable} />
      <HorizontalRulePlugin />
      <RichTextPlugin
        contentEditable={
          <div className="editor-scroller">
            <div className="editor" ref={onRef}>
              <ContentEditable placeholder={"Type Here"}  />
            </div>
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />

      <ShortcutsPlugin
        editor={activeEditor}
        setIsLinkEditMode={setIsLinkEditMode}
      />

      {floatingAnchorElem && !isSmallWidthViewport && (
        <>         
          <FloatingLinkEditorPlugin
            anchorElem={floatingAnchorElem}
            isLinkEditMode={isLinkEditMode}
            setIsLinkEditMode={setIsLinkEditMode}
          />         
          
          <FloatingToolbarPlugin
            activeEditor = {activeEditor}
            setActiveEditor = {setActiveEditor}
            anchorElem={floatingAnchorElem}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        </>
      )}

      <TreeViewPlugin/>

    </div>
  );
}
