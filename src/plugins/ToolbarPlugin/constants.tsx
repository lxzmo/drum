import {
  CheckSquareOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { IconFont } from '@lxzmo/drum/components/IconFont';
import React from 'react';

export const BlockTypeToBlockInfo: {
  [key: string]: {
    name: string;
    icon: React.ReactNode;
  };
} = {
  paragraph: {
    name: '正文',
    icon: <IconFont type="icon-text" />,
  },
  h1: {
    name: '标题 1',
    icon: <IconFont type="icon-h-1" />,
  },
  h2: {
    name: '标题 2',
    icon: <IconFont type="icon-h-2" />,
  },
  h3: {
    name: '标题 3',
    icon: <IconFont type="icon-h-3" />,
  },
  h4: {
    name: '标题 4',
    icon: <IconFont type="icon-h-4" />,
  },
  h5: {
    name: '标题 5',
    icon: <IconFont type="icon-h-5" />,
  },
  h6: {
    name: '标题 6',
    icon: <IconFont type="icon-h-6" />,
  },
  bullet: {
    name: '无序列表',
    icon: <UnorderedListOutlined />,
  },
  number: {
    name: '有序列表',
    icon: <OrderedListOutlined />,
  },
  check: {
    name: '任务列表',
    icon: <CheckSquareOutlined />,
  },
  quote: {
    name: '引用',
    icon: <IconFont type="icon-double-quotes-l" />,
  },
  code: {
    name: '代码块',
    icon: <IconFont type="icon-code-view" />,
  },
};

export const ElementFormatInfo: {
  [key: string]: {
    name: string;
    icon: React.ReactNode;
  };
} = {
  left: {
    name: '左对齐',
    icon: <IconFont type="icon-align-left" />,
  },
  center: {
    name: '居中对齐',
    icon: <IconFont type="icon-align-center" />,
  },
  right: {
    name: '右对齐',
    icon: <IconFont type="icon-align-right" />,
  },
};

export const FontSizeInfo: {
  [key: string]: {
    name: string;
  };
} = {
  '12px': {
    name: '12px',
  },
  '13px': {
    name: '13px',
  },
  '14px': {
    name: '14px',
  },
  '15px': {
    name: '15px',
  },
  '16px': {
    name: '16px',
  },
  '19px': {
    name: '19px',
  },
  '22px': {
    name: '22px',
  },
  '24px': {
    name: '24px',
  },
  '29px': {
    name: '29px',
  },
  '32px': {
    name: '32px',
  },
  '40px': {
    name: '40px',
  },
  '48px': {
    name: '48px',
  },
};
