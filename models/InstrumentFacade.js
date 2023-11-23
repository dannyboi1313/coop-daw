export default class InstrumentFacade {
  synth = null;
  name = "Test1";
  events = [[], [], [], []];
  notes = new Map([]);
  sectionLength = 16;
  instrumentId = null;

  constructor(audioctx, id) {
    this.audioctx = audioctx;
    this.instrumentId = id;
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
  getSectionLength = () => {
    return this.sectionLength;
  };
}
