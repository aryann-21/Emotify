function PlaylistDisplay({ playlists }) {
  return (
    <div>
      {playlists.map((playlist) => (
        <div key={playlist.id}>
          <img src={playlist.images[0].url} alt={playlist.name} />
          <p>{playlist.name}</p>
        </div>
      ))}
    </div>
  );
}

export default PlaylistDisplay;
