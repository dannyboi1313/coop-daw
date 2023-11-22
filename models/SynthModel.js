import Player from "../classes/Player";
import { mapRowToKey } from "../utils/keyboardUtils";
export default class SynthModel {
  synth = null;
  name = "Test1";
  events = [[], [], [], []];
  notes = new Map([]);
  sectionLength = 16;
  instrumentId = null;

  constructor(audioctx, id) {
    this.synth = new Player(audioctx);
    this.instrumentId = id;
    this.name = "Synth " + id;
  }
  getNotes = () => {
    return this.notes;
  };
  getEventList = () => {
    return this.events;
  };

  setId = (id) => {
    this.instrumentId = id;
  };

  updateEvents = (notes, size) => {
    console.log("UPDATING EVENTS CALLED");
    this.name = "Updated Name";
    let currMax = 4;
    this.events = [...Array(size)].map((e) => Array());
    for (let i; i < size; i++) {
      this.events[i] = new Array();
    }
    for (let note of notes.values()) {
      this.notes.set(note.id, note);
      const key = mapRowToKey(note.row);
      this.events[note.start].push({ type: "noteOn", note: key });
      this.events[note.end].push({ type: "noteOff", note: key });
      if (note.end > currMax) {
        currMax = note.end + 1;
      }
    }
    this.sectionLength = currMax;

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
    console.log("Command sent.. trying to turn off");
    this.synth.allNotesOff();
    this.events.forEach((event) => {
      event.forEach((e) => {
        if (e.type == "noteOff") {
          this.handleEvent(e);
        }
      });
    });
  }
}
