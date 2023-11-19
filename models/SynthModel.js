import Player from "../classes/Player";
import Synth from "../classes/Synth";
import NOTES from "../data/notes";

export default class SynthModel {
  synth = null;
  name = "Test1";
  events = [[], [], [], []];
  notes = new Map([]);

  constructor(audioctx) {
    this.synth = new Player(audioctx);
  }
  getNotes = () => {
    return this.notes;
  };
  getEventList = () => {
    return this.events;
  };

  updateEvents = (notes, size) => {
    console.log("UPDATING EVENTS CALLED");
    this.name = "Updated Name";
    this.events = [...Array(size)].map((e) => Array());
    for (let i; i < size; i++) {
      this.events[i] = new Array();
    }
    for (let note of notes.values()) {
      this.notes.set(note.id, note);
      const key = this.mapRowToKey(note.row);
      this.events[note.start].push({ type: "noteOn", note: key });
      this.events[note.end].push({ type: "noteOff", note: key });
    }
    return this;
  };

  //   "C-3": 261.63,
  //   "C#3": 277.18,
  //   "D-3": 293.66,
  //   "D#3": 311.13,
  //   "E-3": 329.63,
  //   "F-3": 349.23,
  //   "F#3": 369.99,
  //   "G-3": 392.0,
  //   "G#3": 415.3,
  //   "A-3": 440.0,
  //   "A#3": 466.16,
  //   "B-3": 493.88,
  //   "C-4": 523.25,
  mapRowToKey = (key) => {
    switch (key) {
      case 0:
        return "C-3";
      case 1:
        return "C#3";
      case 2:
        return "D-3";
      case 3:
        return "D#3";
      case 4:
        return "E-3";
      case 5:
        return "F-3";
      case 6:
        return "F#3";
      case 7:
        return "G-3";
      case 8:
        return "G#3";
      case 9:
        return "A-3";
      case 10:
        return "A#3";
      case 11:
        return "B-3";
      default:
        return "C-4";
    }
  };

  handleEvent = (event, time = 0) => {
    switch (event.type) {
      case "noteOn":
        this.synth.noteOn(event.note, time);
        break;
      case "noteOff":
        this.synth.noteOff(event.note, time);
        break;
      default:
        break;
    }
  };
  stopAllNotes() {
    this.events.forEach((event) => {
      event.forEach((e) => {
        if (e.type == "noteOff") {
          this.handleEvent(e);
        }
      });
    });
  }
}
