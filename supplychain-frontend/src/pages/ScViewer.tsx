import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import { Pie, Column } from "@ant-design/plots";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/stats/dashboard")
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const tenderPieData = [
    { type: "Завершены", value: data.tenders.completed },
    { type: "Открыты", value: data.tenders.total - data.tenders.completed }
  ];

  const paymentPieData = [
    { type: "Оплачены", value: data.payments.paid },
    { type: "Не оплачены", value: data.payments.total - data.payments.paid }
  ];

  return (
    <div className="p-10 space-y-6">

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Всего тендеров" value={data.tenders.total} /></Card></Col>
        <Col span={6}><Card><Statistic title="Всего поставок" value={data.shipments.total} /></Card></Col>
        <Col span={6}><Card><Statistic title="Всего платежей" value={data.payments.total} /></Card></Col>
        <Col span={6}><Card><Statistic title="Общий объём выплат" value={data.payments.totalVolume} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Завершённость тендеров">
            <Progress percent={Number(data.tenders.completionRate.toFixed(1))} />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Доставка">
            <Progress percent={Number(data.shipments.deliveryRate.toFixed(1))} />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Успешность платежей">
            <Progress percent={Number(data.payments.successRate.toFixed(1))} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Статус тендеров">
            <Pie data={tenderPieData} angleField="value" colorField="type" />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Статус платежей">
            <Pie data={paymentPieData} angleField="value" colorField="type" />
          </Card>
        </Col>
      </Row>

    </div>
  );
}