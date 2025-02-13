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

export type SerializedCodeBlockNode = Spread<
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
    return { node: $createCodeBlockNode(language, code) };
  }
  return null;
}

export class CodeBlockNode extends DecoratorNode<JSX.Element> {
  __language: string;
  __code: string;

  static getType(): string {
    return 'codeblock';
  }

  static clone(node: CodeBlockNode): CodeBlockNode {
    return new CodeBlockNode(node.__language, node.__code, node.__key);
  }

  static importJSON(serializedNode: SerializedCodeBlockNode): CodeBlockNode {
    return $createCodeBlockNode(serializedNode.language, serializedNode.code);
  }

  constructor(language: string, code: string, key?: NodeKey) {
    super(key);
    this.__language = language;
    this.__code = code;
  }

  exportJSON(): SerializedCodeBlockNode {
    return {
      ...super.exportJSON(),
      language: this.__language,
      code: this.__code,
    };
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
        <MonacoEditorComponent language={this.__language} value={this.__code} onChange={(newValue) => this.__code = newValue} />

      </Suspense>
    );
  }
}

export function $createCodeBlockNode(language: string, code: string): CodeBlockNode {
  return new CodeBlockNode(language, code);
}

export function $isCodeBlockNode(node: LexicalNode | null | undefined): node is CodeBlockNode {
  return node instanceof CodeBlockNode;
}
