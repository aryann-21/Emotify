import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [isVideoVisible, setIsVideoVisible] = useState(true); // State to toggle video visibility

  // Load models for face detection and emotion recognition
  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression");
  };

  // Detect emotions from the webcam feed
  const detectEmotions = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 // Ensure the video is ready
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      // Determine the dominant emotion
      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setEmotion(dominantEmotion);
      }
    }
  };

  // Fetch playlists based on the detected emotion
  const fetchPlaylists = async (emotion) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/playlists/${emotion}`
      );
      console.log("API Response:", response.data);
      setPlaylists(response.data.playlists || []); // Ensure fallback in case of no playlists
    } catch (error) {
      console.error("Error fetching playlists:", error.message);
    }
  };

  // Manually trigger emotion detection and show playlists
  const handleEmotionDetection = () => {
    setIsVideoVisible(false); // Hide the video when the button is pressed
    detectEmotions(); // Trigger emotion detection
  };

  const resetEmotionDetection = () => {
    setEmotion(""); // Reset emotion state
    setPlaylists([]); // Clear playlists
    setIsVideoVisible(true); // Show the video again for new emotion detection
  };

  useEffect(() => {
    loadModels(); // Load models when component mounts
  }, []);

  useEffect(() => {
    // Run emotion detection at a set interval if video is visible
    if (isVideoVisible) {
      const interval = setInterval(() => {
        detectEmotions();
      }, 100);

      return () => clearInterval(interval); // Clear the interval when component unmounts
    }
  }, [isVideoVisible]);

  useEffect(() => {
    if (emotion) {
      console.log("Detected emotion:", emotion);
      fetchPlaylists(emotion); // Fetch playlists when emotion changes
    }
  }, [emotion]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="relative mb-4">
        {isVideoVisible && (
          <Webcam
            ref={webcamRef}
            className="rounded-md"
            style={{ width: "720px", height: "480px" }}
            videoConstraints={{ width: 320, height: 240, facingMode: "user" }}
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: "720px", height: "480px" }}
        />
      </div>

      {/* Button to trigger emotion detection */}
      {isVideoVisible && (
        <button
          onClick={handleEmotionDetection}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Detect Emotion
        </button>
      )}

      {/* Show playlists when emotion is detected */}
      {emotion && !isVideoVisible && (
        <div className="bg-gray-800 rounded-xl p-10 mt-4 w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            Playlists for Emotion: {emotion}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.length > 0 ? (
              playlists
                .filter(
                  (playlist) =>
                    playlist && playlist.images && playlist.images.length > 0
                ) // Ensure valid playlists
                .map((playlist, index) => (
                  <div
                    key={index}
                    className="playlist-item bg-gray-700 text-gray-100 p-4 rounded-md shadow-md flex flex-col h-full"
                  >
                    {/* Playlist Image */}
                    <img
                      src={playlist.images?.[0]?.url || "fallback-image-url"} // Fallback image if no image available
                      alt={playlist.name}
                      className="rounded-md w-full h-48 object-cover"
                    />
                    {/* Playlist Title */}
                    <h3 className="text-lg font-semibold mt-2">
                      {playlist.name}
                    </h3>
                    {/* Playlist Description */}
                    <p className="text-gray-300 flex-grow">
                      {playlist.description || "No description available."}
                    </p>
                    {/* Spotify Link Button */}
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 p-2 rounded-lg hover:bg-green-600 mt-3 inline-block self-end"
                    >
                      Open on Spotify
                    </a>
                  </div>
                ))
            ) : (
              <p>No playlists available</p>
            )}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={resetEmotionDetection}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enter Emotion Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
