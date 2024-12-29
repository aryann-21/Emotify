const express = require('express');
const cors = require('cors');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/playlists', playlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
