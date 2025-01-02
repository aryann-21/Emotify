import * as faceapi from 'face-api.js';
import { useEffect } from 'react';

function EmotionDetector({ image, onDetect }) {
  useEffect(() => {
    const detectEmotions = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('../models/tiny_face/tiny_face_detector_model-weights_manifest.json');
      await faceapi.nets.faceExpressionNet.loadFromUri('../models/face_expression/face_expression_model-weights_manifest.json');

      const img = document.getElementById('inputImage');
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

      if (detections.length > 0) {
        const emotions = detections[0].expressions;
        const dominantEmotion = Object.keys(emotions).reduce((a, b) => (emotions[a] > emotions[b] ? a : b));
        onDetect(dominantEmotion); // Send detected emotion to parent
      }
    };

    detectEmotions();
  }, [image]);

  return <img id="inputImage" src={image} alt="Captured" style={{ display: 'none' }} />;
}

export default EmotionDetector;
