import React from 'react';

function PlaylistDisplay({ playlists }) {
  if (!playlists || playlists.length === 0) {
    return <p className="text-gray-500 text-center">No playlists found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {playlists.map((playlist, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <img
            src={playlist.images[0]?.url}
            alt={playlist.name}
            className="w-full rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">{playlist.name}</h3>
          <p className="text-gray-600 mt-2 text-sm">
            {playlist.description || 'No description available.'}
          </p>
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-500 hover:underline"
          >
            Open on Spotify
          </a>
        </div>
      ))}
    </div>
  );
}

export default PlaylistDisplay;
