import styles from "@/styles/Home.module.css";
import { useState } from "react";
import SynthPlayer from "./instruments/SynthPlayer";

const SectionMarker = ({
  section,
  instrument,
  updateInstrument,
  timer,
  selected,
  handleClick,
}) => {
  const [displayEditor, setDisplayEditor] = useState(false);
  const handleDoubleClick = (event) => {
    event.preventDefault();
    setDisplayEditor(true);
  };
  const preventHighlight = (e) => {
    e.preventDefault();
  };
  const handleCloseEditor = () => {
    setDisplayEditor(false);
  };
  return (
    <div
      className={`${styles.sectionMarker} ${selected && styles.selected}`}
      style={{
        gridColumn: `${section.startTime + 1} / span ${instrument.getSectionLength()}`, //prettier-ignore
      }}
      onMouseDown={preventHighlight}
      onClick={() => {
        handleClick(section.sectionId);
      }}
      onDoubleClick={(event) => {
        handleDoubleClick(event);
      }}
    >
      {displayEditor && (
        <SynthPlayer
          instrument={instrument}
          updateNotes={updateInstrument}
          timer={timer}
          closeEditor={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default SectionMarker;

{
  /* <div
  className={styles.sectionMarker}
  style={{
    gridColumn: `${currSection.startTime} / span ${currSection.instrument.getSectionLength()}`, //prettier-ignore
  }}
>
  Your Content {currSection.instrument.getSectionLength()}
</div>; */
}
