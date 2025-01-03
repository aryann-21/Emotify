import React, { useEffect, useState } from 'react';
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold text-center mb-6">
        Playlists for Emotion: {emotion}
      </h2>
      <PlaylistDisplay playlists={playlists} />
    </div>
  );
}

export default PlaylistPage;
