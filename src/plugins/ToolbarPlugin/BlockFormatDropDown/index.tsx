import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons';
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { Button, Popover } from 'antd';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from 'lexical';
import React, { useState } from 'react';
import { BlockTypeToBlockInfo } from '../constants';
import './index.less';

type Props = {
  editor: LexicalEditor;
  disabled?: boolean;
  buttonLabel: string;
  blockType?: string;
  hideLabel?: boolean;
  blockFormatRef?: React.RefObject<HTMLDivElement>;
};
export const BlockFormatDropDown: React.FC<Props> = ({
  editor,
  disabled,
  buttonLabel,
  blockType,
  hideLabel,
  blockFormatRef,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();
        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  const onClick = (key: string) => {
    setOpen(false);
    switch (key) {
      case 'paragraph':
        formatParagraph();
        break;
      case 'h1':
        formatHeading('h1');
        break;
      case 'h2':
        formatHeading('h2');
        break;
      case 'h3':
        formatHeading('h3');
        break;
      case 'h4':
        formatHeading('h4');
        break;
      case 'h5':
        formatHeading('h5');
        break;
      case 'h6':
        formatHeading('h6');
        break;
      case 'bullet':
        formatBulletList();
        break;
      case 'number':
        formatNumberedList();
        break;
      case 'check':
        formatCheckList();
        break;
      case 'quote':
        formatQuote();
        break;
      case 'code':
        formatCode();
        break;
    }
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
          <div className="drum-dropdown-content" ref={blockFormatRef}>
            {Object.keys(BlockTypeToBlockInfo).map((key, index) => {
              return (
                <div
                  key={index}
                  className={`drum-dropdown-item ${
                    blockType === key ? 'active' : ''
                  }`}
                  onClick={() => {
                    onClick(key);
                  }}
                >
                  <div>
                    {BlockTypeToBlockInfo[key].icon}{' '}
                    <span>{BlockTypeToBlockInfo[key].name}</span>
                  </div>
                  {blockType === key && <CheckOutlined />}
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
          <div
            style={{ width: !!hideLabel ? '10px' : '75px', textAlign: 'left' }}
          >
            {!!blockType ? BlockTypeToBlockInfo[blockType]?.icon : ''}{' '}
            {!!hideLabel ? '' : buttonLabel}
          </div>
          <CaretDownOutlined />
        </Button>
      </Popover>
    </>
  );
};
