export const fetchPlaylists = async (emotion) => {
  try {
    const response = await fetch(`http://localhost:5000/api/playlists/${emotion}`);
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
