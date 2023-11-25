const filePaths = {
  kickSample: "/sounds/kick_drum.wav",
  snareSample: "/sounds/snare.wav",
  hiHatSample: "/sounds/hitHatOpen.wav",
  hiHatClosedSample: "/sounds/hitHatClosed.wav",
};

export const getSampleFilePath = (sample) => {
  return filePaths[sample];
};

export const mapRowToSampleName = (row) => {
  switch (row) {
    case 0:
      return "kick";
    case 1:
      return "snare";
    case 2:
      return "hiHat";
    case 3:
      return "hiHatClosed";
    default:
      break;
  }
};
