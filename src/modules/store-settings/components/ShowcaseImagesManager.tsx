import { useRef, useState } from "react";
import {
  Button,
  Card,
  Image,
  Popconfirm,
  Space,
  Spin,
  Typography,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  useGetShowcaseImagesQuery,
  useUploadShowcaseImageMutation,
  useDeleteShowcaseImageMutation,
} from "../api/storeSettingsEndPoints";

const { Text } = Typography;

const ShowcaseImagesManager = () => {
  const { data: images = [], isLoading } = useGetShowcaseImagesQuery();
  const [uploadShowcase, { isLoading: isUploading }] =
    useUploadShowcaseImageMutation();
  const [deleteShowcase] = useDeleteShowcaseImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    for (const file of files) {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("order", String(images.length));
      await uploadShowcase(fd);
    }
    // reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) return <Spin />;

  return (
    <Card
      title={
        <Space>
          <PictureOutlined />
          <span>Showcase Images</span>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            (shown on the Weekly Top Shop card)
          </Text>
        </Space>
      }
      extra={
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            icon={<PlusOutlined />}
            loading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Images
          </Button>
        </>
      }
    >
      {images.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "#aaa",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <PictureOutlined style={{ fontSize: 40, marginBottom: 8 }} />
          <div>No showcase images yet. Click to upload.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                position: "relative",
                width: 90,
                height: 90,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              <Image
                src={img.image}
                width={90}
                height={90}
                style={{ objectFit: "cover" }}
                preview={{ mask: false }}
              />
              <Popconfirm
                title="Remove this image?"
                onConfirm={() => deleteShowcase(img.id)}
                okText="Remove"
                cancelText="Cancel"
              >
                <Button
                  danger
                  size="small"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    opacity: 0.9,
                  }}
                />
              </Popconfirm>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ShowcaseImagesManager;
