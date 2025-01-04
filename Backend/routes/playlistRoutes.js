const express = require('express');
const { getAccessToken } = require('../spotifyAuth');
const axios = require('axios');
const router = express.Router();

// Emotion to genre mapping
const emotionPlaylists = {
  happy: 'pop',
  sad: 'acoustic',
  angry: 'rock',
  surprised: 'electronic',
  neutral: 'classical',
  fear: 'ambient',
};

// Root route to test if the API is working
router.get('/', (req, res) => {
  res.json({ message: 'Playlist API is working!' });
});

// Route to fetch playlists based on emotion
router.get('/:emotion', async (req, res) => {
  const emotion = req.params.emotion;

  // Validate emotion input
  const genre = emotionPlaylists[emotion];
  if (!genre) {
    return res.status(400).json({
      error: `Invalid emotion: ${emotion}. Supported emotions are ${Object.keys(emotionPlaylists).join(', ')}`,
    });
  }

  let token;
  try {
    // Fetch Spotify API token
    token = await getAccessToken();
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.message);
    return res.status(500).json({ error: 'Failed to fetch access token' });
  }

  try {
    // Fetch playlists from Spotify
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=genre:${genre}&type=playlist&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Check for valid playlists in the response
    const playlists = response.data?.playlists?.items;
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: `No playlists found for emotion: ${emotion}` });
    }

    // Send playlists as response
    res.json({ playlists });
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('Spotify API Rate Limit Hit:', error.response.headers['retry-after']);
    }
    console.error('Spotify API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch playlists from Spotify API' });
  }
});

module.exports = router;
