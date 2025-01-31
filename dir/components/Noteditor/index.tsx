'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import PlaygroundEditorTheme from '../Editor/themes/PlaygroundEditorTheme';
import { SharedHistoryContext } from '../Editor/context/SharedHistoryContext';
import { TableContext } from '../Editor/plugins/TablePlugin';
import { ToolbarContext } from '../Editor/context/ToolbarContext';
import Editor from '../Editor';
import PlaygroundNodes from '../Editor/nodes/PlaygroundNodes';
import React from 'react';

function $prepopulatedNotEditorText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {    
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode('This is a reusable NotEditor component. Customize it as needed.')
    );
    root.append(paragraph);
  }
}

export default function NotEditor(): React.JSX.Element {
  const initialConfig = {
    editorState: $prepopulatedNotEditorText,
    namespace: 'NotEditor',
    nodes: [...PlaygroundNodes],
    theme: PlaygroundEditorTheme,
    onError: (error: Error) => {
      console.error('NotEditor Error:', error);
    },
  };

  return (
    
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <ToolbarContext>
              <div className="editor-container">
                <Editor />               
              </div>
            </ToolbarContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    
  );
}
