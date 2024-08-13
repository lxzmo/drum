import {
  CheckSquareOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RightOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lxzmo/drum';
import { IconButton } from '@lxzmo/drum/components/IconButton';
import { IconFont } from '@lxzmo/drum/components/IconFont';
import { InsertImage } from '@lxzmo/drum/components/InsertImage';
import { Divider } from 'antd';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from 'lexical';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { InsertTable } from '../ToolbarPlugin/InsertTable';

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];

  if (queryString === null) {
    return options;
  }

  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: <i className="icon table" />,
            keywords: ['table'],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
          }),
      ),
    );
  }

  return options;
}

function getBaseOptions(editor: LexicalEditor) {
  return [
    new ComponentPickerOption('Paragraph', {
      icon: <i className="icon paragraph" />,
      keywords: ['normal', 'paragraph', 'p', 'text'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(`Heading ${n}`, {
          icon: <i className={`icon h${n}`} />,
          keywords: ['heading', 'header', `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
              }
            }),
        }),
    ),

    new ComponentPickerOption('Numbered List', {
      icon: <i className="icon number" />,
      keywords: ['numbered list', 'ordered list', 'ol'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Bulleted List', {
      icon: <i className="icon bullet" />,
      keywords: ['bulleted list', 'unordered list', 'ul'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Check List', {
      icon: <i className="icon check" />,
      keywords: ['check list', 'todo list'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Quote', {
      icon: <i className="icon quote" />,
      keywords: ['block quote'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption('Code', {
      icon: <i className="icon code" />,
      keywords: ['javascript', 'python', 'js', 'codeblock'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              // Will this ever happen?
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),
    new ComponentPickerOption('Divider', {
      icon: <i className="icon horizontal-rule" />,
      keywords: ['horizontal rule', 'divider', 'hr'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    ...(['left', 'center', 'right', 'justify'] as const).map(
      (alignment) =>
        new ComponentPickerOption(`Align ${alignment}`, {
          icon: <i className={`icon ${alignment}-align`} />,
          keywords: ['align', 'justify', alignment],
          onSelect: () =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        }),
    ),
  ];
}

export function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');

    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword: any) => regex.test(keyword)),
      ),
    ];
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <>
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(anchorElementRef, { selectOptionAndCleanUp }) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="typeahead-popover component-picker-menu">
                  <div className="component-menu-title">基础</div>
                  <div className="component-gird-menu">
                    <IconButton
                      toolTip="正文"
                      icon={<IconFont type="icon-text" />}
                      onClick={() => {
                        selectOptionAndCleanUp({
                          onSelect: () => {
                            const selection = $getSelection();
                            if ($isRangeSelection(selection)) {
                              $setBlocksType(selection, () =>
                                $createParagraphNode(),
                              );
                            }
                          },
                        } as any);
                      }}
                    />
                    {[1, 2, 3, 4, 5, 6].map((item, index) => {
                      return (
                        <IconButton
                          key={index}
                          toolTip={`标题${item}`}
                          icon={<IconFont type={`icon-h-${item}`} />}
                          onClick={() => {
                            selectOptionAndCleanUp({
                              onSelect: () => {
                                editor.update(() => {
                                  const selection = $getSelection();
                                  if ($isRangeSelection(selection)) {
                                    $setBlocksType(selection, () =>
                                      $createHeadingNode(`h${item}` as any),
                                    );
                                  }
                                });
                              },
                            } as any);
                          }}
                        />
                      );
                    })}
                    <IconButton
                      toolTip="无序列表"
                      icon={<UnorderedListOutlined />}
                      onClick={() => {
                        selectOptionAndCleanUp({
                          onSelect: () => {
                            editor.dispatchCommand(
                              INSERT_UNORDERED_LIST_COMMAND,
                              undefined,
                            );
                          },
                        } as any);
                      }}
                    />
                    <IconButton
                      toolTip="有序列表"
                      icon={<OrderedListOutlined />}
                      onClick={() => {
                        selectOptionAndCleanUp({
                          onSelect: () => {
                            editor.dispatchCommand(
                              INSERT_ORDERED_LIST_COMMAND,
                              undefined,
                            );
                          },
                        } as any);
                      }}
                    />
                    <IconButton
                      toolTip="任务列表"
                      icon={<CheckSquareOutlined />}
                      onClick={() => {
                        selectOptionAndCleanUp({
                          onSelect: () => {
                            editor.dispatchCommand(
                              INSERT_CHECK_LIST_COMMAND,
                              undefined,
                            );
                          },
                        } as any);
                      }}
                    />
                    <IconButton
                      toolTip="引用"
                      icon={<IconFont type="icon-double-quotes-l" />}
                      onClick={() => {
                        selectOptionAndCleanUp({
                          onSelect: () => {
                            editor.update(() => {
                              const selection = $getSelection();
                              $setBlocksType(selection, () =>
                                $createQuoteNode(),
                              );
                            });
                          },
                        } as any);
                      }}
                    />
                    <IconButton
                      toolTip="代码块"
                      icon={<IconFont type="icon-code-view" />}
                      onClick={() => {
                        selectOptionAndCleanUp({
                          onSelect: () => {
                            editor.update(() => {
                              let selection = $getSelection();
                              if (selection !== null) {
                                if (selection.isCollapsed()) {
                                  $setBlocksType(selection, () =>
                                    $createCodeNode(),
                                  );
                                } else {
                                  const textContent =
                                    selection.getTextContent();
                                  const codeNode = $createCodeNode();
                                  selection.insertNodes([codeNode]);
                                  selection = $getSelection();
                                  if ($isRangeSelection(selection)) {
                                    selection.insertRawText(textContent);
                                  }
                                }
                              }
                            });
                          },
                        } as any);
                      }}
                    />
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div className="component-menu-title">通用</div>
                  <InsertImage
                    editor={editor}
                    onUpload={() => {
                      selectOptionAndCleanUp({
                        onSelect: () => {},
                      } as any);
                    }}
                  >
                    <div className="drum-dropdown-item">
                      <div>
                        <PictureOutlined /> 图片
                      </div>
                    </div>
                  </InsertImage>
                  <InsertTable
                    onClick={() => {
                      selectOptionAndCleanUp({
                        onSelect: () => {},
                      } as any);
                    }}
                    editor={editor}
                    trigger="hover"
                    placement="right"
                  >
                    <div className="drum-dropdown-item">
                      <div>
                        <TableOutlined /> 表格
                      </div>
                      <RightOutlined />
                    </div>
                  </InsertTable>
                </div>,
                anchorElementRef.current,
              )
            : null
        }
      />
    </>
  );
}
