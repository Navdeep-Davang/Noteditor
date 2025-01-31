

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import * as React from "react";
import ContentEditable from '../ContentEditable';

export default function Editor(): React.JSX.Element {
  const isEditable = useLexicalEditable();

  return (
    <div className="editor-container">
      <AutoFocusPlugin />
      <ClearEditorPlugin />
      <HashtagPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TablePlugin />
      <TabIndentationPlugin maxIndent={7} />
      <SelectionAlwaysOnDisplay />      
      <ClickableLinkPlugin disabled={!isEditable} />
      <HorizontalRulePlugin />
      <RichTextPlugin
        contentEditable={
          <div className="editor-scroller">            
              <ContentEditable placeholder={"Type Here"} />         
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </div>
  );
}
