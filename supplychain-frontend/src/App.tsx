import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TenderPage from "./pages/TenderPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tender/:id" element={<TenderPage />} />
    </Routes>
  );
}
