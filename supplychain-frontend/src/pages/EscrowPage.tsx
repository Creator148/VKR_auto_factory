import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EscrowPage() {
  const { tenderId } = useParams();
  const [escrow, setEscrow] = useState<any>(null);

  const loadEscrow = () => {
    fetch(`http://localhost:5000/api/escrow/${tenderId}`)
      .then(res => res.json())
      .then(setEscrow);
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

  if (!escrow)
    return (
      <div className="p-8 text-gray-500">
        No escrow created yet for tender #{tenderId}
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Escrow Dashboard — Tender #{tenderId}
      </h1>

      <div className="p-6 bg-white shadow rounded-lg">
        <p className="text-xl">💰 Balance: <b>{escrow.balance}</b></p>
        <p>Payer: {escrow.payer}</p>
        <p>Payee: {escrow.payee ?? "—"}</p>
        <p>Status: {escrow.locked ? "🔒 Locked" : "🟢 Open"}</p>

        <div className="mt-4 flex gap-3">
          <button onClick={deposit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Deposit Funds
          </button>

          <button onClick={lock} className="px-4 py-2 bg-yellow-500 text-white rounded">
            Lock Escrow
          </button>

          <button onClick={release} className="px-4 py-2 bg-green-600 text-white rounded">
            Release Funds
          </button>
        </div>
      </div>

      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-2">Transaction History</h2>

        <ul className="space-y-2">
          {escrow.history.map((h: any, i: number) => (
            <li key={i} className="border p-2 rounded text-sm">
              <b>{h.type}</b> — {h.amount}  
              <br />
              <span className="text-gray-500">
                {new Date(h.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
