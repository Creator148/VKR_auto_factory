import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from 'antd';


export default function TenderPage() {
  const { id } = useParams();
  const tenderId = id;
  const navigate = useNavigate();
  const [tender, setTender] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const t = await fetch(`http://localhost:5000/api/tenders/${tenderId}`).then(r => r.json());
      const b = await fetch(`http://localhost:5000/api/tenders/${tenderId}/bids`).then(r => r.json());
      const s = await fetch(`http://localhost:5000/api/shipments/tender/${tenderId}`).then(r => r.json());

      setTender(t);
      setBids(b);
      setShipments(s);
    } catch (err) {
      toast.error("Ошибка загрузки данных тендера");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStep = () => {
    if (!tender) return 1;

    if (tender.status === "open") {
      return bids.length > 0 ? 2 : 1;
    }
    if (tender.status === "awarded") {
      if (shipments.some(s => s.status === "delivered")) return 5;
      if (shipments.length > 0) return 4;
      return 3;
    }
    return 1;
  };

  const step = getStep();

  const submitBid = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/tenders/${tenderId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierAddress: "Supplier_" + Math.floor(Math.random() * 1000),
          price: Math.floor(Math.random() * 90000 + 10000),
          deliveryTime: "5 дней"
        })
      });

      toast.success("Заявка отправлена");
      await loadData();
    } catch {
      toast.error("Ошибка при отправке заявки");
    }
    setLoading(false);
  };

  const awardBestBid = async () => {
    if (bids.length === 0) {
      toast.error("Нет предложений для выбора");
      return;
    }

    const best = [...bids].sort((a, b) => a.price - b.price)[0];

    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/tenders/${tenderId}/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId: best.id, callerAddress: "demo_user" })
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
          docCID: "demo"
        })
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
      await fetch(`http://localhost:5000/api/shipments/${shipmentId}/confirm`, {
        method: "POST"
      });
      toast.success("Поставка подтверждена");
      await loadData();
    } catch {
      toast.error("Не удалось подтвердить поставку");
    }
    setLoading(false);
  };

  if (!tender) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Тендер #{tenderId}</h2>

        <div className="space-y-3">
          {[
            "Создание тендера",
            "Подача предложений",
            "Выбор победителя",
            "Отгрузка",
            "Платёж завершён"
          ].map((label, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg ${
                step >= idx + 1 ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 space-y-10 overflow-y-auto">

        <div className="p-6 bg-white rounded-xl shadow-md text-gray-900">
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <p className="text-gray-700 mt-2">{tender.description}</p>
          <p className="mt-2 text-lg">
            <b>Статус:</b> {tender.status === "open" ? "Открыт" : tender.status}
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(`/escrow/${id}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Эскроу-счёт
          </button>
        </div>

        {/* Bids */}
        <div className="p-6 bg-white rounded-xl shadow space-y-4 text-gray-900">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Предложения поставщиков</h2>

            <div className="flex space-x-3">
              <button
                onClick={submitBid}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Отправить демо-заявку
              </button>

              <button
                onClick={awardBestBid}
                disabled={bids.length === 0}
                className="px-4 py-2 bg-green-600 disabled:bg-gray-400 text-white rounded-lg"
              >
                Выбрать лучшую заявку
              </button>
            </div>
          </div>

          {bids.map(b => (
            <div key={b.id} className="p-3 border rounded-lg">
              Поставщик: <b>{b.supplier?.name ?? b.supplierAddress}</b>, Цена:{" "}
              <b>{b.price} ₽</b>
            </div>
          ))}
          <button
            onClick={() => navigate(`/supplier/${tender.winnerSupplierId}`)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Перейти к поставщику
          </button>
        </div>

        {/* Shipments */}
        <div className="p-6 bg-white rounded-xl shadow space-y-4 text-gray-900">
          <h2 className="text-xl font-semibold">Отгрузки</h2>

          {tender.status === "awarded" && (
            <button
              onClick={recordShipment}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Зарегистрировать отгрузку
            </button>
          )}

          {shipments.map(s => (
            <div key={s.id} className="p-3 border rounded-lg">
              <p>
                <b>{s.trackingId}</b> — {s.status === "delivered" ? "доставлено" : "в пути"}
              </p>

              {s.status !== "delivered" && (
                <button
                  onClick={() => confirmReceipt(s.id)}
                  className="mt-2 px-3 py-1 bg-orange-600 text-white rounded-lg"
                >
                  Подтвердить получение
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
