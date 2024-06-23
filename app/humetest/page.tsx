'use client';

import React, { useEffect, useRef, MutableRefObject } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Home() {
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(document.createElement('canvas'));
  const intervalRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('image_processed', (data: any) => {
      console.log('Image processed:', data);
      // Handle the processed image data
    });

    socket.on('error', (error: any) => {
      console.error('Error:', error);
    });

    startVideoStream();

    return () => {
      socket.off('connect');
      socket.off('image_processed');
      socket.off('error');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      intervalRef.current = setInterval(() => {
        captureSnapshot();
      }, 5000); // Capture snapshot every 5 seconds
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
        socket.emit('image_chunk', { image: base64Image });
      }
    }
  };

  return (
    <div>
      <h1>Live Image Streaming</h1>
      <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
    </div>
  );
}
