import { useRef, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  ReloadOutlined,
  PlusOutlined,
  OrderedListOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import ApexCharts from "apexcharts";
import { useGetVendorDashboardStatsQuery } from "../api/vendorDashboardEndpoints";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import "./VendorDashboard.css";

interface RecentOrder {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  order_date: string;
  item_count: number;
}

interface TopProduct {
  product__name: string;
  product__id: number;
  total_sold: number;
  revenue: number;
}

const formatCurrency = (amount: number): string => `Tk ${amount.toLocaleString()}`;

const VendorDashboard = () => {
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetVendorDashboardStatsQuery();

  const revenueChartRef = useRef<HTMLDivElement>(null);
  const ordersChartRef = useRef<HTMLDivElement>(null);

  const stats =
    dashboardData?.data && "overview" in dashboardData.data
      ? dashboardData.data
      : undefined;

  useEffect(() => {
    if (!revenueChartRef.current || !stats?.monthly_revenue_chart) return;

    const chartOptions = {
      series: [
        {
          name: "Revenue",
          data: stats.monthly_revenue_chart.map(
            (item: { revenue: number; month: string }) => item.revenue
          ),
        },
      ],
      chart: {
        height: 320,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#0f766e"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.08,
          stops: [0, 95, 100],
        },
      },
      xaxis: {
        categories: stats.monthly_revenue_chart.map(
          (item: { revenue: number; month: string }) => item.month
        ),
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
          },
          formatter: (value: number) => formatCurrency(value),
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
      },
    };

    const chart = new ApexCharts(revenueChartRef.current, chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [stats]);

  useEffect(() => {
    if (!ordersChartRef.current || !stats?.orders) return;

    const ordersData = stats.orders;
    const chartOptions = {
      series: [
        ordersData.pending,
        ordersData.processing,
        ordersData.shipped,
        ordersData.delivered,
        ordersData.cancelled,
      ],
      chart: {
        type: "donut",
        height: 320,
      },
      labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      colors: ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"],
      legend: {
        position: "bottom",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "68%",
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
    };

    const chart = new ApexCharts(ordersChartRef.current, chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [stats]);

  const orderColumns: ColumnsType<RecentOrder> = [
    {
      title: "Order #",
      dataIndex: "order_number",
      key: "order_number",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Items",
      dataIndex: "item_count",
      key: "item_count",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: "gold",
          processing: "blue",
          shipped: "purple",
          delivered: "green",
          cancelled: "red",
        };

        return <Tag color={colors[status] || "default"}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: "orange",
          paid: "green",
          failed: "red",
          refunded: "volcano",
        };

        return <Tag color={colors[status] || "default"}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const productColumns: ColumnsType<TopProduct> = [
    {
      title: "Product",
      dataIndex: "product__name",
      key: "product__name",
    },
    {
      title: "Sold",
      dataIndex: "total_sold",
      key: "total_sold",
      align: "center",
      sorter: (a: TopProduct, b: TopProduct) => a.total_sold - b.total_sold,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: TopProduct, b: TopProduct) => a.revenue - b.revenue,
    },
  ];

  if (isLoading) {
    return (
      <div className="vendor-dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Alert
        message="Error"
        description="Failed to load dashboard data. Please try again later."
        type="error"
        showIcon
      />
    );
  }

  const growthIsPositive = stats.revenue.growth >= 0;
  const lastUpdate = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="vendor-dashboard-page">
      <div className="vendor-dashboard-head">
        <div>
          <Typography.Title level={3} className="vendor-dashboard-title">
            Store Performance Dashboard
          </Typography.Title>
          <Typography.Text className="vendor-dashboard-subtitle">
            Quick snapshot of orders, products, and revenue trends.
          </Typography.Text>
        </div>
        <div className="vendor-dashboard-head-actions">
          <Typography.Text className="vendor-dashboard-last-updated">
            Updated {lastUpdate}
          </Typography.Text>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
          >
            Refresh
          </Button>
          <Tag color="cyan" className="vendor-dashboard-pill">
            {stats.overview.total_orders} total orders
          </Tag>
        </div>
      </div>

      <Card className="vendor-quick-card vendor-stagger-item vendor-stagger-1">
        <div className="vendor-quick-head">
          <Typography.Text className="vendor-quick-title">
            Quick Actions
          </Typography.Text>
          <Typography.Text className="vendor-quick-subtitle">
            Frequent tasks in one click
          </Typography.Text>
        </div>
        <Space size={[10, 10]} wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-product-btn"
            onClick={() => navigate("/products/create")}
          >
            Add Product
          </Button>
          <Button
            icon={<OrderedListOutlined />}
            onClick={() => navigate("/orders")}
          >
            View Orders
          </Button>
          <Button
            icon={<ShopOutlined />}
            onClick={() => navigate("/store-profile")}
          >
            Store Profile
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-metric-revenue vendor-stagger-item vendor-stagger-2">
            <Statistic
              title="Total Revenue"
              value={stats.revenue.total}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
            />
            <Typography.Text className="vendor-metric-footnote">
              Today: {formatCurrency(stats.revenue.today)}
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-metric-growth vendor-stagger-item vendor-stagger-3">
            <Statistic
              title="Monthly Growth"
              value={stats.revenue.growth}
              precision={1}
              suffix="%"
              prefix={growthIsPositive ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ color: growthIsPositive ? "#0f766e" : "#dc2626" }}
            />
            <Typography.Text className="vendor-metric-footnote">
              This month: {formatCurrency(stats.revenue.this_month)}
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-metric-orders vendor-stagger-item vendor-stagger-4">
            <Statistic
              title="Orders"
              value={stats.overview.total_orders}
              prefix={<ShoppingCartOutlined />}
            />
            <Typography.Text className="vendor-metric-footnote">
              Pending {stats.overview.pending_orders}, Processing {stats.overview.processing_orders}
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-metric-products vendor-stagger-item vendor-stagger-5">
            <Statistic
              title="Products"
              value={stats.products.total}
              prefix={<ProductOutlined />}
            />
            <Typography.Text className="vendor-metric-footnote">
              Active {stats.products.active}, Low stock {stats.products.low_stock}
            </Typography.Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "2px" }}>
        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-metric-balance vendor-stagger-item vendor-stagger-2">
            <Statistic
              title="Total Balance"
              value={stats.accounts.total_balance}
              precision={2}
              prefix={<WalletOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-mini-card vendor-stagger-item vendor-stagger-3">
            <Statistic
              title="Cash"
              value={stats.accounts.cash}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-mini-card vendor-stagger-item vendor-stagger-4">
            <Statistic
              title="Bank"
              value={stats.accounts.bank}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="vendor-metric-card vendor-mini-card vendor-stagger-item vendor-stagger-5">
            <Statistic
              title="Mobile Banking"
              value={stats.accounts.mfs}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "2px" }}>
        <Col xs={24} lg={16}>
          <Card
            title="Monthly Revenue Trend"
            className="vendor-chart-card vendor-stagger-item vendor-stagger-3"
          >
            <div ref={revenueChartRef} className="vendor-chart-area" />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Order Status Distribution"
            className="vendor-chart-card vendor-stagger-item vendor-stagger-4"
          >
            <div ref={ordersChartRef} className="vendor-chart-donut" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "2px" }}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Orders"
            className="vendor-table-card vendor-stagger-item vendor-stagger-4"
          >
            <Table
              className="vendor-data-table"
              columns={orderColumns}
              dataSource={stats.recent_orders}
              rowKey="id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Top Selling Products"
            className="vendor-table-card vendor-stagger-item vendor-stagger-5"
          >
            <Table
              className="vendor-data-table"
              columns={productColumns}
              dataSource={stats.top_products}
              rowKey="product__id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VendorDashboard;
