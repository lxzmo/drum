import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import './index.less';

type DropdownOptionItem = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type Props = {
  disabled?: boolean;
  buttonLabel: string;
  options: DropdownOptionItem[];
  activeOption?: string;
  onChange?: (value: string) => void;
};
export const Dropdown: React.FC<Props> = ({
  disabled,
  buttonLabel,
  options = [],
  activeOption,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
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
            {options.map((item, key) => {
              return (
                <div
                  className={`drum-dropdown-item ${
                    activeOption === item.value ? 'active' : ''
                  }`}
                  key={key}
                  onClick={() => {
                    setOpen(false);
                    onChange?.(item.value);
                  }}
                >
                  {item.label}
                  {activeOption === item.value && <CheckOutlined />}
                </div>
              );
            })}
          </div>
        }
        trigger="click"
      >
        <Button disabled={!!disabled} type="text">
          <div style={{ width: '80px', textAlign: 'left' }}> {buttonLabel}</div>
          <CaretDownOutlined />
        </Button>
      </Popover>
    </>
  );
};
