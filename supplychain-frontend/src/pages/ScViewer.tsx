import { useEffect, useState } from "react";

export default function ContractViewer() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/workflow/blocks")
      .then(r => r.json())
      .then(setBlocks);
  }, []);

  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      <div className="col-span-1 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Blockchain</h2>
        {blocks.map((b: any) => (
          <div key={b.blockNumber} className="border-b py-2 text-sm">
            Block #{b.blockNumber} — {b.event}
          </div>
        ))}
      </div>

      <div className="col-span-2 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Block Details</h2>
        {/* Add selection + view logic */}
      </div>
    </div>
  );
}
