import NoteGrid from "../NoteGrid";

const SynthPlayer = ({ instrument, updateNotes, timer, closeEditor }) => {
  return (
    <div style={{ zIndex: "3", position: "relative" }}>
      <NoteGrid
        notes={instrument.getNotes()}
        updateNotes={updateNotes}
        timer={timer}
        handleClose={closeEditor}
        instrumentID={instrument.instrumentId}
      />{" "}
    </div>
  );
};
export default SynthPlayer;
