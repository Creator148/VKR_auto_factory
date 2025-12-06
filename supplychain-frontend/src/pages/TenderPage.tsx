import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TenderPage() {
  const { id } = useParams();
  const tenderId = id;

  const [tender, setTender] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const t = await fetch(`http://localhost:5000/api/tenders/${tenderId}`).then(r => r.json());
    const b = await fetch(`http://localhost:5000/api/tenders/${tenderId}/bids`).then(r => r.json());
    const s = await fetch(`http://localhost:5000/api/shipments/tender/${tenderId}`).then(r => r.json());

    setTender(t);
    setBids(b);
    setShipments(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitBid = async () => {
    setLoading(true);
    await fetch(`http://localhost:5000/api/tenders/${tenderId}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierAddress: "Supplier_" + Math.floor(Math.random() * 1000),
        price: Math.floor(Math.random() * 9000 + 1000),
        deliveryTime: "5 days"
      })
    });
    await loadData();
    setLoading(false);
  };

  const awardBestBid = async () => {
    if (bids.length === 0) return alert("No bids yet");

    const best = [...bids].sort((a, b) => a.price - b.price)[0];

    setLoading(true);
    await fetch(`http://localhost:5000/api/tenders/${tenderId}/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidId: best.id, callerAddress: "demo_user" })
    });
    await loadData();
    setLoading(false);
  };

  const recordShipment = async () => {
    setLoading(true);
    await fetch(`http://localhost:5000/api/shipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenderId,
        shipperAddress: "logistic_bot",
        trackingId: "TRK-" + Math.random().toString(36).substring(7),
        eta: new Date(Date.now() + 86400000).toISOString(),
        docCID: "demo_shipment_doc"
      })
    });
    await loadData();
    setLoading(false);
  };

  const confirmReceipt = async (shipmentId: number) => {
    setLoading(true);
    await fetch(`http://localhost:5000/api/shipments/${shipmentId}/confirm`, {
      method: "POST"
    });
    await loadData();
    setLoading(false);
  };

  if (!tender) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-10 space-y-10">

      <h1 className="text-3xl font-bold text-gray-800">
        Tender #{tenderId}
      </h1>

      {/* Tender info */}
      <div className="p-6 bg-white rounded-xl shadow">
        <p><b>Title:</b> {tender.title}</p>
        <p><b>Status:</b> {tender.status}</p>
        <p><b>Budget:</b> {tender.budget}</p>
      </div>

      {/* Bids section */}
      <div className="p-6 bg-white rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Bids</h2>

        <button
          onClick={submitBid}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Submit Demo Bid
        </button>

        <button
          onClick={awardBestBid}
          disabled={loading || bids.length === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Award Best Bid
        </button>

        {bids.map(b => (
          <div key={b.id} className="p-3 border rounded">
            Supplier: <b>{b.supplier?.name}</b> — Price: <b>{b.price}</b>
          </div>
        ))}
      </div>

      {/* Shipments */}
      <div className="p-6 bg-white rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Shipments</h2>

        {tender.status === "awarded" && (
          <button
            onClick={recordShipment}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Record Shipment
          </button>
        )}

        {shipments.map(s => (
          <div key={s.id} className="p-3 border rounded">
            <p><b>Tracking:</b> {s.trackingId}</p>
            <p><b>Status:</b> {s.status}</p>

            {s.status !== "delivered" && (
              <button
                onClick={() => confirmReceipt(s.id)}
                className="mt-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
              >
                Confirm Receipt
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
