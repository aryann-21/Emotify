import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';

function EmotionDetector({ image, onDetect }) {
  useEffect(() => {
    const detectEmotions = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression');

      const img = document.getElementById('inputImage');
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const emotions = detections[0].expressions;
        const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
          emotions[a] > emotions[b] ? a : b
        );
        onDetect(dominantEmotion);
      }
    };

    if (image) detectEmotions();
  }, [image, onDetect]);

  return (
    <div className="hidden">
      <img id="inputImage" src={image} alt="Captured" />
    </div>
  );
}

export default EmotionDetector;
