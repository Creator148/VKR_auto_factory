import { TenderList } from "../components/TenderList";
import { WorkflowDemo } from "../components/WorkflowDemo";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>SupplyChain dApp MVP</h1>
      <WorkflowDemo />
      <TenderList />
    </div>
  );
}
