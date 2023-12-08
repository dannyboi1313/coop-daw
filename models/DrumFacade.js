import DrumMachine from "../classes/DrumMachine";
import InstrumentFacade from "./InstrumentFacade";

export default class DrumFacade extends InstrumentFacade {
  type = "drum";
  constructor(audioctx, id) {
    super(audioctx, id);
    console.log("Creating new drum machine.");
    this.drumMachine = new DrumMachine(audioctx);
    this.name = "Drum " + id;
  }

  updateEvents = (pads, size) => {
    console.log("UPDATING drum CALLED", pads);
    this.events = [...Array(size)].map((e) => Array());
    for (let i; i < size; i++) {
      this.events[i] = new Array();
    }
    for (let pad of pads.values()) {
      this.notes.set(pad.id, pad);
      console.log("adding pads", pad);
      this.events[pad.start].push({
        type: "trigger",
        note: pad.row,
        instrumentId: this.instrumentId,
      });
    }
    console.log("After", this.notes);
    //this.sectionLength = currMax;

    return this;
  };

  addNote = (newNote) => {
    console.log("Adding note", newNote, "Events", this.events);
    this.notes.set(newNote.id, newNote);
    //const key = mapRowToKey(newNote.row);

    if (this.events.has(newNote.start)) {
      const currArr = this.events.get(newNote.start);
      console.log("Not First time at time t", currArr);
      currArr.push({
        type: "trigger",
        id: newNote.id,
        note: newNote.row,
        instrumentId: this.instrumentId,
      });
      this.events.set(newNote.start, currArr);
    } else {
      console.log("First time at time t");
      this.events.set(newNote.start, [
        {
          type: "trigger",
          id: newNote.id,
          note: newNote.row,
          instrumentId: this.instrumentId,
        },
      ]);
    }

    console.log("Aftermath ", this.events);
    return this;
  };

  deleteNote = (note) => {
    console.log("deleting", note);
    const currStartArr = this.events.get(note.start);
    console.log("BEFORE DELETION", currStartArr);
    const updatedStartArr = currStartArr.filter((curr) => {
      return curr.id !== note.id;
    });
    console.log("AFTER DELTION", updatedStartArr);
    this.events.set(note.start, updatedStartArr);
    this.notes.delete(note.id);
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
  stopAllNotes() {}
}
