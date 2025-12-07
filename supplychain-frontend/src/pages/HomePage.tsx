import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenders, setTenders] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/tenders")
      .then(res => res.json())
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
          title: "Demo Tender",
          description: "Automatically generated demo tender",
          budget: 10000
        })
      });

      const data = await res.json();

      navigate(`/tender/${data.tenderId}`);

    } catch (err) {
      console.error(err);
      alert("Failed to start demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-50 px-4 overflow-auto">
      <h1 className="text-4xl font-bold mt-10 text-gray-800">
        Smart Tender Workflow Demo
      </h1>

      <button
        onClick={startDemo}
        disabled={loading}
        className="mt-6 px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Starting demo..." : "Start Demo Process"}
      </button>

      {/* Tenders List */}
      <div className="mt-12 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Existing Tenders</h2>

        <div className="space-y-3">
          {tenders.map(t => (
            <div
              key={t.id}
              className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate(`/tender/${t.id}`)}
            >
              <div className="flex justify-between">
                <span className="font-semibold">
                  #{t.id} — {t.title}
                </span>
                <span className="text-sm text-gray-600">{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/explorer")}
        className="mt-6 px-4 py-2 bg-gray-700 text-white rounded"
      >
        View Blockchain Explorer
      </button>
    </div>
  );
};

export default HomePage;
