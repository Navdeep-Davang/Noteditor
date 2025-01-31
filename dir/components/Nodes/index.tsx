import type { Klass, LexicalNode } from 'lexical';

import { HashtagNode } from '@lexical/hashtag';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { OverflowNode } from '@lexical/overflow';

const Nodes: Array<Klass<LexicalNode>> = [
  ListNode,
  ListItemNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  HorizontalRuleNode,
  OverflowNode
];

export default Nodes;
