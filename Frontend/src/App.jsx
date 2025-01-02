import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlaylistPage from './pages/PlaylistPage'; // If needed for other pages

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playlist" element={<PlaylistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
