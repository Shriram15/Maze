import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import ScanHandler from "./pages/ScanHandler";
import Leaderboard from "./pages/Leaderboard";
import AthleteLogin from "./pages/AthleteLogin";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/scan/:checkpointId" element={<ScanHandler />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/athlete" element={<AthleteLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
