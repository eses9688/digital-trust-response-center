import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DayView from "./pages/DayView";
import Briefing from "./pages/Briefing";
import Analysis from "./pages/Analysis";
import Result from "./pages/Result";
import Learning from "./pages/Learning";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/day/:dayId" element={<DayView />} />
        <Route path="/briefing/:caseId" element={<Briefing />} />
        <Route path="/analysis/:caseId" element={<Analysis />} />
        <Route path="/result/:caseId" element={<Result />} />
        <Route path="/learning/:caseId" element={<Learning />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;