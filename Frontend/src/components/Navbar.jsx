import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          EmotionPlaylistApp
        </Link>
        <div>
          <Link to="/" className="mr-4 hover:text-gray-400">
            Home
          </Link>
          <Link to="/playlist" className="hover:text-gray-400">
            Playlist
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
