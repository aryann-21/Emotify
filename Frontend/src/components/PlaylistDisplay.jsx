import { useState, useEffect } from 'react';
import { fetchPlaylists } from '../services/spotifyService';

function PlaylistDisplay({ emotion }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (emotion) {
      const getPlaylists = async () => {
        const data = await fetchPlaylists(emotion);
        setPlaylists(data);
      };

      getPlaylists();
    }
  }, [emotion]);

  return (
    <div>
      <h2>Playlists for {emotion} Emotion</h2>
      <div>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div key={playlist.id}>
              <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={playlist.images[0].url} alt={playlist.name} />
                <p>{playlist.name}</p>
              </a>
            </div>
          ))
        ) : (
          <p>No playlists found</p>
        )}
      </div>
    </div>
  );
}

export default PlaylistDisplay;
