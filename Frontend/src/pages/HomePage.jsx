import { useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import EmotionDetector from '../components/EmotionDetector';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState('');
  const navigate = useNavigate();

  const handleCapture = (screenshot) => setImage(screenshot);
  const handleDetect = (detectedEmotion) => {
    setEmotion(detectedEmotion);
    navigate('/playlist', { state: { emotion: detectedEmotion } });
  };

  return (
    <div>
      <h1>Emotion-Based Playlist Curator</h1>
      <CameraFeed onCapture={handleCapture} />
      {image && <EmotionDetector image={image} onDetect={handleDetect} />}
    </div>
  );
}

export default HomePage;
