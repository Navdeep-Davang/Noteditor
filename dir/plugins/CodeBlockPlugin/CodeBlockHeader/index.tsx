import { CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP, getLanguageFriendlyName } from '@/dir/nodes/CodeHighlightNode';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { $getNodeByKey, $getSelection, $isRangeSelection, $isRootOrShadowRoot, COMMAND_PRIORITY_CRITICAL, LexicalEditor, NodeKey, SELECTION_CHANGE_COMMAND } from 'lexical';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'; // Assuming you're using a Select component from your library
import { dropDownActiveClass } from '@/dir/utils/dropDownActiveClass';
import { $isCodeNode } from '@/dir/nodes/CodeNode';
import { $findMatchingParent } from '@lexical/utils';
import { useToolbarState } from '@/dir/context/ToolbarContext';

interface CodeBlockHeaderProps {
  editor: LexicalEditor
  activeEditor: LexicalEditor,
  setActiveEditor : Dispatch<React.SetStateAction<LexicalEditor>>,
  language: string;
  onLanguageChange: (newLanguage: string) => void;
  onCopy: () => void;
  isEditable: boolean;
}

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();


export const CodeBlockHeader: React.FC<CodeBlockHeaderProps> = ({toolbarState, onCodeLanguageSelect }) => {

  return (
    <div className="code-block-header">
      <Select
        disabled={!isEditable}
        value={toolbarState.codeLanguage}
        onValueChange={onCodeLanguageSelect}
        aria-label="Select language"
      >
        <SelectTrigger>
          <SelectValue>{getLanguageFriendlyName(toolbarState.codeLanguage)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="toolbar-item code-language">
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => (
            <SelectItem
              key={value}
              value={value}
              className={`item ${dropDownActiveClass(value === toolbarState.codeLanguage)}`}
            >
              <span className="text">{name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
