const axios = require('axios');
require('dotenv').config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('Missing Spotify API credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file.');
  process.exit(1);
}

const getAccessToken = async () => {
  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.response?.data || error.message);
    throw new Error('Failed to fetch Spotify access token. Check your API credentials or network connection.');
  }
};

module.exports = { getAccessToken };
