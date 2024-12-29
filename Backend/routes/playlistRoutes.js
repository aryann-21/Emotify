const express = require('express');
const { getAccessToken } = require('../spotifyAuth');
const axios = require('axios');
const router = express.Router();

router.get('/:emotion', async (req, res) => {
  const emotion = req.params.emotion;
  const token = await getAccessToken();
  const emotionPlaylists = {
    happy: 'pop',
    sad: 'acoustic',
    angry: 'rock',
    surprised: 'electronic',
    neutral: 'classical',
  };

  try {
    const genre = emotionPlaylists[emotion] || 'chill';
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/categories/${genre}/playlists`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(response.data.playlists.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

module.exports = router;
