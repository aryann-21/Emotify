import React, { useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import EmotionDetector from '../components/EmotionDetector';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const navigate = useNavigate();

  const handleCapture = (image) => {
    setCapturedImage(image);
  };

  const handleEmotionDetected = (detectedEmotion) => {
    setEmotion(detectedEmotion);
    if (detectedEmotion) {
      navigate('/playlists', { state: { emotion: detectedEmotion } });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome to Emotion-Based Playlist Curator</h1>
      <CameraFeed onCapture={handleCapture} />
      {capturedImage && (
        <EmotionDetector image={capturedImage} onDetect={handleEmotionDetected} />
      )}
      {emotion && (
        <p className="mt-4 text-gray-700">
          Detected Emotion: <span className="font-semibold">{emotion}</span>
        </p>
      )}
    </div>
  );
}

export default HomePage;
