import type { Klass, LexicalNode } from 'lexical';

import { HashtagNode } from '@lexical/hashtag';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { OverflowNode } from '@lexical/overflow';
import { LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeHighlightNode, CodeNode } from '@lexical/code';

const Nodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode, 
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  HorizontalRuleNode,
  OverflowNode
];

export default Nodes;
