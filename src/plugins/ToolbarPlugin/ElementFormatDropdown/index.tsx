import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
} from 'lexical';
import React, { useState } from 'react';
import { ElementFormatInfo } from '../constants';

type Props = {
  editor: LexicalEditor;
  value: ElementFormatType;
  disabled: boolean;
};
export const ElementFormatDropdown: React.FC<Props> = ({
  editor,
  value,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onClick = (key: ElementFormatType) => {
    setOpen(false);
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, key);
  };

  return (
    <>
      <Popover
        placement="bottomLeft"
        overlayInnerStyle={{ padding: '0px' }}
        arrow={false}
        open={open}
        onOpenChange={handleOpenChange}
        content={
          <div className="drum-dropdown-content">
            {Object.keys(ElementFormatInfo).map((key, index) => {
              return (
                <div
                  key={index}
                  className={`drum-dropdown-item ${
                    value === key ? 'active' : ''
                  }`}
                  onClick={() => {
                    onClick(key as any);
                  }}
                >
                  <div>
                    {ElementFormatInfo[key].icon}{' '}
                    <span>{ElementFormatInfo[key].name}</span>
                  </div>
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
          <div style={{ width: '10px', textAlign: 'left' }}>
            {!!value ? ElementFormatInfo[value]?.icon : ''}{' '}
          </div>
          <CaretDownOutlined />
        </Button>
      </Popover>
    </>
  );
};
