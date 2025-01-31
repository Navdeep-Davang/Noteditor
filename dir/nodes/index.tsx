import type { Klass, LexicalNode } from 'lexical';

import { HashtagNode } from '@lexical/hashtag';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { OverflowNode } from '@lexical/overflow';
import { LinkNode } from '@lexical/link';

const Nodes: Array<Klass<LexicalNode>> = [
  ListNode,
  LinkNode, 
  ListItemNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  HorizontalRuleNode,
  OverflowNode
];

export default Nodes;
