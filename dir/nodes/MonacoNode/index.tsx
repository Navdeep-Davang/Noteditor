import type { JSX } from 'react';
import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
} from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

const MonacoEditorComponent = React.lazy(() => import('./MonacoEditorComponent'));

export type SerializedMonacoNode = Spread<
  {
    language: string;
    code: string;
  },
  SerializedLexicalNode
>;

function $convertCodeBlockElement(domNode: HTMLElement): DOMConversionOutput | null {
  const language = domNode.getAttribute('data-lexical-code-language');
  const code = domNode.getAttribute('data-lexical-code-content');
  if (language !== null && code !== null) {
    return { node: $createMonacoNode(language, code) };
  }
  return null;
}

export class MonacoNode extends DecoratorNode<JSX.Element> {
  __language: string;
  __code: string;

  static getType(): string {
    return 'monaco';
  }

  static clone(node: MonacoNode): MonacoNode {
    return new MonacoNode(node.__language, node.__code, node.__key);
  }

  static importJSON(serializedNode: SerializedMonacoNode): MonacoNode {
    return $createMonacoNode(serializedNode.language, serializedNode.code);
  }

  constructor(language: string, code: string, key?: NodeKey) {
    super(key);
    this.__language = language;
    this.__code = code;
  }

  exportJSON(): SerializedMonacoNode {
    return {
      ...super.exportJSON(),
      language: this.__language,
      code: this.__code,
    };
  }

  getCode(): string {
    return this.__code;
  }
  
  getLanguage(): string {
    return this.__language;
  }

  setLanguage(language: string): void {
    const self = this.getWritable();
    self.__language = language;
  }

  setCode(code: string): void {
    const self = this.getWritable();
    self.__code = code;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      pre: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-code-language')) {
          return null;
        }
        return { conversion: $convertCodeBlockElement, priority: 2 };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('pre');
    element.setAttribute('data-lexical-code-language', this.__language);
    element.setAttribute('data-lexical-code-content', this.__code);
    return { element };
  }

  createDOM(): HTMLElement {
    const elem = document.createElement('pre');
    elem.style.display = 'block';
    return elem;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    
    return (
      <Suspense fallback={null}>
        <MonacoEditorComponent nodeKey={this.__key}/>

      </Suspense>
    );
  }
}

export function $createMonacoNode(language: string, code: string): MonacoNode {
  return new MonacoNode(language, code);
}

export function $isMonacoNode(node: LexicalNode | null | undefined): node is MonacoNode {
  return node instanceof MonacoNode;
}
