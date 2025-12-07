import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function TenderPage() {
  const { id } = useParams();
  const tenderId = id;

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
      toast.error("Failed to load tender data");
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
          price: Math.floor(Math.random() * 9000 + 1000),
          deliveryTime: "5 days"
        })
      });

      toast.success("Demo bid submitted");
      await loadData();
    } catch {
      toast.error("Failed to submit bid");
    }
    setLoading(false);
  };

  const awardBestBid = async () => {
    if (bids.length === 0) {
      toast.error("No bids to award");
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

      toast.success("Bid awarded");
      await loadData();
    } catch {
      toast.error("Failed to award bid");
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

      toast.success("Shipment recorded");
      await loadData();
    } catch {
      toast.error("Failed to record shipment");
    }
    setLoading(false);
  };

  const confirmReceipt = async (shipmentId: number) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/shipments/${shipmentId}/confirm`, {
        method: "POST"
      });
      toast.success("Goods received");
      await loadData();
    } catch {
      toast.error("Failed to confirm receipt");
    }
    setLoading(false);
  };

  if (!tender) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Tender #{tenderId}</h2>

        <div className="space-y-3">
          {[
            "Tender Created",
            "Bids Submitted",
            "Bid Awarded",
            "Shipment",
            "Payment Completed"
          ].map((label, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg ${
                step >= idx + 1 ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-10 space-y-10 overflow-y-auto">

        <div className="p-6 bg-white rounded-xl shadow-md">
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <p className="text-gray-700 mt-2">{tender.description}</p>
          <p className="mt-2 text-lg">
            <b>Status:</b> {tender.status}
          </p>
        </div>

        {/* Bids */}
        <div className="p-6 bg-white rounded-xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bids</h2>

            <div className="flex space-x-3">
              <button
                onClick={submitBid}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Submit Demo Bid
              </button>

              <button
                onClick={awardBestBid}
                disabled={bids.length === 0}
                className="px-4 py-2 bg-green-600 disabled:bg-gray-400 text-white rounded-lg"
              >
                Award Best Bid
              </button>
            </div>
          </div>

          {bids.map(b => (
            <div key={b.id} className="p-3 border rounded-lg">
              Supplier: <b>{b.supplier?.name}</b>,
              Price: <b>${b.price}</b>
            </div>
          ))}
        </div>

        {/* Shipments */}
        <div className="p-6 bg-white rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">Shipments</h2>

          {tender.status === "awarded" && (
            <button
              onClick={recordShipment}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Record Shipment
            </button>
          )}

          {shipments.map(s => (
            <div key={s.id} className="p-3 border rounded-lg">
              <p><b>{s.trackingId}</b> — {s.status}</p>

              {s.status !== "delivered" && (
                <button
                  onClick={() => confirmReceipt(s.id)}
                  className="mt-2 px-3 py-1 bg-orange-600 text-white rounded-lg"
                >
                  Confirm Receipt
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
