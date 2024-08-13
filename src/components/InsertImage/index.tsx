import { INSERT_IMAGE_COMMAND } from '@lxzmo/drum';
import { Upload, UploadProps } from 'antd';
import { LexicalEditor } from 'lexical';
import React from 'react';

type Props = {
  editor: LexicalEditor;
  children: React.ReactNode;
  disabled?: boolean;
  onUpload?: () => void;
};
export const InsertImage: React.FC<Props> = ({
  disabled,
  editor,
  children,
  onUpload,
}) => {
  const loadImage = (file: File) => {
    let src = '';
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        src = reader.result;
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src,
          altText: '',
        });
      }
    };
    if (file !== null) {
      reader.readAsDataURL(file);
    }
  };

  const props: UploadProps = {
    disabled: !!disabled,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      loadImage(file);
      onUpload?.();
      return false;
    },
  };

  return (
    <>
      <Upload {...props}>{children}</Upload>
    </>
  );
};
