import Player from "../classes/Player";
import { mapRowToKey } from "../utils/keyboardUtils";
import InstrumentFacade from "./InstrumentFacade";

export default class SynthFacade extends InstrumentFacade {
  type = "synth";
  constructor(audioctx, id, name = "Synth") {
    super(audioctx, id);
    this.synth = new Player(audioctx);
    this.name = name;
  }

  // updateEvents = (notes, size) => {
  //   console.log("UPDATING EVENTS CALLED");
  //   this.name = "Updated Name";
  //   let currMax = 4;
  //   this.events = [...Array(size)].map((e) => Array());
  //   for (let i; i < size; i++) {
  //     this.events[i] = new Array();
  //   }
  //   for (let note of notes.values()) {
  //     this.notes.set(note.id, note);
  //     const key = mapRowToKey(note.row);
  //     this.events[note.start].push({
  //       type: "noteOn",
  //       note: key,
  //       instrumentId: this.instrumentId,
  //     });
  //     this.events[note.end].push({
  //       type: "noteOff",
  //       note: key,
  //       instrumentId: this.instrumentId,
  //     });
  //     if (note.end > currMax) {
  //       currMax = note.end + 1;
  //     }
  //   }
  //   this.sectionLength = currMax;

  //   return this;
  // };
  // updateEvents = (notes, size) => {
  //   console.log("UPDATING EVENTS CALLED");
  //   this.name = "Updated Name";
  //   let currMax = 4;

  //   //clear current events so we can use push
  //   this.events.clear();

  //   //iterate through each note in the instrument and add it to the events list with the time as its key
  //   //If it doesnt exits, create a new array with the note in it
  //   for (let note of notes.values()) {
  //     //update the note in notes
  //     this.notes.set(note.id, note);
  //     const key = mapRowToKey(note.row);

  //     this.events[note.start].push({
  //       type: "noteOn",
  //       note: key,
  //       instrumentId: this.instrumentId,
  //     });
  //     this.events[note.end].push({
  //       type: "noteOff",
  //       note: key,
  //       instrumentId: this.instrumentId,
  //     });
  //     if (note.end > currMax) {
  //       currMax = note.end + 1;
  //     }
  //   }
  //   this.sectionLength = currMax;

  //   return this;
  // };

  addNote = (newNote) => {
    console.log("Adding note", newNote, "Events", this.events);
    this.notes.set(newNote.id, newNote);
    const key = mapRowToKey(newNote.row);
    if (this.events.has(newNote.start)) {
      const currArr = this.events.get(newNote.start);
      console.log("Not First time at time t", currArr);
      currArr.push({
        type: "noteOn",
        id: newNote.id,
        note: key,
        instrumentId: this.instrumentId,
      });
      this.events.set(newNote.start, currArr);
    } else {
      console.log("First time at time t");
      this.events.set(newNote.start, [
        {
          type: "noteOn",
          id: newNote.id,
          note: key,
          instrumentId: this.instrumentId,
        },
      ]);
    }

    if (this.events.has(newNote.end)) {
      const currArr = this.events.get(newNote.end);
      console.log("note first for end", currArr);
      currArr.push({
        type: "noteOff",
        id: newNote.id,
        note: key,
        instrumentId: this.instrumentId,
      });
      this.events.set(newNote.end, currArr);
    } else {
      console.log("first tie seeing end");
      this.events.set(newNote.end, [
        {
          type: "noteOff",
          id: newNote.id,
          note: key,
          instrumentId: this.instrumentId,
        },
      ]);
    }
    if (newNote.end >= this.sectionLength) {
      this.sectionLength = newNote.end + 4;
    }
    console.log("Aftermath ", this.events, this.notes);
    return this;
  };
  deleteNote = (note) => {
    const currStartArr = this.events.get(note.start);
    const currEndArr = this.events.get(note.end);
    const updatedStartArr = currStartArr.filter((curr) => {
      return curr.id !== note.id;
    });
    const updatedEndArr = currEndArr.filter((curr) => {
      return curr.id !== note.id;
    });
    this.events.set(note.start, updatedStartArr);
    this.events.set(note.end, updatedEndArr);
    this.notes.delete(note.id);
    return this;
  };
  editNote = (noteToEdit) => {
    console.log("NOTES", this.notes, this.events);
    const oldNote = this.notes.get(noteToEdit.id);
    console.log("TRYING TO EDIT NOTES", noteToEdit, oldNote);
    try {
      console.log("CALLING DELETE");
      this.deleteNote(oldNote);
      console.log("CALLING ADD");
      this.addNote(noteToEdit);
    } catch (err) {
      console.log("WHAT THE HECK");
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
