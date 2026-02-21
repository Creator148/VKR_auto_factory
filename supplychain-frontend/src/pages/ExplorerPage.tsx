import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Table,
  Tag,
} from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface EventLog {
  blockNumber: number;
  txHash: string;
  event: string;
  payload: any;
  timestamp: number;
}

export default function ExplorerPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/explorer/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const menuItems = [
    { key: "tenders", label: "Тендеры", onClick: () => navigate("/tenders") },
    { key: "analytics", label: "Статистика", onClick: () => navigate("/analytics") },
    { key: "suppliers", label: "Поставщики", onClick: () => navigate("/suppliers") },
    { key: "explorer", label: "Блокчейн-транзакции", onClick: () => navigate("/explorer") },
  ];

  const columns = [
    {
      title: "Блок",
      dataIndex: "blockNumber",
      key: "blockNumber",
      width: 100,
    },
    {
      title: "Tx Hash",
      dataIndex: "txHash",
      key: "txHash",
      render: (hash: string) => (
        <Text code copyable style={{ fontSize: 12 }}>
          {hash}
        </Text>
      ),
    },
    {
      title: "Событие",
      dataIndex: "event",
      key: "event",
      render: (event: string) => <Tag color="blue">{event}</Tag>,
      width: 180,
    },
    {
      title: "Время",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 200,
      render: (ts: number) => new Date(ts).toLocaleString(),
    },
    {
      title: "Данные",
      dataIndex: "payload",
      key: "payload",
      render: (payload: any) => (
        <pre
          style={{
            maxWidth: 400,
            maxHeight: 200,
            overflow: "auto",
            background: "#f5f5f5",
            padding: 8,
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          {JSON.stringify(payload, null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["explorer"]}
          items={menuItems}
          style={{ flex: 1 }}
        />
      </Header>

      {/* Content */}
      <Content style={{ padding: "24px 48px" }}>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[{ title: "Home" }, { title: "Blockchain Explorer" }]}
        />

        {/* Заголовок */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Обзор событий блокчейна
          </Title>
        </div>

        {/* Таблица */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Table
            columns={columns}
            dataSource={events.map((e) => ({
              ...e,
              key: `${e.txHash}-${e.blockNumber}`,
            }))}
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: "Событий пока нет",
            }}
          />
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}
