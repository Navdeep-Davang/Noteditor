'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import EditorTheme from './EditorTheme';
// import { TableContext } from '../Editor/plugins/TablePlugin';
// import { ToolbarContext } from '../Editor/context/ToolbarContext';
import Nodes from '../Nodes';
import React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../Editor'), { ssr: false });


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
    nodes: [...Nodes],
    theme: EditorTheme,
    onError: (error: Error) => {
      console.error('NotEditor Error:', error);
    },
  };

  return (
    
      <LexicalComposer initialConfig={initialConfig}>        
          {/* <TableContext>
            <ToolbarContext> */}
              <div className="editor-container">
                <Editor />               
              </div>
            {/* </ToolbarContext>
          </TableContext>         */}
      </LexicalComposer>
    
  );
}
