import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Typography, Button, Table, Tag, Space } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// Заголовок с кнопкой
const DashboardHeader = ({ onCreateDemo }: { onCreateDemo?: () => void }) => {
  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8, marginBottom: 24 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Рабочее пространство для работы с умными тендерами
          </Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={onCreateDemo}>
              Создать демонстрационный тендер
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

interface Tender {
  id: string;
  title: string;
  status: string;
  budget: number;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tenders")
      .then((res) => res.json())
      .then(setTenders)
      .catch(console.error);
  }, []);

  const startDemo = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterAddress: "0x-demo",
          detailsCID: "cid123",
          deadline: Date.now() + 100000,
          title: "Демонстрационный тендер",
          description: "Автоматически созданный тендер",
          budget: 100000000,
        }),
      });

      const data = await res.json();
      navigate(`/tender/${data.tenderId}`);
    } catch (err) {
      console.error(err);
      alert("Не удалось создать демо-тендер");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { key: "tenders", label: "Тендеры", onClick: () => navigate("/tenders") },
    { key: "analytics", label: "Статистика", onClick: () => navigate("/analytics") },
    { key: "suppliers", label: "Поставщики", onClick: () => navigate("/suppliers") },
    { key: "explorer", label: "Блокчейн-транзакции", onClick: () => navigate("/explorer") },
  ];

  // Определяем колонки таблицы
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = status === "open" ? "green" : "volcano";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Бюджет",
      dataIndex: "budget",
      key: "budget",
      render: (budget: number) => budget.toLocaleString() + " ₽",
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: Tender) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/tender/${record.id}`)}>
            Просмотр
          </Button>
        </Space>
      ),
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
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      <Content style={{ padding: "24px 48px" }}>
        <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: "Home" }, { title: "Tenders" }]} />

        {/* Заголовок с кнопкой */}
        <DashboardHeader onCreateDemo={startDemo} />

        {/* Таблица тендеров */}
        <Table
          columns={columns}
          dataSource={tenders.map((t) => ({ ...t, key: t.id }))}
          pagination={{ pageSize: 5 }}
        />
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default HomePage;