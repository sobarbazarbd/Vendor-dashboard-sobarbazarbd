import { Select, Form } from "antd";
import { updateStudentField } from "../../app/features/studentAdmissionSlice";
import { useDispatch } from "react-redux";

interface CommonSelectProps {
  label?: string;
  name?: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  mode?: "multiple" | undefined;
  value?: any;
  onChange?: (value: any) => void;
  allowClear?: boolean;
  className?: string;
  onSearch?: (value: string) => void; // NEW

  loading?: boolean;
}

export const CommonSelect = ({
  label,
  name,
  placeholder = "Select option",
  options = [],
  mode,
  value,
  onChange,
  onSearch, // NEW
  allowClear = true,
  className = "",
  loading = false, // NEW
}: CommonSelectProps) => {
  return (
    <Form.Item label={label} name={name}>
      <Select
        className={className}
        placeholder={placeholder}
        mode={mode}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        options={options}
        showSearch
        loading={loading} // NEW
        filterOption={false} // IMPORTANT: disable client filter for server search
        onSearch={onSearch} // NEW - triggers search API
      />
    </Form.Item>
  );
};

const GenderSelect = ({ label = "Gender", name = "gender" }) => {
  const dispatch = useDispatch();
  return (
    <Form.Item<any> label={label} name={name}>
      <Select
        placeholder="Select Gender"
        className="w-full"
        onChange={(value) =>
          dispatch(
            updateStudentField({
              field: "gender",
              value,
            })
          )
        }
      >
        <Select.Option value="M">Male</Select.Option>
        <Select.Option value="F">Female</Select.Option>
        <Select.Option value="O">Other</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default GenderSelect;

export const ReligionSelect = ({ label = "Religion", name = "religion" }) => {
  const dispatch = useDispatch();
  return (
    <Form.Item label={label} name={name}>
      <Select
        placeholder="Select Religion"
        className="w-full"
        onChange={(value) =>
          dispatch(
            updateStudentField({
              field: "religion",
              value: value,
            })
          )
        }
      >
        <Select.Option value="Islam">Islam</Select.Option>
        <Select.Option value="Christianity">Christianity</Select.Option>
        <Select.Option value="Hinduism">Hinduism</Select.Option>
        <Select.Option value="Buddhism">Buddhism</Select.Option>
        <Select.Option value="Judaism">Judaism</Select.Option>
        <Select.Option value="Sikhism">Sikhism</Select.Option>
        <Select.Option value="Other">Other</Select.Option>
      </Select>
    </Form.Item>
  );
};

export const BloodGroupSelect = ({
  label = "Blood Group",
  name = "blood_group",
}) => {
  return (
    <Form.Item label={label} name={name}>
      <Select placeholder="Select Blood Group" className="w-full">
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
          <Select.Option key={group} value={group}>
            {group}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
