import styles from "@/styles/NoteGrid.module.css";
import { useState } from "react";
import Grid from "./Grid";

const NoteGrid = ({
  notes,
  updateNotes,
  timer,
  handleClose,
  isOpen = true,
  toggleModule,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: "50rem", height: "40rem" });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPosition({
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExpand = () => {
    setSize({
      width: "100%",
      height: "80vh",
    });
    setPosition({ x: 0, y: 0 });
  };

  const handleMinimize = () => {
    setSize({ width: "50rem", height: "50rem" });
  };
  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      className={styles.notePage}
      style={{
        width: size.width,
        height: size.height,
        overflow: "hidden",
        zIndex: "3",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px",
          background: "#eee",
        }}
      >
        <button onClick={toggleModule}>
          {isOpen ? "Close Module" : "Open Module"}
        </button>
        <button onClick={handleMinimize}>Minimize</button>
        <button onClick={handleExpand}>Expand</button>
        <button onClick={handleClose}>Close</button>
      </div>

      {/* Content of the open module */}
      <div className={styles.gridContent}>
        <Grid instrumentNotes={notes} updateNotes={updateNotes} timer={timer} />
      </div>
      {/* Add more content as needed */}
    </div>
  );
};
export default NoteGrid;
