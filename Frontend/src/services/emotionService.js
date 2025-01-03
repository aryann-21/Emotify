import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression');
};

export const detectEmotion = async (imageElement) => {
  const detections = await faceapi
    .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detections.length > 0) {
    const emotions = detections[0].expressions;
    const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
      emotions[a] > emotions[b] ? a : b
    );
    return dominantEmotion;
  }
  return null;
};
