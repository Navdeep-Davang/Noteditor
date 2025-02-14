import React from "react";
import Editor from "@monaco-editor/react";
import * as monacoEditor from 'monaco-editor';

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ language, value, onChange }) => {
  const handleEditorMount = (editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (model) {
      model.updateOptions({ tabSize: 2, insertSpaces: true });
    }
  };

  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      value={value}
      onChange={(newValue) => onChange(newValue || "")}
      onMount={handleEditorMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontFamily: "Fira Code, monospace",
        tabSize: 2,
        detectIndentation: false,
        wordWrap: "off",
      }}
    />
  );
};

export default MonacoEditorComponent;
