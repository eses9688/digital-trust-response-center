import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Dashboard from "./pages/Dashboard";
import EpisodePlayer from "./pages/EpisodePlayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/episode/:episodeId" element={<EpisodePlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;