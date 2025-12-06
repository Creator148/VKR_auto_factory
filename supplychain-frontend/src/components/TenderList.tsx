import { useEffect, useState } from "react";
import { TenderAPI } from "../api/tender";

export function TenderList() {
  const [tenders, setTenders] = useState<any[]>([]);

  useEffect(() => {
    TenderAPI.list().then(res => setTenders(res.data));
  }, []);

  return (
    <div>
      <h2>Tenders</h2>
      <ul>
        {tenders.map((t) => (
          <li key={t.id}>
            {t.title} — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
