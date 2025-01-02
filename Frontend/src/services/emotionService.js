import * as faceapi from 'face-api.js';

// Function to load face-api.js models
export const loadModels = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(`../models/tiny_face/tiny_face_detector_model-weights_manifest.json`);
    await faceapi.nets.faceExpressionNet.loadFromUri(`../models/face_expression/face_expression_model-weights_manifest.json`);
  } catch (error) {
    console.error("Error loading face-api models:", error);
  }
};

// Function to detect emotion based on the image element
export const detectEmotion = async (imageElement) => {
  try {
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

    return null; // No face detected or emotions not available
  } catch (error) {
    console.error("Error detecting emotion:", error);
    return null;
  }
};
