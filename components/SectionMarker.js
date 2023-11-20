import styles from "@/styles/Home.module.css";
import { useState } from "react";
import SynthPlayer from "./instruments/SynthPlayer";

const SectionMarker = ({ section, updateInstrument, timer }) => {
  const [displayEditor, setDisplayEditor] = useState(false);

  const instrument = section.instrument;
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
        gridColumn: `${section.startTime} / span ${section.instrument.getSectionLength()}`, //prettier-ignore
      }}
      onDoubleClick={handleDoubleClick}
    >
      Your Content {section.instrument.getSectionLength()}
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
