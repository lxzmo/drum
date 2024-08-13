import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons';
import { $patchStyleText } from '@lexical/selection';
import { Button, Popover } from 'antd';
import { $getSelection, LexicalEditor } from 'lexical';
import React, { useState } from 'react';
import { FontSizeInfo } from '../constants';

type Props = {
  editor: LexicalEditor;
  disabled?: boolean;
  value: string;
};
export const FontSizeDropdown: React.FC<Props> = ({
  editor,
  disabled,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const updateFontSizeInSelection = React.useCallback(
    (newFontSize: string) => {
      setOpen(false);
      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              'font-size': newFontSize,
            });
          }
        }
      });
    },
    [editor],
  );

  return (
    <>
      <Popover
        placement="bottomLeft"
        overlayInnerStyle={{ padding: '0px' }}
        arrow={false}
        open={open}
        onOpenChange={handleOpenChange}
        content={
          <div className="drum-dropdown-content" style={{ width: '100px' }}>
            {Object.keys(FontSizeInfo).map((key, index) => {
              return (
                <div
                  key={index}
                  className={`drum-dropdown-item ${
                    value === key ? 'active' : ''
                  }`}
                  onClick={() => {
                    updateFontSizeInSelection(key);
                  }}
                >
                  <span>{FontSizeInfo[key].name}</span>
                  {value === key && <CheckOutlined />}
                </div>
              );
            })}
          </div>
        }
        trigger="click"
      >
        <Button
          disabled={!!disabled}
          type="text"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div style={{ width: '35px', textAlign: 'left' }}>{value}</div>
          <CaretDownOutlined />
        </Button>
      </Popover>
    </>
  );
};
