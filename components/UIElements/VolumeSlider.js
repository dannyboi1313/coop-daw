// components/VolumeSlider.js
import { useState } from "react";
import styles from "../../src/styles/UIElements.module.css"; // You can create a CSS module for styling

const VolumeSlider = () => {
  const [volume, setVolume] = useState(50); // Initial volume value

  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setVolume(newVolume);
    // You can use the 'newVolume' value in your application to control the actual volume
  };

  return (
    <div className={styles.volumeSlider}>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className={styles.sliderInput}
      />
    </div>
  );
};

export default VolumeSlider;
