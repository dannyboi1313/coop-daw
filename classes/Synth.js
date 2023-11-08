// Synth class
import sequencerTimer from "./Sequencer";

class Synth {
  static TYPES = ["sine", "square", "triangle", "sawtooth"];
  static TYPES_ABBR = ["sin", "squ", "tri", "saw"];
  static ADSR_TARGETS = ["adsr", "filter"];

  static MAX_UNISON_WIDTH = 30;
  static MAX_ADSR_STAGE_DURATION = 2;
  static MAX_ECHO_DURATION = 2;
  static MIN_FILTER_FREQ = 40;
  static MAX_FILTER_Q = 30;

  static PARAM_DEFAULTS = {
    unisonWidth: 0.2,
    volume: 0.3,
    adsrAttack: 0.2,
    adsrDecay: 0,
    adsrSustain: 1,
    adsrRelease: 0.2,
    adsrTarget: 0,
    filterFreq: 0.5,
    filterQ: 0.2,
    echoTime: 0,
    echoFeedback: 0,
    waveform: 3,
  };

  constructor(AC, params = {}) {
    Synth.AC = AC;

    console.log("New Synth", Synth.AC.currentTime);

    this.oscillators = new Array(3);

    this.params = {
      ...Synth.PARAM_DEFAULTS,
      ...params,
    };

    this.nodes = {};

    this.nodes.volume = Synth.AC.createGain();
    this.setParam("volume");

    this.nodes.adsr = Synth.AC.createGain();

    this.nodes.filter = Synth.AC.createBiquadFilter();
    this.nodes.filter.type = "lowpass";
    this.setParam("filterFreq");
    this.setParam("filterQ");

    this.nodes.delay = Synth.AC.createDelay(Synth.MAX_ECHO_DURATION);
    this.nodes.feedback = Synth.AC.createGain();
    this.setParam("echoTime");
    this.setParam("echoFeedback");

    this.nodes.compressor = Synth.AC.createDynamicsCompressor();

    this.nodes.analyser = Synth.AC.createAnalyser();
    this.nodes.analyser.smoothingTimeConstant = 0.5;
    this.nodes.analyser.fftSize = 256;
    this.analyserBufferLength = this.nodes.analyser.frequencyBinCount;
    this.analyserData = new Uint8Array(this.analyserBufferLength);

    this.nodes.adsr.connect(this.nodes.filter);
    this.nodes.filter.connect(this.nodes.delay);
    this.nodes.delay.connect(this.nodes.feedback);
    this.nodes.feedback.connect(this.nodes.delay);

    this.nodes.filter.connect(this.nodes.volume);
    this.nodes.feedback.connect(this.nodes.volume);

    this.nodes.volume.connect(this.nodes.compressor);
    this.nodes.compressor.connect(this.nodes.analyser);
    this.nodes.analyser.connect(Synth.AC.destination);

    this.sequence = [
      "C-3",
      "D#3",
      "G-3",
      "C-3",

      "D-3",
      "D#3",
      "C-3",
      "D-3",

      "D#3",
      "C-3",
      "D#3",
      "G#3",

      "C-3",
      "G-3",
      "C-3",
      "G-3",
    ];
    this.isPlaying = false;
  }

  getAnalyserData = () => {
    this.nodes.analyser.getByteTimeDomainData(this.analyserData);
    return this.analyserData;
  };

  setParam = (param, value = this.params[param]) => {
    if (param && param in this.params) this.params[param] = value;

    switch (param) {
      case "volume":
        this.nodes.volume.gain.value = value;
        break;
      case "filterFreq":
        this.nodes.filter.frequency.value = this.calcFreqValue(value);
        break;
      case "filterQ":
        this.nodes.filter.Q.value = value * Synth.MAX_FILTER_Q;
        break;
      case "echoTime":
        this.nodes.delay.delayTime.value = value * Synth.MAX_ECHO_DURATION;
        break;
      case "echoFeedback":
        this.nodes.feedback.gain.value = value;
        break;
      case "unisonWidth":
        const width = this.getUnisonWidth(value);
        this.oscillators[1].detune.value = -width;
        this.oscillators[2].detune.value = width;
        break;
      default:
        break;
    }
  };

