/* eslint-disable no-param-reassign */
import {
  BoldOutlined,
  ItalicOutlined,
  LineOutlined,
  LinkOutlined,
  PictureOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from '@lexical/selection';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  IS_APPLE,
  mergeRegister,
} from '@lexical/utils';
import {
  $isTableSelection,
  Dropdown,
  IconButton,
  InsertImage,
  VerticalDivider,
} from '@lxzmo/drum';
import { IconFont } from '@lxzmo/drum/components/IconFont';
import { getSelectedNode } from '@lxzmo/drum/utils/getSelectedNode';
import { sanitizeUrl } from '@lxzmo/drum/utils/url';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { BgColorPicker } from './BgColorPicker';
import { BlockFormatDropDown } from './BlockFormatDropDown';
import { BlockTypeToBlockInfo } from './constants';
import { ElementFormatDropdown } from './ElementFormatDropdown';
import { FontColorPicker } from './FontColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';
import { InsertTable } from './InsertTable';

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

type Props = {
  setIsLinkEditMode: Dispatch<boolean>;
};
export const ToolbarPlugin: React.FC<Props> = ({ setIsLinkEditMode }) => {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [activeEditor, setActiveEditor] = useState(editor);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] =
    useState<keyof typeof BlockTypeToBlockInfo>('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [fontColor, setFontColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<string>('15px');

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsCode(selection.hasFormat('code'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in BlockTypeToBlockInfo) {
            setBlockType(type as keyof typeof BlockTypeToBlockInfo);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }

        let matchingParent;
        if ($isLinkNode(parent)) {
          // If node is a link, we need to fetch the parent paragraph node to set format
          matchingParent = $findMatchingParent(
            node,
            (parentNode) =>
              $isElementNode(parentNode) && !parentNode.isInline(),
          );
        }

        setFontColor(
          $getSelectionStyleValueForProperty(selection, 'color', '#000000'),
        );
        setBgColor(
          $getSelectionStyleValueForProperty(
            selection,
            'background-color',
            '#fff',
          ),
        );
        // If matchingParent is a valid node, pass it's format type
        setElementFormat(
          $isElementNode(matchingParent)
            ? matchingParent.getFormatType()
            : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
        );
      }
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
    }
  }, [activeEditor, editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {},
      );
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack?: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack?: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  return (
    <div className="drum-toolbar">
      <IconButton
        icon={<IconFont type="icon-undo" />}
        toolTip={`撤销${IS_APPLE ? ' (⌘ Z)' : ' (Ctrl+Z)'}`}
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      />
      <IconButton
        icon={<IconFont type="icon-redo" />}
        toolTip={`重做${IS_APPLE ? ' (⌘ Y)' : ' (Ctrl+Y)'}`}
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      />
      <IconButton
        icon={<IconFont type="icon-xiangpica" />}
        toolTip="清除格式"
        onClick={clearFormatting}
      />
      <VerticalDivider />
      {blockType in BlockTypeToBlockInfo && activeEditor === editor && (
        <BlockFormatDropDown
          editor={activeEditor}
          buttonLabel={BlockTypeToBlockInfo[blockType]?.name}
          disabled={!isEditable}
          blockType={blockType as any}
        />
      )}
      {blockType === 'code' ? (
        <Dropdown
          disabled={!isEditable}
          buttonLabel={getLanguageFriendlyName(codeLanguage)}
          activeOption={codeLanguage}
          options={CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return { label: name, value };
          })}
          onChange={(value) => {
            onCodeLanguageSelect(value);
          }}
        />
      ) : (
        <>
          <FontSizeDropdown
            editor={activeEditor}
            disabled={!isEditable}
            value={fontSize}
          />
          <IconButton
            disabled={!isEditable}
            icon={<BoldOutlined />}
            toolTip={`加粗${IS_APPLE ? ' (⌘ B)' : ' (Ctrl+B)'}`}
            active={isBold}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<ItalicOutlined />}
            toolTip={`斜体${IS_APPLE ? ' (⌘ I)' : ' (Ctrl+I)'}`}
            active={isItalic}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<UnderlineOutlined />}
            toolTip={`下划线${IS_APPLE ? ' (⌘ U)' : ' (Ctrl+U)'}`}
            active={isUnderline}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<StrikethroughOutlined />}
            toolTip="删除线"
            active={isStrikethrough}
            onClick={() => {
              activeEditor.dispatchCommand(
                FORMAT_TEXT_COMMAND,
                'strikethrough',
              );
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<IconFont type="icon-code-view" />}
            toolTip="行内代码"
            active={isCode}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<IconFont type="icon-superscript" />}
            toolTip="上标"
            active={isSuperscript}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<IconFont type="icon-subscript" />}
            toolTip="下标"
            active={isSubscript}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
            }}
          />
          <VerticalDivider />
          <FontColorPicker
            disabled={!isEditable}
            color={fontColor}
            onChange={onFontColorSelect}
          />
          <BgColorPicker
            disabled={!isEditable}
            color={bgColor}
            onChange={onBgColorSelect}
          />
          <VerticalDivider />
          <ElementFormatDropdown
            editor={activeEditor}
            disabled={!isEditable}
            value={elementFormat || 'left'}
          />
          <IconButton
            disabled={!isEditable}
            icon={<IconFont type="icon-indent-increase" />}
            toolTip={`增加缩进`}
            onClick={() => {
              editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
            }}
          />
          <IconButton
            disabled={!isEditable}
            icon={<IconFont type="icon-indent-increase" />}
            toolTip={`减少缩进`}
            onClick={() => {
              editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
            }}
          />
          <VerticalDivider />
          <InsertTable editor={activeEditor} disabled={!isEditable} />
          <InsertImage disabled={!isEditable} editor={activeEditor}>
            <IconButton
              disabled={!isEditable}
              icon={<PictureOutlined />}
              toolTip="图片"
            />
          </InsertImage>
          <IconButton
            disabled={!isEditable}
            icon={<LinkOutlined />}
            toolTip="链接"
            active={isLink}
            onClick={insertLink}
          />
          <IconButton
            disabled={!isEditable}
            icon={<LineOutlined />}
            toolTip="分割线"
            onClick={() => {
              activeEditor.dispatchCommand(
                INSERT_HORIZONTAL_RULE_COMMAND,
                undefined,
              );
            }}
          />
        </>
      )}
    </div>
  );
};
