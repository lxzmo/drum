import type { EditorThemeClasses } from 'lexical';

import './index.less';

import { DefaultTheme } from '../DefaultTheme';

const theme: EditorThemeClasses = {
  ...DefaultTheme,
  paragraph: 'comment-editor-theme-paragraph',
};

export default theme;
