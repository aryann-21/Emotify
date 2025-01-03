import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load models from the public/models/weights directory
  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression");
      console.log("Models loaded successfully");
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  // Detect emotions from the video feed
  const detectEmotions = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 // Ensure the video feed is ready
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };

      // Adjust the canvas size to match the video
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // Clear the canvas and draw the detections
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      detectEmotions();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Container is centered using Flexbox */}
      <div className="relative">
        <Webcam
          ref={webcamRef}
          className="rounded-md"
          style={{
            width: "320px",  // Set the video width to 320px
            height: "240px", // Set the video height to 240px
          }}
          videoConstraints={{
            width: 320,  // Smaller width
            height: 240, // Smaller height
            facingMode: "user",
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{
            width: "320px",  // Match the canvas size with the video size
            height: "240px", // Match the canvas size with the video size
          }}
        />
      </div>
    </div>
  );
};

export default WebcamCapture;
