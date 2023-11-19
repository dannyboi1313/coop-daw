import NoteGrid from "../NoteGrid";

const SynthPlayer = ({ notes, updateNotes, timer }) => {
  return <NoteGrid notes={notes} updateNotes={updateNotes} timer={timer} />;
};
export default SynthPlayer;
