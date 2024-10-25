import React, { useEffect, useRef, useState } from 'react';
import './Camera.css';

const WebcamDisplay = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access webcam');
      console.error('Error accessing webcam:', err);
    }
  };

  useEffect(() => {
    startWebcam();
    
    // Cleanup function to stop the webcam when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="webcam-container">
      {error ? (
        <div className="webcam-error">{error}</div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width={150}
          height={150}
          className="webcam-video"
        />
      )}
    </div>
  );
};

export default WebcamDisplay;