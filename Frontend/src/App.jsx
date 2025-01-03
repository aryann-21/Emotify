import React from "react";
import WebcamCapture from "./components/WebcamCapture";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-4">
          Emotion-Based Playlist Curator
        </h1>
        <p className="text-center mb-8">
          Detect your emotions in real-time and get curated music recommendations.
        </p>
        <WebcamCapture />
      </div>
    </div>
  );
};

export default App;
