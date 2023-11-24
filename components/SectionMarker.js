import styles from "@/styles/Home.module.css";
import { useState } from "react";
import SynthPlayer from "./editors/SynthEditor";

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
      case "synth":
        return (
          <SynthPlayer
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

  const getColorClass = () => {
    switch (section.color) {
      case "blue":
        return styles.blueMarker;
      case "pink":
        return styles.pinkMarker;
      default:
        return "";
    }
  };
  return (
    <div
      className={`${styles.sectionMarker} ${getColorClass()} ${
        selected && styles.selected
      }`}
      style={{
        gridColumn: `${section.startTime + 1} / span ${instrument.getSectionLength()}`, //prettier-ignore
      }}
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
      {displayEditor && renderEditor()}
    </div>
  );
};

export default SectionMarker;
