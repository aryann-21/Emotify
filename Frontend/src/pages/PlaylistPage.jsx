import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PlaylistDisplay from '../components/PlaylistDisplay';

function PlaylistPage() {
  const { state } = useLocation();
  const { emotion } = state || {};
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (emotion) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:5000/api/playlists/${emotion}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch playlists: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setPlaylists(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [emotion]);

  if (loading) {
    return <div>Loading playlists...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Playlists for {emotion}</h2>
      {playlists.length > 0 ? (
        <PlaylistDisplay playlists={playlists} />
      ) : (
        <div>No playlists found for {emotion}</div>
      )}
    </div>
  );
}

export default PlaylistPage;
