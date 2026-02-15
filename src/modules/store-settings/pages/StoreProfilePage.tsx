import { type ReactNode } from "react";
import {
  BankOutlined,
  EditOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { showModal } from "../../../app/features/modalSlice";
import UpdateStoreProfile from "../components/UpdateStoreProfile";
import { useGetStoreSettingsQuery } from "../api/storeSettingsEndPoints";
import { IStoreSettings } from "../types/storeSettingsType";

const cardBaseClass =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm";
const heroCardClass =
  "rounded-2xl border border-[#cdeedb] bg-gradient-to-br from-white to-[#eefff7] shadow-sm";
const chipClass = "!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45] !font-semibold";

const formatDate = (value?: string | null) =>
  value && dayjs(value).isValid() ? dayjs(value).format("DD MMM YYYY") : "N/A";

const getText = (value?: string | number | null) =>
  value === null || value === undefined || String(value).trim() === ""
    ? "N/A"
    : String(value);

const normalizeLink = (value?: string | null) => {
  if (!value) {
    return null;
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const LinkValue = ({ url }: { url?: string | null }) => {
  const href = normalizeLink(url);

  if (!href) {
    return <span className="text-sm text-[var(--app-text-soft)]">N/A</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-all text-sm font-semibold text-[#1f6f45] hover:text-[#279e5a] hover:underline"
    >
      {href}
    </a>
  );
};

const StoreProfilePage = () => {
  const { data, isLoading } = useGetStoreSettingsQuery<any>({});
  const dispatch = useDispatch();

  const payload = data?.data;
  const store = (
    Array.isArray(payload?.results) ? payload?.results?.[0] : payload
  ) as IStoreSettings | undefined;

  if (isLoading) {
    return (
      <div className="space-y-4 pb-1">
        <BreadCrumb />
        <Card className={heroCardClass}>
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            Loading store profile...
          </Typography.Text>
        </Card>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="space-y-4 pb-1">
        <BreadCrumb />
        <Card className={cardBaseClass}>
          <Empty description="Store data not found" />
        </Card>
      </div>
    );
  }

  const weekendDays = Array.isArray(store.weekend_days) ? store.weekend_days : [];

  return (
    <div className="space-y-4 pb-1">
      <BreadCrumb />

      <Card className={heroCardClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar
              src={store.logo}
              icon={<ShopOutlined />}
              size={86}
              shape="square"
              className="!rounded-2xl !border !border-[#bfe6cf] !bg-white !shadow-sm"
            />

            <div>
              <Typography.Title level={3} className="!mb-1 !text-[var(--app-text)]">
                {getText(store.name)}
              </Typography.Title>
              <Typography.Text className="text-sm text-[var(--app-text-soft)]">
                {getText(store.store_type)} store in {getText(store.city)}
              </Typography.Text>

              <Space wrap style={{ marginTop: 8 }}>
                <Tag className={chipClass}>{getText(store.prefix)}</Tag>
                <Tag className={chipClass}>
                  {store.is_affiliated_store ? "Affiliated" : "Independent"}
                </Tag>
              </Space>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="!rounded-xl !bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]"
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Store Profile",
                    content: <UpdateStoreProfile />,
                  })
                )
              }
            >
              Update Profile
            </Button>

            {store.website_url && (
              <Button
                icon={<GlobalOutlined />}
                href={normalizeLink(store.website_url) || undefined}
                target="_blank"
                rel="noreferrer"
                className="!rounded-xl"
              >
                Visit Website
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className={`${cardBaseClass} h-full`}>
          <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
            Established
          </Typography.Text>
          <Typography.Text className="mt-1 block text-lg font-bold !text-[var(--app-text)]">
            {formatDate(store.established_date)}
          </Typography.Text>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
            Weekend Days
          </Typography.Text>
          <Typography.Text className="mt-1 block text-lg font-bold !text-[var(--app-text)]">
            {weekendDays.length}
          </Typography.Text>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
            Store Type
          </Typography.Text>
          <Typography.Text className="mt-1 block text-lg font-bold !text-[var(--app-text)]">
            {getText(store.store_type)}
          </Typography.Text>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
            Location
          </Typography.Text>
          <Typography.Text className="mt-1 block text-lg font-bold !text-[var(--app-text)]">
            {getText(store.city)}
          </Typography.Text>
        </Card>
      </div>

      <Row gutter={[14, 14]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <span>Contact & Location</span>
              </Space>
            }
            className={cardBaseClass}
          >
            <InfoRow
              icon={<EnvironmentOutlined />}
              label="Address"
              value={getText(store.address)}
            />
            <InfoRow
              icon={<MailOutlined />}
              label="Contact Email"
              value={getText(store.contact_email)}
            />
            <InfoRow
              icon={<PhoneOutlined />}
              label="Phone Number"
              value={getText(store.phone_number)}
            />
            <InfoRow
              icon={<GlobalOutlined />}
              label="Website"
              value={<LinkValue url={store.website_url} />}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BankOutlined />
                <span>Business Details</span>
              </Space>
            }
            className={cardBaseClass}
          >
            <InfoRow label="Voter ID Card" value={getText(store.voter_id_card)} />
            <InfoRow
              label="NID Verification"
              value={getText(store.nid_verification)}
            />
            <InfoRow
              label="TIN Verification"
              value={getText(store.tin_verification || store.tax_id)}
            />
            <InfoRow
              label="BIN Verification"
              value={getText(store.bin_verification)}
            />
            <InfoRow
              label="Voter ID File"
              value={<LinkValue url={store.voter_id_card_file} />}
            />
            <InfoRow
              label="NID File"
              value={<LinkValue url={store.nid_verification_file} />}
            />
            <InfoRow
              label="TIN File"
              value={<LinkValue url={store.tin_verification_file} />}
            />
            <InfoRow
              label="BIN File"
              value={<LinkValue url={store.bin_verification_file} />}
            />
            <InfoRow label="Tax ID" value={getText(store.tax_id)} />
            <InfoRow label="Founder" value={getText(store.founder)} />
            <InfoRow label="Trade License" value={getText(store.trade_license)} />
            <InfoRow
              label="Trade License File"
              value={<LinkValue url={store.trade_license_file} />}
            />
            <InfoRow
              label="Return Policy"
              value={getText(store.return_policy)}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Social Presence</span>
              </Space>
            }
            className={cardBaseClass}
          >
            <InfoRow label="Facebook" value={<LinkValue url={store.facebook_url} />} />
            <InfoRow label="Twitter" value={<LinkValue url={store.twitter_url} />} />
            <InfoRow label="LinkedIn" value={<LinkValue url={store.linkedin_url} />} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SolutionOutlined />
                <span>Attendance Integration</span>
              </Space>
            }
            className={cardBaseClass}
          >
            <InfoRow
              label="Base API URL"
              value={<LinkValue url={store.attendance_base_api_url} />}
            />
            <InfoRow
              label="Device ID"
              value={getText(store.attendance_device_id)}
            />
            <InfoRow
              label="Weekend Days"
              value={weekendDays.length > 0 ? weekendDays.join(", ") : "None"}
            />
          </Card>
        </Col>
      </Row>

      {store.description && (
        <Card title="Description" className={cardBaseClass}>
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            {store.description}
          </Typography.Text>
        </Card>
      )}
    </div>
  );
};

export default StoreProfilePage;

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex flex-col gap-1 border-b border-[var(--app-border)] py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
    <span className="inline-flex items-center gap-2 text-sm text-[var(--app-text-soft)]">
      {icon}
      {label}
    </span>
    <span className="text-left text-sm font-semibold text-[var(--app-text)] sm:text-right">
      {value}
    </span>
  </div>
);
