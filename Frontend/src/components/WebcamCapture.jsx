import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [playlists, setPlaylists] = useState([]);

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
      const displaySize = { width: video.videoWidth, height: video.videoHeight };

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
      const response = await axios.get(`http://localhost:5000/api/playlists/${emotion}`);
      console.log("API Response:", response.data);
      setPlaylists(response.data.playlists || []); // Ensure fallback in case of no playlists
    } catch (error) {
      console.error("Error fetching playlists:", error.message);
    }
  };

  useEffect(() => {
    loadModels(); // Load models when component mounts
  }, []);

  useEffect(() => {
    // Run emotion detection at a set interval
    const interval = setInterval(() => {
      detectEmotions();
    }, 100);

    return () => clearInterval(interval); // Clear the interval when component unmounts
  }, []);

  useEffect(() => {
    if (emotion) {
      console.log("Detected emotion:", emotion);
      fetchPlaylists(emotion); // Fetch playlists when emotion changes
    }
  }, [emotion]);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          className="rounded-md"
          style={{ width: "720px", height: "480px" }}
          videoConstraints={{ width: 320, height: 240, facingMode: "user" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: "720px", height: "480px" }}
        />
      </div>
      <div className="playlists mt-4">
        <h2>Playlists for Emotion: {emotion || "Loading..."}</h2>
        {playlists && playlists.length > 0 ? (
          playlists
            .filter((playlist) => playlist && playlist.images && playlist.images.length > 0) // Ensure playlist and images are valid
            .map((playlist, index) => (
              <div key={index} className="playlist-item mb-4">
                <img
                  src={playlist.images?.[0]?.url || "fallback-image-url"} // Fallback image if no image available
                  alt={playlist.name}
                  className="rounded-md w-full h-48 object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">{playlist.name}</h3>
                <p>{playlist.description || "No description available."}</p>
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Open on Spotify
                </a>
              </div>
            ))
        ) : (
          <p>No playlists available</p>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
