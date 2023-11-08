// AudioContextProvider.js
import React, { useEffect, useState } from "react";
import { AudioContextProvider } from "./AudioContextContext";

const AudioContextProviderWrapper = ({ children }) => {
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newAudioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      setAudioContext(newAudioContext);
    }
  }, []);

  if (!audioContext) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <AudioContextProvider audioContext={audioContext}>
      {children}
    </AudioContextProvider>
  );
};

export default AudioContextProviderWrapper;
