/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { addClassNamesToElement } from '@lexical/utils';
import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
} from 'lexical';

export type SerializedTableBoxNode = SerializedElementNode;

export class TableBoxNode extends ElementNode {
  static getType(): string {
    return 'tablebox';
  }

  static clone(node: TableBoxNode): TableBoxNode {
    return new TableBoxNode(node.__key);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (_node: Node) => ({
        conversion: $convertTableBoxElement,
        priority: 1,
      }),
    };
  }

  static importJSON(): TableBoxNode {
    return $createTableBoxNode();
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'tablebox',
      version: 1,
    };
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const tableBoxElement = document.createElement('div');
    addClassNamesToElement(tableBoxElement, config.theme.tableBox);
    return tableBoxElement;
  }

  updateDOM(): boolean {
    return false;
  }
}

export function $convertTableBoxElement(_domNode: Node): DOMConversionOutput {
  return { node: $createTableBoxNode() };
}

export function $createTableBoxNode(): TableBoxNode {
  return $applyNodeReplacement(new TableBoxNode());
}

export function $isTableBoxNode(
  node: LexicalNode | null | undefined,
): node is TableBoxNode {
  return node instanceof TableBoxNode;
}
