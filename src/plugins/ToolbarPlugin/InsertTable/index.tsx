import { TableOutlined } from '@ant-design/icons';
import { INSERT_TABLE_COMMAND } from '@lxzmo/drum';
import { IconButton } from '@lxzmo/drum/components/IconButton';
import { Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { LexicalEditor } from 'lexical';
import React, { useState } from 'react';
import './index.less';

const getTdList = () => {
  let tdList: TdItem[] = [];
  Array.from({ length: 9 }).forEach((_, x) => {
    Array.from({ length: 9 }).forEach((_, y) => {
      tdList.push({ x: x + 1, y: y + 1 });
    });
  });
  return tdList;
};

type TdItem = {
  y: number;
  x: number;
};

type Props = {
  editor: LexicalEditor;
  children?: React.ReactNode;
  disabled?: boolean;
  placement?: TooltipPlacement;
  trigger?: 'click' | 'hover';
  onClick?: () => void;
};
export const InsertTable: React.FC<Props> = ({
  editor,
  placement,
  children,
  disabled,
  trigger = 'click',
  onClick,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const [activeTd, setActiveTd] = React.useState<TdItem | null>(null);
  const [tdList] = React.useState<TdItem[]>(getTdList());

  const handleClick = (item: TdItem) => {
    onClick?.();
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: String(item.y),
      rows: String(item.x),
      includeHeaders: false,
    });
    setOpen(false);
  };

  return (
    <>
      <Popover
        arrow={false}
        open={open}
        onOpenChange={handleOpenChange}
        trigger={trigger}
        placement={placement ?? 'bottomLeft'}
        content={
          <div
            onMouseLeave={() => {
              setActiveTd(null);
            }}
            className="drum-insert-table-selected-box"
            onClick={() => {
              if (activeTd) {
                handleClick(activeTd);
              }
            }}
          >
            {tdList.map((item, index) => {
              return (
                <div
                  onMouseMove={() => {
                    setActiveTd(item);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(item);
                  }}
                  className={`drum-insert-table-td ${
                    activeTd && activeTd?.x >= item.x && activeTd?.y >= item.y
                      ? 'selected'
                      : ''
                  }`}
                  key={index}
                ></div>
              );
            })}
          </div>
        }
        title={
          <div className="drum-insert-table-title">
            <div>插入表格</div>
            {activeTd && (
              <div>
                {activeTd.y} x {activeTd.x}
              </div>
            )}
          </div>
        }
      >
        {children ?? (
          <IconButton disabled={!!disabled} icon={<TableOutlined />} />
        )}
      </Popover>
    </>
  );
};
