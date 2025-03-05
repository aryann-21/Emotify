"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as faceapi from "face-api.js"
import Webcam from "react-webcam"
import axios from "axios"

const decodeHtml = (html) => {
  if (!html) return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.documentElement.textContent || html
}

// Map emotions to more user-friendly names
const emotionMap = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  surprised: "Surprised",
  neutral: "Neutral",
  fear: "Anxious",
  disgusted: "Disgusted",
}

// Additional keywords to enhance playlist search
const enhancedSearchTerms = {
  happy: ["upbeat", "cheerful", "feel good", "happy"],
  sad: ["melancholy", "heartbreak", "sad", "emotional"],
  angry: ["intense", "rage", "metal", "angry"],
  surprised: ["epic", "dramatic", "surprising", "unexpected"],
  neutral: ["chill", "relaxing", "ambient", "neutral"],
  fear: ["calming", "peaceful", "meditation", "soothing"],
  disgusted: ["cleansing", "refreshing", "renewal", "fresh"],
}

const WebcamCapture = () => {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [emotion, setEmotion] = useState("")
  const [playlists, setPlaylists] = useState([])
  const [isVideoVisible, setIsVideoVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [modelsLoaded, setModelsLoaded] = useState(false)

  const loadModels = useCallback(async () => {
    try {
      setIsLoading(true)
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face")
      await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression")
      setModelsLoaded(true)
    } catch (err) {
      setError("Failed to load facial recognition models. Please refresh the page.")
      console.error("Error loading models:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const detectEmotions = useCallback(async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video
      const canvas = canvasRef.current
      const displaySize = { width: video.videoWidth, height: video.videoHeight }
      faceapi.matchDimensions(canvas, displaySize)

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        if (detections.length > 0) {
          const expressions = detections[0].expressions
          const dominantEmotion = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b))
          if (dominantEmotion !== emotion) {
            setEmotion(dominantEmotion)
          }
          return dominantEmotion
        }
        return null
      } catch (err) {
        console.error("Error detecting emotions:", err)
        setError("Error detecting emotions. Please try again.")
        return null
      }
    }
    return null
  }, [emotion])

  const fetchPlaylists = async (emotion) => {
    try {
      setIsLoading(true)
      setError("")
      const response = await axios.get(`https://emotify-backend.onrender.com/api/playlists/${emotion}`)
      setPlaylists(response.data.playlists || [])
    } catch (error) {
      console.error("Error fetching playlists:", error.message)
      setError("Failed to fetch playlists. Please try again.")
      setPlaylists([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmotionDetection = async () => {
    setIsLoading(true)
    const detectedEmotion = await detectEmotions()
    if (detectedEmotion) {
      setEmotion(detectedEmotion)
      setIsVideoVisible(false)
      await fetchPlaylists(detectedEmotion)
    } else {
      setError("No face detected. Please make sure your face is visible and try again.")
      setIsLoading(false)
    }
  }

  const resetEmotionDetection = () => {
    setEmotion("")
    setPlaylists([])
    setIsVideoVisible(true)
    setError("")
  }

  useEffect(() => {
    loadModels()
  }, [loadModels])

  useEffect(() => {
    if (isVideoVisible && modelsLoaded) {
      const interval = setInterval(() => {
        detectEmotions()
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isVideoVisible, modelsLoaded, detectEmotions])

  return (
    <div className="flex flex-col items-center w-full">
      {error && (
        <div className="w-full max-w-3xl mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center">
          <p className="text-red-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      {isVideoVisible ? (
        <div className="w-full max-w-3xl">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30 bg-black">
            {isLoading && !modelsLoaded ? (
              <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] lg:h-[480px]">
                <svg
                  className="animate-spin h-12 w-12 text-purple-400 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-300">Loading facial recognition models...</p>
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  className="w-full h-[300px] md:h-[400px] lg:h-[480px] object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              </>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleEmotionDetection}
              disabled={isLoading || !modelsLoaded}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Detect My Emotion
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-purple-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <h2 className="text-2xl md:text-3xl font-bold">{emotionMap[emotion] || emotion} Playlists</h2>
              </div>
              <button
                onClick={resetEmotionDetection}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-all flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg
                  className="animate-spin h-12 w-12 text-purple-400 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-300">Finding the perfect playlists for your mood...</p>
              </div>
            ) : (
              <>
                {playlists.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {playlists
                      .filter((playlist) => playlist && playlist.images && playlist.images.length > 0)
                      .map((playlist, index) => (
                        <div
                          key={index}
                          className="playlist-item bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 hover:border-purple-500/50 text-gray-100 rounded-lg shadow-lg transition-all overflow-hidden flex flex-col h-full group"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={playlist.images?.[0]?.url || "/placeholder.svg?height=200&width=200"}
                              alt={playlist.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                            <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="p-4 flex-grow flex flex-col">
                            <h3 className="text-lg font-semibold truncate mb-1">{playlist.name}</h3>
                            <p className="text-gray-400 text-sm overflow-hidden line-clamp-3 mb-3 flex-grow">
                              {decodeHtml(playlist.description) || "No description available."}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                              <div className="text-xs text-gray-400">{playlist.tracks?.total || 0} tracks</div>
                              <a
                                href={playlist.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 p-2 rounded-md text-white text-sm font-medium flex items-center transition-colors"
                              >
                                Open
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 ml-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-xl text-gray-300">No playlists found for this emotion</p>
                    <p className="text-gray-400 mt-2">Please try again or select a different emotion</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WebcamCapture

