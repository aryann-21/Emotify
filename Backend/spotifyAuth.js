const axios = require('axios');
const querystring = require('querystring');

const getAccessToken = async () => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    data: querystring.stringify({ grant_type: 'client_credentials' }),
  };

  const response = await axios(authOptions);
  return response.data.access_token;
};

module.exports = { getAccessToken };
