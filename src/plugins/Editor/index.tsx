import { CAN_USE_DOM } from '@lexical/utils';
import {
  AutoFocusPlugin,
  CheckListPlugin,
  ClearEditorPlugin,
  CodeActionMenuPlugin,
  CodeHighlightPlugin,
  CommentPlugin,
  ComponentPickerMenuPlugin,
  ContentEditable,
  DragDropPaste,
  DraggableBlockPlugin,
  DrumTablePlugin,
  FloatingLinkEditorPlugin,
  FloatingTextFormatToolbarPlugin,
  HistoryPlugin,
  HorizontalRulePlugin,
  ImagesPlugin,
  LexicalErrorBoundary,
  ListPlugin,
  MarkdownShortcutPlugin,
  RichTextPlugin,
  TabFocusPlugin,
  TabIndentationPlugin,
  TableCellResizerPlugin,
  ToolbarPlugin,
} from '@lxzmo/drum';
import React, { useEffect, useState } from 'react';
import LinkPlugin from '../LinkPlugin';
import './index.less';

const placeholder = '输入“/”快速插入';

export const Editor: React.FC = () => {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <div className="editor-shell">
      <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <ContentEditable
                  className="content-editable-root"
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="content-editable-placeholder">
                      {placeholder}
                    </div>
                  }
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={null}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ImagesPlugin />
        <DrumTablePlugin
          hasCellMerge={true}
          hasCellBackgroundColor={true}
          hasTabHandler={true}
        />
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <LinkPlugin />
        <CodeHighlightPlugin />
        <MarkdownShortcutPlugin />
        <TabFocusPlugin />
        <TabIndentationPlugin />
        <ComponentPickerMenuPlugin />
        <DragDropPaste />
        <CommentPlugin />
        <ClearEditorPlugin />
        <TableCellResizerPlugin />
        {!!floatingAnchorElem && !isSmallWidthViewport && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}
      </div>
    </div>
  );
};
