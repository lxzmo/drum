---
nav: 文档
title: 完整功能
group:
  order: 0
order: 0
---

# 完整功能

```tsx
/**
 * background: '#eee'
 * transform: true
 */

import {
  LexicalComposer,
  Editor,
  InitialConfigType,
  ImageNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  DefaultTheme,
  ListItemNode,
  ListNode,
  HeadingNode,
  QuoteNode,
  HorizontalRuleNode,
  AutoLinkNode,
  LinkNode,
  CodeHighlightNode,
  CodeNode,
  MarkNode,
  TableBoxNode,
  OnChangePlugin,
} from '@lxzmo/drum';

export default () => {
  const initConfig: InitialConfigType = {
    namespace: 'DrumEditor',
    nodes: [
      ImageNode,
      TableCellNode,
      TableNode,
      TableRowNode,
      ListItemNode,
      ListNode,
      HeadingNode,
      QuoteNode,
      HorizontalRuleNode,
      AutoLinkNode,
      LinkNode,
      CodeHighlightNode,
      CodeNode,
      MarkNode,
      TableBoxNode,
    ],
    onError: (error) => {
      throw error;
    },
    theme: DefaultTheme,
  };
  return (
    <div>
      <LexicalComposer initialConfig={initConfig}>
        <Editor />
        <OnChangePlugin
          ignoreHistoryMergeTagChange={true}
          ignoreSelectionChange={true}
          onChange={(editorState) => {
            console.log(JSON.stringify(editorState.toJSON()));
          }}
        />
      </LexicalComposer>
    </div>
  );
};
```
