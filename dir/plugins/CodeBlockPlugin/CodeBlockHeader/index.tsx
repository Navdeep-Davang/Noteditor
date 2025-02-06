import { CODE_LANGUAGE_FRIENDLY_NAME_MAP,getLanguageFriendlyName } from '@/dir/nodes/CodeHighlightNode';
import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'; // Assuming you're using a Select component from your library
import { dropDownActiveClass } from '@/dir/utils/dropDownActiveClass';

interface CodeBlockHeaderProps {
  language: string;
  onLanguageChange: (newLanguage: string) => void;
}


const CODE_LANGUAGE_OPTIONS: [string, string][] = Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP);


export const CodeBlockHeader: React.FC<CodeBlockHeaderProps> = ({ language, onLanguageChange }) => {
 
   return (
    <div className="code-block-header">
      <Select value={language} onValueChange={onLanguageChange} aria-label="Select language">
        <SelectTrigger>
          <SelectValue>{getLanguageFriendlyName(language)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="toolbar-item code-language">
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => (
            <SelectItem
              key={value}
              value={value}
              className={`item ${dropDownActiveClass(value === language)}`}
            >
              <span className="text">{name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
