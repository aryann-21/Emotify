const express = require('express');
const { getAccessToken } = require('../spotifyAuth');
const axios = require('axios');
const router = express.Router();

const emotionPlaylists = {
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
  surprised: 'mixed',
  neutral: 'party',
  fear: 'calming',
};

router.get('/', (req, res) => {
  res.json({ message: 'Playlist API is working!' });
});

router.get('/:emotion', async (req, res) => {
  const emotion = req.params.emotion;

  const genre = emotionPlaylists[emotion];
  if (!genre) {
    return res.status(400).json({
      error: `Invalid emotion: ${emotion}. Supported emotions are ${Object.keys(emotionPlaylists).join(', ')}`,
    });
  }

  let token;
  try {
    token = await getAccessToken();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch access token' });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${genre}%20songs&type=playlist&limit=9`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const playlists = response.data?.playlists?.items;
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: `No playlists found for emotion: ${emotion}` });
    }

    res.json({ playlists });
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('Spotify API Rate Limit Hit:', error.response.headers['retry-after']);
    }
    res.status(500).json({ error: 'Failed to fetch playlists from Spotify API' });
  }
});

module.exports = router;
