// page.tsx
'use client'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';
import LiveChart from './LiveChart';
import Modal from './Modal';

const socket = io('http://localhost:5000');

export default function HumeStream() {
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(document.createElement('canvas'));
  const intervalRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);
  const [concentrationMetrics, setConcentrationMetrics] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('adhd_emotions', (data: { Concentration: number; Boredom: number; Anxiety: number; Tiredness: number }) => {
      console.log('ADHD emotions:', data);
      setConcentrationMetrics(prevMetrics => [...prevMetrics, data.Concentration].slice(-60)); // Keep only the last 60 minutes of data
      if (data.Boredom > 0.48 ) {
        setIsModalOpen(true); // Open the modal if Boredom is greater than 0.68
      }
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

  const closeModal = () => setIsModalOpen(false); // Function to close the modal


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
        <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-4xl pb-8 tracking-wide font-semibold">High Boredom Alert!</h1>
        <h2 className='text-xl pb-4'>You seem like you need some assistance. Consider taking a break or letting me help you!</h2>
      </Modal>
      {/* </div> */}
    </div>
  );
}


export function useHumeStream() {
    const [metrics, setMetrics] = useState({ Concentration: 0, Boredom: 0, Anxiety: 0, Tiredness: 0 });
    const socket = useMemo(() => io('http://localhost:5000'), []);
  
    useEffect(() => {
      socket.on('connect', () => console.log('Connected to server'));
  
      socket.on('adhd_emotions', (data) => {
        console.log('ADHD emotions:', data);
        setMetrics(data);
      });
  
      socket.on('error', (error) => console.error('Error:', error));
  
      return () => {
        socket.off('connect');
        socket.off('adhd_emotions');
        socket.off('error');
      };
    }, [socket]);
  
    return metrics;
  }