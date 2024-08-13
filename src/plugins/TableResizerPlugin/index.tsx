import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { LexicalEditor } from 'lexical';
import React, { ReactPortal, useMemo } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  editor: LexicalEditor;
};
const TableCellResizer: React.FC<Props> = ({ editor }) => {
  return <></>;
};

export function TableResizerPlugin(): null | ReactPortal {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return useMemo(
    () =>
      isEditable
        ? createPortal(<TableCellResizer editor={editor} />, document.body)
        : null,
    [editor, isEditable],
  );
}
