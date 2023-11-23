import DrumMachine from "../classes/DrumMachine";
import InstrumentFacade from "./InstrumentFacade";

export default class DrumFacade extends InstrumentFacade {
  constructor(audioctx, id) {
    super(audioctx, id);
    console.log("Creating new drum machine.");
    this.drumMachine = new DrumMachine(audioctx);
    this.name = "Synth " + id;
  }

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

  handleEvent = (event, time = 0) => {
    switch (event.type) {
      case "trigger":
        this.drumMachine.playSample(event.note, time);
        break;
      default:
        break;
    }
  };
  stopAllNotes() {
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
