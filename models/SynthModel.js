import Player from "../classes/Player";
import { mapRowToKey } from "../utils/keyboardUtils";
export default class SynthModel {
  synth = null;
  name = "Test1";
  events = [[], [], [], []];
  notes = new Map([]);
  sectionLength = 4;

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
      const key = mapRowToKey(note.row);
      this.events[note.start].push({ type: "noteOn", note: key });
      this.events[note.end].push({ type: "noteOff", note: key });
      if (note.end > this.sectionLength) {
        this.sectionLength = note.end + 1;
      }
    }

    return this;
  };

  getSectionLength = () => {
    return this.sectionLength;
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
