const filePaths = {
  kickSample: "/sounds/Bass-Drum-1.wav",
  snareSample: "/sounds/metronome.wav",
  hiHatSample: "/sounds/Bass-Drum-1.wav",
  hiHatClosedSample: "/sounds/Bass-Drum-1.wav",
};

export const getSampleFilePath = (sample) => {
  return filePaths[sample];
};
