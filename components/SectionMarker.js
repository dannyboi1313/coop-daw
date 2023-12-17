import styles from "@/styles/Home.module.css";
import { useState } from "react";
import SynthPlayer from "./editors/SynthEditor";
import DrumMachineEditor from "./editors/DrumMachineEditor";
import { getSolidColor, getTransparentColor } from "../utils/uiUtils";

const SectionMarker = ({
  section,
  instrument,
  updateInstrument,
  timer,
  selected,
  handleClick,
  handleSectionMouseDown,
  handleSectionRelease,
  handleDelete,
}) => {
  const [displayEditor, setDisplayEditor] = useState(false);
  const handleDoubleClick = (event) => {
    event.preventDefault();
    setDisplayEditor(true);
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleSectionMouseDown(e, section.sectionId);
  };
  const handleMouseUp = (e) => {
    handleSectionRelease(section);
  };
  const handleCloseEditor = () => {
    setDisplayEditor(false);
  };

  const renderEditor = () => {
    switch (instrument.type) {
      case "synth":
        return (
          <SynthPlayer
            instrument={instrument}
            updateNotes={updateInstrument}
            timer={timer}
            closeEditor={handleCloseEditor}
          />
        );
      case "drum":
        return (
          <DrumMachineEditor
            instrument={instrument}
            updateNotes={updateInstrument}
            timer={timer}
            closeEditor={handleCloseEditor}
          />
        );
      default:
        break;
    }
  };

  return (
    <div
      className={`${styles.sectionMarker} } ${selected && styles.selected}`}
      style={{
        gridColumn: `${section.startTime + 1} / span ${instrument.getSectionLength()}`, //prettier-ignore
      }}
    >
      <div
        className={`${styles.hitBox}`}
        style={{ backgroundColor: `${getTransparentColor(section.color)}` }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={() => {
          handleClick(section.sectionId);
        }}
        onDoubleClick={(event) => {
          handleDoubleClick(event);
        }}
        onContextMenu={() => {
          if (!displayEditor) {
            handleDelete(section.sectionId);
          }
        }}
      >
        <div
          className={`${styles.sectionOverlay}`}
          style={{
            background: `linear-gradient(90deg, ${getSolidColor(
              section.color
            )} 15%, rgba(192, 85, 119, 0) 95%)`,
          }}
        >
          <div className={styles.sectionOverlayIndicator}></div>
          <h4>{instrument.name}</h4>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {displayEditor && renderEditor()}
      </div>
    </div>
  );
};

export default SectionMarker;
