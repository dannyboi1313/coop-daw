import DrumMachine from "../classes/DrumMachine";
import InstrumentFacade from "./InstrumentFacade";

export default class DrumFacade extends InstrumentFacade {
  type = "drum";
  constructor(audioctx, id) {
    super(audioctx, id);
    console.log("Creating new drum machine.");
    this.drumMachine = new DrumMachine(audioctx);
    this.name = "Drum " + id;
    this.events = [
      [{ type: "trigger", note: "kick", instrumentId: this.instrumentId }],
      [],
      [],
      [],
      [],
      [],
      [{ type: "trigger", note: "snare", instrumentId: this.instrumentId }],
    ];
    this.notes = new Map();
    this.notes.set(1, { row: 2, col: 0 });
    this.notes.set(2, { row: 3, col: 15 });
  }

  updateEvents = (notes, size) => {
    console.log("UPDATING EVENTS CALLED");
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
