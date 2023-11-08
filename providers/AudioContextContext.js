// AudioContextContext.js
import React from "react";

const AudioContextContext = React.createContext();

export const AudioContextProvider = ({ children, audioContext }) => {
  return (
    <AudioContextContext.Provider value={audioContext}>
      {children}
    </AudioContextContext.Provider>
  );
};

export const useAudioContext = () => {
  return React.useContext(AudioContextContext);
};
