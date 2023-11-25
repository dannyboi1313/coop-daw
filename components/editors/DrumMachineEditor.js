import styles from "@/styles/NoteGrid.module.css";
import { useState } from "react";
import NoteGrid from "../NoteGrid";
import Sequencer from "../Sequencer";

const DrumMachineEditor = ({ instrument, updateNotes, timer, closeEditor }) => {
  const instrumentID = instrument.getId();
  const notes = instrument.getNotes();
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
  const handleClose = () => {
    closeEditor();
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
  return (
    <div
      className={styles.notePage}
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
        <p>{instrumentID}</p>
        {/* <button onClick={handleMinimize}>Minimize</button>
        <button onClick={handleExpand}>Expand</button> */}
        <button onClick={handleClose}>Close</button>
      </div>

      {/* Content of the open module */}
      <div className={styles.gridContent}>
        <Sequencer
          instrumentNotes={notes}
          updateNotes={updateNotes}
          timer={timer}
          instrumentID={instrumentID}
        />
      </div>
      {/* Add more content as needed */}
    </div>
  );
};
export default DrumMachineEditor;
