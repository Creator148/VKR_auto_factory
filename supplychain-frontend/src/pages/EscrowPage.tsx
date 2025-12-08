import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EscrowPage() {
  const { tenderId } = useParams();
  const [escrow, setEscrow] = useState<any>(null);

  const loadEscrow = () => {
    fetch(`http://localhost:5000/api/escrow/${tenderId}`)
      .then(res => res.json())
      .then(setEscrow)
      .catch(() => setEscrow(null));
  };

  useEffect(() => {
    loadEscrow();
  }, []);

  const deposit = async () => {
    await fetch(`http://localhost:5000/api/escrow/${tenderId}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: "factory.eth", amount: 10000 })
    });
    loadEscrow();
  };

  const lock = async () => {
    await fetch(`http://localhost:5000/api/escrow/${tenderId}/lock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payee: "supplier.eth" })
    });
    loadEscrow();
  };

  const release = async () => {
    await fetch(`http://localhost:5000/api/escrow/${tenderId}/release`, {
      method: "POST"
    });
    loadEscrow();
  };

  if (!escrow) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Эскроу-счёт для тендера #{tenderId} отсутствует
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-gray-900">
      <h1 className="text-3xl font-bold">
        Эскроу — Тендер #{tenderId}
      </h1>

      <div className="p-6 bg-white shadow rounded-lg">
        <p className="text-xl">
          Баланс: <b>{escrow.balance} ₽</b>
        </p>
        <p>Плательщик: {escrow.payer}</p>
        <p>Получатель: {escrow.payee ?? "—"}</p>
        <p>
          Статус: <b>{escrow.locked ? "Заблокирован" : "Открыт"}</b>
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={deposit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Внести депозит
          </button>

          <button
            onClick={lock}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          >
            Заблокировать эскроу
          </button>

          <button
            onClick={release}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Разблокировать / Выплатить
          </button>
        </div>
      </div>

      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-3">История операций</h2>

        <ul className="space-y-2">
          {escrow.history.map((h: any, i: number) => (
            <li key={i} className="border p-3 rounded text-sm">
              <b>{h.type}</b> — {h.amount} ₽
              <br />
              <span className="text-gray-500">
                {new Date(h.timestamp).toLocaleString()}
              </span>
            </li>
          ))}

          {escrow.history.length === 0 && (
            <p className="text-gray-400">Операций пока нет</p>
          )}
        </ul>
      </div>
    </div>
  );
}
