import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, Typography } from "antd";
import { Pie } from "@ant-design/plots";

const { Title } = Typography;

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/stats/dashboard")
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <div style={{ padding: 40 }}>Loading...</div>;

  const tenderPieData = [
    { type: "Завершены", value: data.tenders.completed },
    { type: "Открыты", value: data.tenders.total - data.tenders.completed }
  ];

  const paymentPieData = [
    { type: "Оплачены", value: data.payments.paid },
    { type: "Не оплачены", value: data.payments.total - data.payments.paid }
  ];

  return (
    <div
      style={{
        padding: "40px 60px",
        maxWidth: 1400,
        margin: "0 auto"
      }}
    >
      <Title level={3} style={{ marginBottom: 32 }}>
        Аналитика производственного процесса
      </Title>

      {/* KPI блок */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Всего тендеров" value={data.tenders.total} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Всего поставок" value={data.shipments.total} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Всего платежей" value={data.payments.total} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title="Общий объём выплат"
              value={data.payments.totalVolume}
              suffix="₽"
            />
          </Card>
        </Col>
      </Row>

      {/* Прогресс блок */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={8}>
          <Card title="Завершённость тендеров" bordered={false} style={{ borderRadius: 12 }}>
            <Progress
              percent={Number(data.tenders.completionRate.toFixed(1))}
              strokeWidth={12}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Доставка" bordered={false} style={{ borderRadius: 12 }}>
            <Progress
              percent={Number(data.shipments.deliveryRate.toFixed(1))}
              strokeWidth={12}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Успешность платежей" bordered={false} style={{ borderRadius: 12 }}>
            <Progress
              percent={Number(data.payments.successRate.toFixed(1))}
              strokeWidth={12}
            />
          </Card>
        </Col>
      </Row>

      {/* Графики */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Статус тендеров" bordered={false} style={{ borderRadius: 12 }}>
            <Pie
              data={tenderPieData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{ type: "outer" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Статус платежей" bordered={false} style={{ borderRadius: 12 }}>
            <Pie
              data={paymentPieData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{ type: "outer" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}