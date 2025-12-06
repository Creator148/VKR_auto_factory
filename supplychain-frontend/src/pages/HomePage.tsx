import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startDemo = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Smart Tender Workflow Demo
      </h1>

      <p className="text-gray-600 mb-10 text-center max-w-xl">
        This demo shows the full lifecycle of blockchain-inspired tender
        management...
      </p>

      <button
        onClick={startDemo}
        disabled={loading}
        className="px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Starting demo..." : "Start Demo Process"}
      </button>
    </div>
  );
};

export default HomePage;
