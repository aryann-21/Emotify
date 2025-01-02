import Webcam from 'react-webcam';
import { useState } from 'react';
import EmotionDetector from './EmotionDetector';

function CameraFeed({ onCapture }) {
  const [image, setImage] = useState(null);

  const handleCapture = (webcam) => {
    const capturedImage = webcam.getScreenshot();
    setImage(capturedImage);
    onCapture(capturedImage); // Send image to parent
  };

  return (
    <div>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        onUserMediaError={(err) => console.error(err)}
        onUserMedia={() => console.log('Webcam enabled')}
        ref={(webcam) => {
          if (webcam && !image) {
            handleCapture(webcam); // Capture an image when webcam is ready
          }
        }}
      />
      {image && <EmotionDetector image={image} onDetect={onCapture} />}
    </div>
  );
}

export default CameraFeed;
