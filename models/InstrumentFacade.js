export default class InstrumentFacade {
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
  getId = () => {
    return this.instrumentId;
  };

  setId = (id) => {
    this.instrumentId = id;
  };
  getSectionLength = () => {
    return this.sectionLength;
  };
}
