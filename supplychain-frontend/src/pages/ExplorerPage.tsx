import { useEffect, useState } from "react";

interface EventLog {
  blockNumber: number;
  txHash: string;
  event: string;
  payload: any;
  timestamp: number;
}

export default function ExplorerPage() {
  const [events, setEvents] = useState<EventLog[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/explorer/events")
      .then(res => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Blockchain Event Explorer
      </h1>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full text-sm">
          <thead className="border-b font-semibold text-gray-700">
            <tr>
              <th className="py-2 text-left">Block</th>
              <th className="py-2 text-left">Tx Hash</th>
              <th className="py-2 text-left">Event</th>
              <th className="py-2 text-left">Timestamp</th>
              <th className="py-2 text-left">Payload</th>
            </tr>
          </thead>

          <tbody>
            {events.map(ev => (
              <tr key={ev.txHash} className="border-b hover:bg-gray-50">
                <td className="py-2">{ev.blockNumber}</td>
                <td className="py-2 font-mono text-blue-600">{ev.txHash}</td>
                <td className="py-2">{ev.event}</td>
                <td className="py-2">
                  {new Date(ev.timestamp).toLocaleString()}
                </td>
                <td className="py-2 text-xs max-w-lg">
                  <pre>{JSON.stringify(ev.payload, null, 2)}</pre>
                </td>
              </tr>
            ))}

            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No events yet…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
