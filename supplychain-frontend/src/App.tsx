import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TenderPage from "./pages/TenderPage";
import ExplorerPage from "./pages/ExplorerPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tender/:id" element={<TenderPage />} />
      <Route path="/explorer" element={<ExplorerPage />} />
    </Routes>
  );
}
