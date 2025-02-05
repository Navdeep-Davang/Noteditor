/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



import type {EditorThemeClasses} from 'lexical';

const theme: EditorThemeClasses = {
  autocomplete: 'EditorTheme__autocomplete',
  blockCursor: 'EditorTheme__blockCursor',
  characterLimit: 'EditorTheme__characterLimit',
  code: 'EditorTheme__code',
  codeHighlight: {
    atrule: 'EditorTheme__tokenAtrule',
    attr: 'EditorTheme__tokenAttrName',
    boolean: 'EditorTheme__tokenBoolean',
    builtin: 'EditorTheme__tokenBuiltin',
    cdata: 'EditorTheme__tokenCdata',
    char: 'EditorTheme__tokenChar',
    class: 'EditorTheme__tokenClassName',
    'class-name': 'EditorTheme__tokenClassName',
    comment: 'EditorTheme__tokenComment',
    constant: 'EditorTheme__tokenConstant',
    deleted: 'EditorTheme__tokenDeleted',
    doctype: 'EditorTheme__tokenDoctype',
    entity: 'EditorTheme__tokenEntity',
    function: 'EditorTheme__tokenFunction',
    important: 'EditorTheme__tokenImportant',
    inserted: 'EditorTheme__tokenInserted',
    keyword: 'EditorTheme__tokenKeyword',
    namespace: 'EditorTheme__tokenNamespace',
    number: 'EditorTheme__tokenNumber',
    operator: 'EditorTheme__tokenOperator',
    prolog: 'EditorTheme__tokenProlog',
    property: 'EditorTheme__tokenProperty',
    punctuation: 'EditorTheme__tokenPunctuation',
    regex: 'EditorTheme__tokenRegex',
    selector: 'EditorTheme__tokenSelector',
    string: 'EditorTheme__tokenString',
    symbol: 'EditorTheme__tokenSymbol',
    tag: 'EditorTheme__tokenTag',
    url: 'EditorTheme__tokenUrl',
    variable: 'EditorTheme__tokenVariable',
  },
  embedBlock: {
    base: 'EditorTheme__embedBlock',
    focus: 'EditorTheme__embedBlockFocus',
  },
  hashtag: 'EditorTheme__hashtag',
  heading: {
    h1: 'EditorTheme__h1',
    h2: 'EditorTheme__h2',
    h3: 'EditorTheme__h3',
    h4: 'EditorTheme__h4',
    h5: 'EditorTheme__h5',
    h6: 'EditorTheme__h6',
  },
  hr: 'EditorTheme__hr',
  image: 'editor-image',
  indent: 'EditorTheme__indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'EditorTheme__layoutContainer',
  layoutItem: 'EditorTheme__layoutItem',
  link: 'EditorTheme__link',
  list: {
    checklist: 'EditorTheme__checklist',
    listitem: 'EditorTheme__listItem',
    listitemChecked: 'EditorTheme__listItemChecked',
    listitemUnchecked: 'EditorTheme__listItemUnchecked',
    nested: {
      listitem: 'EditorTheme__nestedListItem',
    },
    olDepth: [
      'EditorTheme__ol1',
      'EditorTheme__ol2',
      'EditorTheme__ol3',
      'EditorTheme__ol4',
      'EditorTheme__ol5',
    ],
    ul: 'EditorTheme__ul',
  },
  ltr: 'EditorTheme__ltr',
  mark: 'EditorTheme__mark',
  markOverlap: 'EditorTheme__markOverlap',
  paragraph: 'EditorTheme__paragraph',
  quote: 'EditorTheme__quote',
  rtl: 'EditorTheme__rtl',
  specialText: 'EditorTheme__specialText',
  tab: 'EditorTheme__tabNode',
  table: 'EditorTheme__table',
  tableCell: 'EditorTheme__tableCell',
  tableCellActionButton: 'EditorTheme__tableCellActionButton',
  tableCellActionButtonContainer:
    'EditorTheme__tableCellActionButtonContainer',
  tableCellHeader: 'EditorTheme__tableCellHeader',
  tableCellResizer: 'EditorTheme__tableCellResizer',
  tableCellSelected: 'EditorTheme__tableCellSelected',
  tableRowStriping: 'EditorTheme__tableRowStriping',
  tableScrollableWrapper: 'EditorTheme__tableScrollableWrapper',
  tableSelected: 'EditorTheme__tableSelected',
  tableSelection: 'EditorTheme__tableSelection',
  text: {
    bold: 'EditorTheme__textBold',
    capitalize: 'EditorTheme__textCapitalize',
    code: 'EditorTheme__textCode',
    italic: 'EditorTheme__textItalic',
    lowercase: 'EditorTheme__textLowercase',
    strikethrough: 'EditorTheme__textStrikethrough',
    subscript: 'EditorTheme__textSubscript',
    superscript: 'EditorTheme__textSuperscript',
    underline: 'EditorTheme__textUnderline',
    underlineStrikethrough: 'EditorTheme__textUnderlineStrikethrough',
    uppercase: 'EditorTheme__textUppercase',
  },
};

export default theme;