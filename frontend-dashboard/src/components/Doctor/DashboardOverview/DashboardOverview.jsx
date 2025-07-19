// File: DashboardOverview.tsx
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./DashboardOverview.css";

const { Title } = Typography;

const chartData = [
  { name: "Jan", patients: 30 },
  { name: "Feb", patients: 50 },
  { name: "Mar", patients: 40 },
  { name: "Apr", patients: 70 },
  { name: "May", patients: 60 },
];

const DashboardOverview = () => {
  return (
    <div className="dashboard-overview">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="statistic-card">
            <Statistic
              title="Appointments"
              value={28}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="statistic-card">
            <Statistic
              title="Patients"
              value={134}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card className="statistic-card">
            <Statistic
              title="Reports"
              value={19}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }} gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Monthly Patient Visits" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
