import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraFeed from '../components/CameraFeed';
import EmotionDetector from '../components/EmotionDetector';
import { detectEmotion } from '../services/emotionService';  // Assume this is from your emotionService.js

function HomePage() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const navigate = useNavigate();

  const handleCapture = async (image) => {
    setCapturedImage(image); // Set the captured image
    const detectedEmotion = await detectEmotion(image); // Detect emotion from the captured image
    setEmotion(detectedEmotion); // Set the detected emotion

    if (detectedEmotion) {
      // Navigate to the PlaylistPage with the detected emotion
      navigate('/playlist', { state: { emotion: detectedEmotion } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Emotion-Based Playlist Curator</h1>

      {/* Webcam Feed */}
      <div className="mb-8">
        <CameraFeed onCapture={handleCapture} />
      </div>

      {/* Emotion Detection */}
      {capturedImage && (
        <div className="mb-8">
          <EmotionDetector image={capturedImage} onDetect={setEmotion} />
        </div>
      )}

      {/* Display Captured Emotion */}
      {emotion && (
        <div className="text-xl mt-4 mb-8">
          <p>Detected Emotion: <span className="font-semibold">{emotion}</span></p>
        </div>
      )}

      {/* Capture Button */}
      <div className="mt-4">
        <button
          onClick={() => handleCapture(capturedImage)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md"
        >
          Capture Emotion
        </button>
      </div>
    </div>
  );
}

export default HomePage;
