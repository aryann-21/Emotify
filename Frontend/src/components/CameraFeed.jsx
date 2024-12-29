import Webcam from 'react-webcam';

function CameraFeed({ onCapture }) {
  return (
    <div>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        onUserMediaError={(err) => console.error(err)}
        onUserMedia={() => console.log('Webcam enabled')}
      />
      <button onClick={onCapture}>Capture</button>
    </div>
  );
}

export default CameraFeed;
