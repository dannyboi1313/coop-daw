const filePaths = {
  kickSample: "/sounds/Bass-Drum-1.wav",
  snareSample: "/sounds/metronome.wav",
  hiHatSample: "/sounds/Bass-Drum-1.wav",
  hiHatClosedSample: "/sounds/Bass-Drum-1.wav",
};

export const getSampleFilePath = (sample) => {
  return filePaths[sample];
};

export const mapRowToSampleName = (row) => {
  switch (row) {
    case 0:
      return "hiHatClosed";
    case 1:
      return "hitHat";
    case 2:
      return "snare";
    case 3:
      return "kick";
    default:
      break;
  }
};
