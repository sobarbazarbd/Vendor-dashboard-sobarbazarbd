import React from "react";
import { Button as AntButton, ButtonProps, Popconfirm } from "antd";
import Iconify from "../../IconifyConfig/IconifyConfig";

interface Props extends ButtonProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

const DeleteButton: React.FC<Props> = ({ onConfirm, onCancel, ...rest }) => {
  return (
    <Popconfirm
      title="Delete item"
      description="Are you sure you want to delete this item?"
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
    >
      <AntButton
        {...rest}
        danger
        title="Delete"
        icon={<Iconify name="weui:delete-outlined" />}
        size="small"
        type="default"
        style={{
          color: "#f5222d",
          border: "1px solid #f5222d",
        }}
      />
    </Popconfirm>
  );
};

export default DeleteButton;

// import React from "react";
// import { Button as AntButton, ButtonProps } from "antd";
// import Iconify from "../../IconifyConfig/IconifyConfig";

// interface Props extends ButtonProps {}

// const DeleteButton: React.FC<Props> = ({ ...rest }) => {
//   return (
//     <AntButton
//       {...rest}
//       title="Edit"
//       danger
//       icon={<Iconify name="weui:delete-outlined" />}
//       size="small"
//       type="default"
//     />
//   );
// };

// export default DeleteButton;