  getUnisonWidth = (amt) => amt * Synth.MAX_UNISON_WIDTH;

  calcFreqValue = (amt) =>
    Math.max(Synth.MIN_FILTER_FREQ, amt * (Synth.AC.sampleRate / 2));

  getADSRTarget = () => {
    const tgtName = Synth.ADSR_TARGETS[this.params.adsrTarget];
    switch (tgtName) {
      case "filter": {
        return this.nodes.filter.frequency;
      }
      case "adsr":
      default: {
        return this.nodes.adsr.gain;
      }
    }
  };

  getADSRValue = (val) => {
    const tgtName = Synth.ADSR_TARGETS[this.params.adsrTarget];
    switch (tgtName) {
      case "filter": {
        const tgt = this.calcFreqValue(val);
        const max = this.calcFreqValue(this.params.filterFreq);
        return Math.min(tgt, max);
      }
      case "adsr":
      default: {
        return val;
      }
    }
  };

  noteOn = (freq, t = 0) => {
    Synth.AC.resume();

    this.killOscillators(t);

    const ct = Synth.AC.currentTime;

    const adsrTarget = this.getADSRTarget();

    if (this.params.adsrTarget !== 0) {
      this.nodes.adsr.gain.setValueAtTime(1, ct);
    }
    if (this.params.adsrTarget !== 1) {
      this.nodes.filter.frequency.setValueAtTime(
        this.calcFreqValue(this.params.filterFreq),
        ct
      );
    }

    const atkDuration = this.params.adsrAttack * Synth.MAX_ADSR_STAGE_DURATION;
    adsrTarget.setValueAtTime(this.getADSRValue(0), ct);
    adsrTarget.linearRampToValueAtTime(this.getADSRValue(1), ct + atkDuration);

    const decayDuration = this.params.adsrDecay * Synth.MAX_ADSR_STAGE_DURATION;
    adsrTarget.setTargetAtTime(
      this.getADSRValue(this.params.adsrSustain),
      ct + atkDuration,
      decayDuration
    );

    const width = this.getUnisonWidth(this.params.unisonWidth);

    this.oscillators[0] = this.createOscillator(freq, this.params.waveform);
    this.oscillators[1] = this.createOscillator(
      freq,
      this.params.waveform,
      -width
    );
    this.oscillators[2] = this.createOscillator(
      freq,
      this.params.waveform,
      width
    );

    this.oscillators.forEach((osc) => osc.start(t));
  };

  noteOff = (t = 0) => {
    const ct = Synth.AC.currentTime;

    const relDuration = this.params.adsrRelease * Synth.MAX_ADSR_STAGE_DURATION;
    this.killOscillators(ct + relDuration);

    const adsrTarget = this.getADSRTarget();
    adsrTarget.setValueAtTime(adsrTarget.value, ct);
    adsrTarget.linearRampToValueAtTime(this.getADSRValue(0), ct + relDuration);
  };

  killOscillators = (t = 0) => {
    this.nodes.adsr.gain.cancelScheduledValues(t);
    this.nodes.filter.frequency.cancelScheduledValues(t);
    this.oscillators.forEach((osc) => {
      if (osc) osc.stop(t);
    });
  };

  createOscillator = (freq, waveform, detune = 0) => {
    const osc = Synth.AC.createOscillator();
    osc.type = Synth.TYPES[waveform];
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(this.nodes.adsr);
    return osc;
  };

  timePlus = (secs) => {
    return Synth.AC.currentTime + secs;
  };

  onStep = (stepIndex, stepStartTime) => {
    const note = this.sequence[stepIndex];

    if (note) {
      if (note === "xxx") {
        this.noteOff(stepStartTime);
      } else {
        this.noteOn(NOTES[note], stepStartTime);
      }
    }

    if (this.stepCallback) this.stepCallback(stepIndex);
  };

  play = (stepCallback) => {
    this.stepCallback = stepCallback;

    sequencerTimer.registerStepCallback(this.onStep);
    this.isPlaying = true;
    sequencerTimer.start();
  };

  stop = () => {
    this.isPlaying = false;
    sequencerTimer.stop();
    sequencerTimer.unregisterStepCallback(this.onStep);
    this.noteOff();
  };
}

export default Synth;
