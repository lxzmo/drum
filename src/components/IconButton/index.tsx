import { Button, ButtonProps, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import React from 'react';
import './index.less';

type Props = ButtonProps & {
  active?: boolean;
  toolTip?: string;
  placement?: TooltipPlacement;
};
export const IconButton: React.FC<Props> = ({
  active,
  toolTip,
  placement,
  ...rest
}) => {
  return (
    <Tooltip title={toolTip} placement={placement}>
      <Button
        className={`icon-button ${active ? 'active' : ''}`}
        type="text"
        {...rest}
      />
    </Tooltip>
  );
};
