const fetchPlaylists = async (emotion) => {
  try {
    const response = await fetch(`http://localhost:5000/api/playlists/${emotion}`);
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }
    const playlists = await response.json();
    return playlists;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

export { fetchPlaylists };
