import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CampgroundManagement } from "./components/CampgroundManagement";
import { CampgroundDetail } from "./components/CampgroundDetail";
import { ForecastAnalysis } from "./components/ForecastAnalysis";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CampgroundManagement />} />
        <Route path="/forecast" element={<ForecastAnalysis />} />
        <Route path="/campground/:id" element={<CampgroundDetail />} />
      </Routes>
    </BrowserRouter>
  );
}