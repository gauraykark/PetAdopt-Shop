import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BrowsePets from './pages/BrowsePets';

// BrowserRouter is in main.jsx — do NOT add it here again
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<BrowsePets />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
