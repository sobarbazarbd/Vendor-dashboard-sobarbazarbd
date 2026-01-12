import { useRef, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, Alert } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import ApexCharts from "apexcharts";
import { useGetVendorDashboardStatsQuery } from "../api/vendorDashboardEndpoints";
import type { ColumnsType } from "antd/es/table";

interface RecentOrder {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  order_date: string;
  item_count: number;
}

const VendorDashboard = () => {
  const { data: dashboardData, isLoading, isError } = useGetVendorDashboardStatsQuery();
  const revenueChartRef = useRef<HTMLDivElement>(null);
  const ordersChartRef = useRef<HTMLDivElement>(null);

  // Extract stats from response - handle both direct data and paginated response
  const stats = dashboardData?.data && 'overview' in dashboardData.data 
    ? dashboardData.data 
    : undefined;

  // Initialize Revenue Chart
  useEffect(() => {
    if (!revenueChartRef.current || !stats?.monthly_revenue_chart) return;

    const chartOptions = {
      series: [
        {
          name: "Revenue",
          data: stats.monthly_revenue_chart.map((item: { revenue: number; month: string }) => item.revenue),
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#3B82F6"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        },
      },
      xaxis: {
        categories: stats.monthly_revenue_chart.map((item: { revenue: number; month: string }) => item.month),
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
          formatter: (value: number) => `৳${value.toLocaleString()}`,
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `৳${value.toLocaleString()}`,
        },
      },
      grid: {
        borderColor: "#E5E7EB",
      },
    };

    const chart = new ApexCharts(revenueChartRef.current, chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [stats]);

  // Initialize Orders Chart
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
        height: 350,
      },
      labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      colors: ["#FCD34D", "#60A5FA", "#A78BFA", "#34D399", "#F87171"],
      legend: {
        position: "bottom",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
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

  // Recent Orders Table Columns
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
      render: (amount: number) => `৳${amount.toLocaleString()}`,
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

  // Top Products Table Columns
  interface TopProduct {
    product__name: string;
    product__id: number;
    total_sold: number;
    revenue: number;
  }

  const productColumns = [
    {
      title: "Product",
      dataIndex: "product__name",
      key: "product__name",
    },
    {
      title: "Sold",
      dataIndex: "total_sold",
      key: "total_sold",
      align: "center" as const,
      sorter: (a: TopProduct, b: TopProduct) => a.total_sold - b.total_sold,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (amount: number) => `৳${amount.toLocaleString()}`,
      sorter: (a: TopProduct, b: TopProduct) => a.revenue - b.revenue,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
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

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Dashboard</h1>

      {/* Key Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.revenue.total}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="৳"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Month"
              value={stats.revenue.this_month}
              precision={2}
              valueStyle={{ color: stats.revenue.growth >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={stats.revenue.growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix={`৳ (${stats.revenue.growth.toFixed(1)}%)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.overview.total_orders}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
              Pending: {stats.overview.pending_orders} | Processing: {stats.overview.processing_orders}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.products.total}
              prefix={<ProductOutlined />}
            />
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
              Active: {stats.products.active} | Low Stock: {stats.products.low_stock}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Account Balances */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value={stats.accounts.total_balance}
              precision={2}
              prefix={<WalletOutlined />}
              suffix="৳"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Cash" value={stats.accounts.cash} precision={2} suffix="৳" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Bank" value={stats.accounts.bank} precision={2} suffix="৳" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Mobile Banking" value={stats.accounts.mfs} precision={2} suffix="৳" />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Revenue Trend">
            <div ref={revenueChartRef}></div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Order Status Distribution">
            <div ref={ordersChartRef}></div>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Orders">
            <Table
              columns={orderColumns}
              dataSource={stats.recent_orders}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Selling Products">
            <Table
              columns={productColumns}
              dataSource={stats.top_products}
              rowKey="product__id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VendorDashboard;
