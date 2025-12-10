import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
} from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const TenderHeader = ({
  tenderId,
  status,
  title,
  onCreateDemo,
}: {
  tenderId: string;
  status: string;
  title: string;
  onCreateDemo?: () => void;
}) => {
  // Цвет тега в зависимости от статуса
  const tagColor =
    status === "open" ? "green" : status === "awarded" ? "blue" : "default";

  return (
    <div
      style={{ padding: 24, background: "#fff", borderRadius: 8, marginBottom: 24 }}
    >
      {/* Строка с id и статусом */}
      <Row align="middle" style={{ marginBottom: 0 }}>
        <Text strong style={{ fontSize: 14 }}>
          ID #{tenderId}
        </Text>
        <Tag color={tagColor} style={{ fontSize: 14, marginLeft: 12 }}>
          {status === "open" ? "Открыт" : status}
        </Tag>
      </Row>

      {/* Заголовок и кнопка */}
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={onCreateDemo}>
              Создать демо-заявку
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

interface Bid {
  id: string;
  supplierAddress: string;
  price: number;
  deliveryTime: string;
  supplier?: { name: string };
}

interface Shipment {
  id: string;
  trackingId: string;
  status: string;
}

interface Tender {
  id: string;
  title: string;
  description: string;
  status: string;
  winnerSupplierId?: string;
}

export default function TenderPage() {
  const { id } = useParams();
  const tenderId = id!;
  const navigate = useNavigate();
  const [tender, setTender] = useState<Tender | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const t = await fetch(`http://localhost:5000/api/tenders/${tenderId}`).then((r) =>
        r.json()
      );
      const b = await fetch(`http://localhost:5000/api/tenders/${tenderId}/bids`).then((r) =>
        r.json()
      );
      const s = await fetch(`http://localhost:5000/api/shipments/tender/${tenderId}`).then((r) =>
        r.json()
      );
      setTender(t);
      setBids(b);
      setShipments(s);
    } catch {
      toast.error("Ошибка загрузки данных тендера");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitBid = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/tenders/${tenderId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierAddress: "Supplier_" + Math.floor(Math.random() * 1000),
          price: Math.floor(Math.random() * 90000 + 10000),
          deliveryTime: "5 дней",
        }),
      });
      toast.success("Заявка отправлена");
      await loadData();
    } catch {
      toast.error("Ошибка при отправке заявки");
    }
    setLoading(false);
  };

  const awardBestBid = async () => {
    if (bids.length === 0) return toast.error("Нет предложений для выбора");
    const best = [...bids].sort((a, b) => a.price - b.price)[0];
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/tenders/${tenderId}/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId: best.id, callerAddress: "demo_user" }),
      });
      toast.success("Победитель назначен");
      await loadData();
    } catch {
      toast.error("Не удалось назначить победителя");
    }
    setLoading(false);
  };

  const recordShipment = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId,
          shipperAddress: "logistics_bot",
          trackingId: "TRK-" + Math.random().toString(36).substring(7),
          eta: new Date(Date.now() + 86400000).toISOString(),
          docCID: "demo",
        }),
      });
      toast.success("Отгрузка зарегистрирована");
      await loadData();
    } catch {
      toast.error("Ошибка регистрации отгрузки");
    }
    setLoading(false);
  };

  const confirmReceipt = async (shipmentId: number) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/shipments/${shipmentId}/confirm`, { method: "POST" });
      toast.success("Поставка подтверждена");
      await loadData();
    } catch {
      toast.error("Не удалось подтвердить поставку");
    }
    setLoading(false);
  };

  const menuItems = [
    { key: "tenders", label: "Тендеры", onClick: () => navigate("/tenders") },
    { key: "analytics", label: "Статистика", onClick: () => navigate("/analytics") },
    { key: "suppliers", label: "Поставщики", onClick: () => navigate("/suppliers") },
    { key: "explorer", label: "Блокчейн-транзакции", onClick: () => navigate("/explorer") },
  ];

  if (!tender) return <div className="p-6">Загрузка...</div>;

  const bidColumns = [
    {
      title: "Поставщик",
      dataIndex: "supplierAddress",
      key: "supplier",
      render: (_: any, record: Bid) => record.supplier?.name ?? record.supplierAddress,
    },
    { title: "Цена", dataIndex: "price", key: "price", render: (price: number) => price + " ₽" },
    { title: "Срок доставки", dataIndex: "deliveryTime", key: "deliveryTime" },
  ];

  const shipmentColumns = [
    { title: "ID", dataIndex: "trackingId", key: "trackingId" },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "delivered" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: Shipment) =>
        record.status !== "delivered" ? (
          <Button size="small" onClick={() => confirmReceipt(Number(record.id))}>
            Подтвердить получение
          </Button>
        ) : null,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["tenders"]}
          items={menuItems}
          style={{ flex: 1 }}
        />
      </Header>

      <Content style={{ padding: "24px 48px" }}>
        <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: "Home" }, { title: `Tender #${tender.id}` }]} />

        {/* Заголовок с статусом */}
        <TenderHeader
          tenderId={tender.id}
          status={tender.status}
          title={tender.title}
          onCreateDemo={submitBid}
        />

        <div style={{ marginBottom: 24, background: "#fff", padding: 24, borderRadius: 8 }}>
          <Col>
              <Title level={4} style={{ margin: 0 }}>
                Описание тендера
              </Title>
            </Col>
          <p>{tender.description}</p>
          {tender.winnerSupplierId && (
            <Button onClick={() => navigate(`/supplier/${tender.winnerSupplierId}`)}>
              Перейти к поставщику
            </Button>
          )}
        </div>

        {/* Таблица ставок */}
        <div style={{ marginBottom: 24, background: "#fff", padding: 24, borderRadius: 8 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Предложения поставщиков
              </Title>
            </Col>
            <Col>
              <Space>
                <Button onClick={submitBid} type="primary">
                  Отправить демо-заявку
                </Button>
                <Button onClick={awardBestBid} disabled={bids.length === 0} type="default">
                  Выбрать лучшую заявку
                </Button>
              </Space>
            </Col>
          </Row>
          <Table columns={bidColumns} dataSource={bids.map((b) => ({ ...b, key: b.id }))} pagination={{ pageSize: 5 }} />
        </div>

        {/* Таблица отгрузок */}
        <div style={{ marginBottom: 24, background: "#fff", padding: 24, borderRadius: 8 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Отгрузки
              </Title>
            </Col>
            <Col>
              <Space>
                 {tender.status === "awarded" && (
            <Button style={{ marginBottom: 16 }} onClick={recordShipment} type="primary">
              Зарегистрировать отгрузку
            </Button>
                 )}
              </Space>
            </Col>
          </Row>
          <Table
            columns={shipmentColumns}
            dataSource={shipments.map((s) => ({ ...s, key: s.id }))}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
    </Layout>
  );
}