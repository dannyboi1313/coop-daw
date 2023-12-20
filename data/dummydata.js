export const data = {
  projectName: "Project Name- Title",
  lastBeatToPlay: 64,
  sections: [
    { sectionId: 1, track: 1, startTime: 0, instrument: 1, color: "blue" },
    { sectionId: 2, track: 1, startTime: 16, instrument: 1, color: "blue" },
    { sectionId: 3, track: 2, startTime: 0, instrument: 2, color: "pink" },
  ],
  instruments: [
    {
      name: "Dummy 1",
      track: 1,
      type: "synth",
      notes: [
        { id: 1, note: { id: 1, row: 59, start: 0, end: 7 } },
        { id: 2, note: { id: 2, row: 54, start: 0, end: 7 } },
        { id: 3, note: { id: 3, row: 50, start: 0, end: 7 } },
      ],
      events: [
        {
          time: 0,
          notes: [
            {
              type: "noteOn",
              id: 1,
              note: "C-3",
              instrumentId: 1,
            },
            {
              type: "noteOn",
              id: 2,
              note: "F-3",
              instrumentId: 1,
            },
            {
              type: "noteOn",
              id: 2,
              note: "A-3",
              instrumentId: 1,
            },
          ],
        },
        {
          time: 7,
          notes: [
            {
              type: "noteOff",
              id: 1,
              note: "C-3",
              instrumentId: 1,
            },
            {
              type: "noteOff",
              id: 2,
              note: "F-3",
              instrumentId: 1,
            },
            {
              type: "noteOff",
              id: 3,
              note: "A-3",
              instrumentId: 1,
            },
          ],
        },
      ],
    },
    {
      name: "Dummy 2 - Drum",
      track: 2,
      type: "drums",
      notes: [],
    },
  ],
  tracks: [
    { id: 1, volumn: 80, sections: [1, 2], color: "blue" },
    { id: 3, volumn: 80, sections: [3], color: "pink" },
  ],
};
