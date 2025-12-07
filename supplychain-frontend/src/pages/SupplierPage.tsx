import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SupplierPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/suppliers/${id}/profile`)
      .then(r => r.json())
      .then(setData);
  }, [id]);

  if (!data) return <div className="p-10">Loading...</div>;

  const { supplier, bids, shipments } = data;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <img 
          src={`https://robohash.org/${supplier.name}`} 
          className="w-20 h-20 rounded-full" 
        />

        <div>
          <h1 className="text-3xl font-bold">{supplier.name}.eth</h1>
          <p className="text-gray-600">
            Wallet: 0x{btoa(supplier.name).slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Bids</h2>
          {bids.map((b: any) => (
            <div key={b.id} className="border-b py-2">
              <p>Bid #{b.id} — {b.price}$</p>
            </div>
          ))}
        </section>

        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Shipments</h2>
          {shipments.map((s: any) => (
            <div key={s.id} className="border-b py-2">
              <p>Shipment #{s.id} — {s.status}</p>
            </div>
          ))}
        </section>

        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Reputation</h2>
          <p className="text-lg">⭐⭐⭐⭐☆</p>
          <p className="text-sm text-gray-600">Based on delivery success rate</p>
        </section>
      </div>
    </div>
  );
}
