export default class InstrumentFacade {
  name = "Test1";
  //events = [[], [], [], []];
  // events = [[],[1,2,3,4],[1,3],[],[],[2,1,3,2,1,12,3,1,2,3,1,23,2,],[]]
  events = new Map();
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
