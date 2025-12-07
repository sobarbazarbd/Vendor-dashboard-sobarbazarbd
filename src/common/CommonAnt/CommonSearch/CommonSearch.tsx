/* eslint-disable no-unused-vars */
import { Button, DatePicker, Input, Select, TimePicker } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import {
  BankOutlined,
  MobileOutlined,
  CreditCardOutlined,
  WalletOutlined,
  DollarOutlined,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;

interface SearchComponentProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  placeholder,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <Input
      prefix={<SearchOutlined />}
      allowClear
      placeholder={placeholder}
      value={searchValue}
      onChange={handleChange}
    />
  );
};

export const RangePickerComponent = ({
  onChange,
  format = "YYYY-MM-DD",
  ...props
}: any) => {
  const handleChange = (
    dates: [moment.Moment | null, moment.Moment | null] | null
  ) => {
    onChange(dates);
  };

  return (
    <RangePicker
      {...props}
      format={format}
      onChange={handleChange}
      className="w-full"
    />
  );
};


export const CreateCommonButton = ({ to, btnName }: any) => {
  return (
    <Button>
      <Link
        to={to}
        className="border px-6 py-2 rounded-lg bg-baseColor text-white"
      >
        {btnName}
      </Link>
    </Button>
  );
};

interface DatePickerWithOptionalTodayProps {
  showToday?: boolean;
  onChange?: (date: dayjs.Dayjs | null, dateString: string) => void;
}

export const DatePickerWithOptionalToday: React.FC<
  DatePickerWithOptionalTodayProps
> = ({ showToday, onChange }) => {
  return (
    <DatePicker
      onChange={(date, dateString: any) => {
        console.log("Selected date:", date, "Date string:", dateString);
        if (onChange) {
          onChange(date, dateString);
        }
      }}
      className="w-full"
      format="DD-MM-YYYY"
      defaultValue={showToday ? dayjs().startOf("day") : undefined}
    />
  );
};

interface CustomTimePickerProps {
  useDefaultTime: boolean;
  onChangeTime: (time: Dayjs | null, timeString: any) => void;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  useDefaultTime,
  onChangeTime,
}) => {
  const defaultTime = useDefaultTime ? dayjs() : undefined;

  return (
    <TimePicker
      className="w-full"
      onChange={onChangeTime}
      defaultValue={defaultTime}
    />
  );
};

interface CustomMonthPickerProps {
  useDefaultMonth: boolean;
  onChangeMonth: (date: Dayjs | null, dateString: any) => void;
}

export const CustomMonthPicker: React.FC<CustomMonthPickerProps> = ({
  useDefaultMonth,
  onChangeMonth,
}) => {
  const defaultMonth = useDefaultMonth ? dayjs() : undefined;

  return (
    <DatePicker
      className="w-full"
      picker="month"
      onChange={onChangeMonth}
      defaultValue={defaultMonth}
    />
  );
};

export const CommonPaymentMethod = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) => {
  return (
    <Select
      showSearch
      placeholder="Search Payment"
      value={value}
      onChange={onChange}
      filterOption={(input, option: any) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      defaultValue="cash"
      options={[
        {
          value: "cash",
          label: (
            <p>
              <DollarOutlined className="me-2" /> Cash
            </p>
          ),
        },
        {
          value: "bank_transfer",
          label: (
            <p>
              <BankOutlined className="me-2" /> Bank
            </p>
          ),
        },
        {
          value: "mobile_banking",
          label: (
            <p>
              <MobileOutlined className="me-2" /> Mobile Banking
            </p>
          ),
        },
        {
          value: "credit_card",
          label: (
            <p>
              <CreditCardOutlined className="me-2" /> Credit Card
            </p>
          ),
        },
        {
          value: "cheque",
          label: (
            <p>
              <WalletOutlined className="me-2" /> Cheque
            </p>
          ),
        },
      ]}
    />
  );
};
