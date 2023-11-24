import DrumMachine from "../classes/DrumMachine";
import InstrumentFacade from "./InstrumentFacade";

export default class DrumFacade extends InstrumentFacade {
  type = "drums";
  constructor(audioctx, id) {
    super(audioctx, id);
    console.log("Creating new drum machine.");
    this.drumMachine = new DrumMachine(audioctx);
    this.name = "Synth " + id;
  }

  updateEvents = (notes, size) => {
    console.log("UPDATING EVENTS CALLED");
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
