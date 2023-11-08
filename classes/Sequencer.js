import Synth from "./Synth";
const sequencerTimer = (() => {
  let NUM_STEPS = 16;
  let NUM_BEATS = 4;

  let READ_AHEAD_TIME = 0.005; // time in s
  let UPDATE_INTERVAL = 10; // time in ms

  let tempo = 120;
  let stepDuration = 60 / tempo / NUM_BEATS; // 16 steps/bar

  let playStartTime = 0;
  let nextStepTime = 0;
  let currentStepIndex = 0;
  let isPlaying = false;

  let ti;
  let stepCallbacks = [];

  // Advance the 'playhead' in the sequence (w/ looping)
  const nextStep = () => {
    if (!isPlaying) return false;

    currentStepIndex++;
    if (currentStepIndex === NUM_STEPS) currentStepIndex = 0;
    nextStepTime += stepDuration;
  };

  // Schedule callbacks to fire for every step within
  // the current 'window', and check again in a moment
  const update = () => {
    while (nextStepTime < Synth.AC.currentTime + READ_AHEAD_TIME) {
      stepCallbacks.forEach((cb) => cb(currentStepIndex, nextStepTime));
      nextStep();
    }

    ti = setTimeout(() => {
      update();
    }, UPDATE_INTERVAL);
  };

  const registerStepCallback = (callback) => {
    stepCallbacks.push(callback);
  };

  const unregisterStepCallback = (callback) => {
    stepCallbacks = stepCallbacks.filter((cb) => cb !== callback);
  };

  const start = () => {
    if (isPlaying) return;

    isPlaying = true;

    currentStepIndex = 0;
    nextStepTime = Synth.AC.currentTime;

    update();
  };

  const stop = () => {
    isPlaying = false;
    clearTimeout(ti);
  };

  return {
    start,
    stop,
    registerStepCallback,
    unregisterStepCallback,
  };
})();

export default sequencerTimer;
