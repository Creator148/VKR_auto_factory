import { useState } from "react";
import { WorkflowAPI } from "../api/workflow";

export function WorkflowDemo() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runDemo() {
    setLoading(true);
    const res = await WorkflowAPI.demo();
    setResult(res.data);
    setLoading(false);
  }

  return (
    <div>
      <h2>Full Workflow Demo</h2>
      <button onClick={runDemo} disabled={loading}>
        {loading ? "Running..." : "Run demo workflow"}
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
