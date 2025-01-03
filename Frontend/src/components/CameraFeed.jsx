import React, { useRef } from 'react';
import Webcam from 'react-webcam';

function CameraFeed({ onCapture }) {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc); // Pass captured image to parent
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border border-gray-300"
      />
      <button
        onClick={handleCapture}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Capture Emotion
      </button>
    </div>
  );
}

export default CameraFeed;
