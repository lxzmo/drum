import { blue, green, greyDark, red } from '@ant-design/colors';
import { FontColorsOutlined } from '@ant-design/icons';
import { IconButton } from '@lxzmo/drum/components/IconButton';
import { Col, ColorPicker, Divider, Row } from 'antd';
import { Color } from 'antd/es/color-picker';
import React from 'react';

type Props = {
  disabled: boolean;
  color: string;
  onChange: (value: string) => void;
};
export const FontColorPicker: React.FC<Props> = ({
  disabled,
  color,
  onChange,
}) => {
  return (
    <ColorPicker
      value={color}
      destroyTooltipOnHide
      size="small"
      styles={{ popupOverlayInner: { width: 480 } }}
      onChangeComplete={(color: Color) => {
        onChange(color.toHexString());
      }}
      presets={[
        { label: 'greyDark', colors: greyDark },
        { label: 'red', colors: red },
        { label: 'blue', colors: blue },
        { label: 'green', colors: green },
      ]}
      panelRender={(_: any, { components: { Picker, Presets } }) => {
        return (
          <Row justify="space-between" wrap={false}>
            <Col span={12}>
              <Presets />
            </Col>
            <Divider type="vertical" style={{ height: 'auto' }} />
            <Col flex="auto">
              <Picker />
            </Col>
          </Row>
        );
      }}
    >
      <IconButton
        toolTip="字体颜色"
        disabled={disabled}
        icon={<FontColorsOutlined />}
      />
    </ColorPicker>
  );
};
