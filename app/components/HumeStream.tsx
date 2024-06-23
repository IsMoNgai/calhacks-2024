// page.tsx
'use client'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import LiveChart from './LiveChart';

const socket = io('http://localhost:5000');

export default function HumeStream() {
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(document.createElement('canvas'));
  const intervalRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);
  const [concentrationMetrics, setConcentrationMetrics] = useState<number[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('adhd_emotions', (data: { Concentration: number }) => {
      console.log('ADHD emotions:', data);
      setConcentrationMetrics(prevMetrics => [...prevMetrics, data.Concentration].slice(-60)); // Keep only the last 60 minutes of data
    });

    socket.on('error', (error: any) => {
      console.error('Error:', error);
    });

    startVideoStream();

    return () => {
      socket.off('connect');
      socket.off('adhd_emotions');
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
      }, 10000); // Capture snapshot every minute
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
    <div className=''>
        {/* className="p-4" */}
        {/* className="text-xl font-bold mb-4" */}
      {/* <h1 >Live Image Streaming</h1> */}
      <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
      {/* <div className=" rounded-lg bg-white shadow-md p-4"> */}
        <div className="">
          <LiveChart data={concentrationMetrics} />
        </div>
      {/* </div> */}
    </div>
  );
}
