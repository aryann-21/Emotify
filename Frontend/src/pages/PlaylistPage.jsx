import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PlaylistDisplay from '../components/PlaylistDisplay';

function PlaylistPage() {
  const { state } = useLocation();
  const { emotion } = state || {};
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (emotion) {
      fetch(`http://localhost:5000/api/playlists/${emotion}`)
        .then((res) => res.json())
        .then((data) => setPlaylists(data))
        .catch(console.error);
    }
  }, [emotion]);

  return (
    <div>
      <h2>Playlists for {emotion}</h2>
      <PlaylistDisplay playlists={playlists} />
    </div>
  );
}

export default PlaylistPage;
