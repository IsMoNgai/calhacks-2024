"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
export default function Controls() {
  const { connect, disconnect, readyState } = useVoice();

  if (readyState === VoiceReadyState.OPEN) {
    return (
      <button  className="bg-pink-700 p-4 text-xl rounded hover:bg-pink-800" 
        onClick={() => {
          disconnect();
        }}
      >
        End Session
      </button>
    );
  }

  return (
    <button className="bg-pink-700 p-4  text-xl rounded hover:bg-pink-800" 
      onClick={() => {
        connect()
          .then(() => {
            /* handle success */
          })
          .catch(() => {
            /* handle error */
          });
      }}
    >
      Start Session
    </button>
  );
}