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

  handleEvent = (event, time = 0) => {
    switch (event.type) {
      case "trigger":
        console.log("triggered");
        this.drumMachine.playSample(event.note, time);
        break;
      default:
        break;
    }
  };
  stopAllNotes() {}
}
