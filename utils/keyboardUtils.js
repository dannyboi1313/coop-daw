// keyboardUtils.js
const noteNames = [
    "B-7", "A#7", "A-7", "G#7", "G-7", "F#7", "F-7", "E-7", "D#7", "D-7", "C#7", "C-7",
    "B-6", "A#6", "A-6", "G#6", "G-6", "F#6", "F-6", "E-6", "D#6", "D-6", "C#6", "C-6",
    "B-5", "A#5", "A-5", "G#5", "G-5", "F#5", "F-5", "E-5", "D#5", "D-5", "C#5", "C-5",
    "B-4", "A#4", "A-4", "G#4", "G-4", "F#4", "F-4", "E-4", "D#4", "D-4", "C#4", "C-4",
    "B-3", "A#3", "A-3", "G#3", "G-3", "F#3", "F-3", "E-3", "D#3", "D-3", "C#3", "C-3",
    "B-2", "A#2", "A-2", "G#2", "G-2", "F#2", "F-2", "E-2", "D#2", "D-2", "C#2", "C-2"
  ]; //prettier-ignore

const NoteFrequencies = {
        "C-2": 65.41, "C#2": 69.30, "D-2": 73.42, "D#2": 77.78, "E-2": 82.41, "F-2": 87.31, 
        "F#2": 92.50, "G-2": 98.00, "G#2": 103.83, "A-2": 110.00, "A#2": 116.54, "B-2": 123.47, 
        "C-3": 130.81, "C#3": 138.59, "D-3": 146.83, "D#3": 155.56, "E-3": 164.81, "F-3": 174.61,
         "F#3": 185.00, "G-3": 196.00, "G#3": 207.65, "A-3": 220.00, "A#3": 233.08, "B-3": 246.94,
        "C-4": 261.63, "C#4": 277.18, "D-4": 293.66, "D#4": 311.13, "E-4": 329.63, "F-4": 349.23,
         "F#4": 369.99, "G-4": 392.00, "G#4": 415.30, "A-4": 440.00, "A#4": 466.16, "B-4": 493.88,
        "C-5": 523.25, "C#5": 554.37, "D-5": 587.33, "D#5": 622.25, "E-5": 659.26, "F-5": 698.46,
         "F#5": 739.99, "G-5": 783.99, "G#5": 830.61, "A-5": 880.00, "A#5": 932.33, "B-5": 987.77,
        "C-6": 1046.50, "C#6": 1108.73, "D-6": 1174.66, "D#6": 1244.51, "E-6": 1318.51, "F-6": 1396.91,
         "F#6": 1479.98, "G-6": 1567.98, "G#6": 1661.22, "A-6": 1760.00, "A#6": 1864.66, "B-6": 1975.53,
        "C-7": 2093.00, "C#7": 2217.46, "D-7": 2349.32, "D#7": 2489.02, "E-7": 2637.02, "F-7": 2793.83,
         "F#7": 2959.96, "G-7": 3135.96, "G#7": 3322.44, "A-7": 3520.00, "A#7": 3729.31, "B-7": 3951.07
      }; //prettier-ignore
// Utility function to map row to key name
export const mapRowToKey = (key) => {
  if (key >= 0 && key < noteNames.length) {
    return noteNames[key];
  } else {
    throw new Error("Invalid key value");
  }
};

// Utility function to get the frequency of a note by its name
export const getNoteFrequency = (noteName) => {
  if (NoteFrequencies.hasOwnProperty(noteName)) {
    return NoteFrequencies[noteName];
  } else {
    throw new Error("Invalid note name");
  }
};

// Utility function to get all notes
export const getAllNotes = () => {
  return notes;
};

// Utility function to get the count of notes
export const getNoteCount = () => {
  return notes.length;
};
