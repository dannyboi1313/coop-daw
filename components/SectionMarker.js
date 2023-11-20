import styles from "@/styles/Home.module.css";
import { useState } from "react";
import SynthPlayer from "./instruments/SynthPlayer";

const SectionMarker = ({ section, instrument, updateInstrument, timer }) => {
  const [displayEditor, setDisplayEditor] = useState(false);
  const handleDoubleClick = () => {
    setDisplayEditor(true);
  };
  const handleCloseEditor = () => {
    setDisplayEditor(false);
  };
  return (
    <div
      className={styles.sectionMarker}
      style={{
        gridColumn: `${section.startTime} / span ${instrument.getSectionLength() *2}`, //prettier-ignore
      }}
      onDoubleClick={handleDoubleClick}
    >
      Your Content {instrument.getSectionLength()}
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
