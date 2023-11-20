// Synth class
import { getNoteFrequency } from "../utils/keyboardUtils";

const effectsSettings = {
  // Oscillator Wave Types
  oscillatorWaveTypes: ["Sine", "Sawtooth", "Triangle", "Square"], // Defined by WebMIDI API
  filterTypes: [
    "Lowpass",
    "Highpass",
    "Bandpass",
    "Lowshelf",
    "Highshelf",
    "Peaking",
    "Notch",
    "Allpass",
  ],

  // VCO
  VCOTypeDefault: "Sine", // From oscillatorWaveTypes options

  // VCA
  VCAGainDefault: 0.03,
  VCAGainMin: 0,
  VCAGainMax: 0.1,

  //LFO
  LFOTypeDefault: "Sine", // From oscillatorWaveTypes options
  LFOFrequencyDefault: 1, // Range: 0 - 22050
  LFOFrequencyMin: 0,
  LFOFrequencyMax: 10,
  LFOGainDefault: 0.01,
  LFOGainMin: 0,
  LFOGainMax: 100.05,
  LFOPatchDefault: "Cutoff", // 'Cutoff', 'VCA', 'VCO'

  // VCF
  VCFTypeDefault: "Lowpass", // Lowpass, Highpass, Bandpass, Lowshelf, Highshelf, Peaking, Notch, Allpass

  VCFQDefault: 0,
  VCFQMin: -3.4,
  VCFQMax: 3.4,

  VCFFrequencyDefault: 2500, // 0 - 24000
  VCFFrequencyMin: 0,
  VCFFrequencyMax: 3000,

  VCFGainDefault: 0,
  VCFGainMin: -3.4,
  VCFGainMax: 50,

  // Output
  outputGainDefault: 3,
  outputGainMin: 0,
  outputGainMax: 3,
};
class Player {
  static TYPES = ["sine", "square", "triangle", "sawtooth"];
  static TYPES_ABBR = ["sin", "squ", "tri", "saw"];
  static ADSR_TARGETS = ["adsr", "filter"];

  static MAX_UNISON_WIDTH = 30;
  static MAX_ADSR_STAGE_DURATION = 2;
  static MAX_ECHO_DURATION = 2;
  static MIN_FILTER_FREQ = 40;
  static MAX_FILTER_Q = 30;

  static PARAM_DEFAULTS = {
    unisonWidth: 0.1, // Adjust to a lower value for less detuning
    volume: 0.5, // Increase for a louder sound
    adsrAttack: 0.1, // Shorten the attack for a quicker onset
    adsrDecay: 0.1, // Introduce a slight decay for natural-sounding notes
    adsrSustain: 0.8, // Lower the sustain level slightly for a smoother decay
    adsrRelease: 0.2, // Maintain a short release for crisp note endings
    adsrTarget: 0, // Ensure the ADSR target is set to the amplitude
    filterFreq: 0.4, // Adjust the filter frequency for a smoother sound
    filterQ: 0.1, // Lower the filter Q value for a less resonant sound
    echoTime: 0, // Disable the echo effect for now
    echoFeedback: 0, // Disable the echo feedback for now
    waveform: 3,
  };

  constructor(AC, params = {}) {
    Player.AC = AC;

    this.activeNotes = new Map();
    //this.oscillators = new Array(3);

    this.params = {
      ...Player.PARAM_DEFAULTS,
      ...params,
    };
  }

  getUnisonWidth = (amt) => amt * Player.MAX_UNISON_WIDTH;

  calcFreqValue = (amt) =>
    Math.max(Player.MIN_FILTER_FREQ, amt * (Player.AC.sampleRate / 2));

  getADSRTarget = (nodes) => {
    const tgtName = Player.ADSR_TARGETS[this.params.adsrTarget];
    switch (tgtName) {
      case "filter": {
        return nodes.filter.frequency;
      }
      case "adsr":
      default: {
        return nodes.adsr.gain;
      }
    }
  };

  getADSRValue = (val) => {
    const tgtName = Player.ADSR_TARGETS[this.params.adsrTarget];
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

  playNote = (freq, t = 0, duration = 1) => {
    Player.AC.resume();

    let nodes = {};

    nodes.volume = Player.AC.createGain();
    nodes.volume.gain.value = this.params["volume"];

    nodes.adsr = Player.AC.createGain();

    nodes.filter = Player.AC.createBiquadFilter();
    nodes.filter.type = "lowpass";
    nodes.filter.frequency.value = this.calcFreqValue(
      this.params["filterFreq"]
    );
    nodes.filter.Q.value = this.params["filterQ"] * Player.MAX_FILTER_Q;

    nodes.delay = Player.AC.createDelay(Player.MAX_ECHO_DURATION);
    nodes.feedback = Player.AC.createGain();
    nodes.delay.delayTime.value =
      this.params["echoTime"] * Player.MAX_ECHO_DURATION;
    nodes.feedback.gain.value = this.params["echoFeedback"];
    nodes.compressor = Player.AC.createDynamicsCompressor();

    nodes.analyser = Player.AC.createAnalyser();
    nodes.analyser.smoothingTimeConstant = 0.5;
    nodes.analyser.fftSize = 256;

    nodes.adsr.connect(nodes.filter);
    nodes.filter.connect(nodes.delay);
    nodes.delay.connect(nodes.feedback);
    nodes.feedback.connect(nodes.delay);

    nodes.filter.connect(nodes.volume);
    nodes.feedback.connect(nodes.volume);

    nodes.volume.connect(nodes.compressor);
    nodes.compressor.connect(nodes.analyser);
    nodes.analyser.connect(Player.AC.destination);

    const ct = t;

    const adsrTarget = this.getADSRTarget(nodes);

    if (this.params.adsrTarget !== 0) {
      nodes.adsr.gain.setValueAtTime(1, ct);
    }
    if (this.params.adsrTarget !== 1) {
      nodes.filter.frequency.setValueAtTime(
        this.calcFreqValue(this.params.filterFreq),
        ct
      );
    }

    const atkDuration = this.params.adsrAttack * Player.MAX_ADSR_STAGE_DURATION;
    adsrTarget.setValueAtTime(this.getADSRValue(0), ct);
    adsrTarget.linearRampToValueAtTime(this.getADSRValue(1), ct + atkDuration);

    const decayDuration =
      this.params.adsrDecay * Player.MAX_ADSR_STAGE_DURATION;
    adsrTarget.setTargetAtTime(
      this.getADSRValue(this.params.adsrSustain),
      ct + atkDuration,
      decayDuration
    );

    const width = this.getUnisonWidth(this.params.unisonWidth);
    const oscillators = new Array(3);
    oscillators[0] = this.createOscillator(nodes, freq, this.params.waveform);
    oscillators[1] = this.createOscillator(
      nodes,
      freq,
      this.params.waveform,
      -width
    );
    oscillators[2] = this.createOscillator(
      nodes,
      freq,
      this.params.waveform,
      width
    );

    oscillators.forEach((osc) => osc.start(t));

    const relDuration =
      this.params.adsrRelease * Player.MAX_ADSR_STAGE_DURATION;
    const et = ct + duration;
    this.killOscillators(nodes, oscillators, et + relDuration);

    adsrTarget.setValueAtTime(adsrTarget.value, et);
    adsrTarget.linearRampToValueAtTime(this.getADSRValue(0), et + relDuration);
  };

  noteOn = (note, t = 0) => {
    Player.AC.resume();
    const freq = getNoteFrequency(note);

    if (this.activeNotes.get(note)) {
      this.noteOff(note, Player.AC.currentTime);
    }

    let nodes = {};

    nodes.volume = Player.AC.createGain();
    nodes.volume.gain.value = this.params["volume"];

    nodes.adsr = Player.AC.createGain();

    nodes.filter = Player.AC.createBiquadFilter();
    nodes.filter.type = "lowpass";
    nodes.filter.frequency.value = this.calcFreqValue(
      this.params["filterFreq"]
    );
    nodes.filter.Q.value = this.params["filterQ"] * Player.MAX_FILTER_Q;

    nodes.delay = Player.AC.createDelay(Player.MAX_ECHO_DURATION);
    nodes.feedback = Player.AC.createGain();
    nodes.delay.delayTime.value =
      this.params["echoTime"] * Player.MAX_ECHO_DURATION;
    nodes.feedback.gain.value = this.params["echoFeedback"];
    nodes.compressor = Player.AC.createDynamicsCompressor();

    nodes.analyser = Player.AC.createAnalyser();
    nodes.analyser.smoothingTimeConstant = 0.5;
    nodes.analyser.fftSize = 256;

    nodes.adsr.connect(nodes.filter);
    nodes.filter.connect(nodes.delay);
    nodes.delay.connect(nodes.feedback);
    nodes.feedback.connect(nodes.delay);

    nodes.filter.connect(nodes.volume);
    nodes.feedback.connect(nodes.volume);

    nodes.volume.connect(nodes.compressor);
    nodes.compressor.connect(nodes.analyser);
    nodes.analyser.connect(Player.AC.destination);

    const ct = t;

    const adsrTarget = this.getADSRTarget(nodes);

    if (this.params.adsrTarget !== 0) {
      nodes.adsr.gain.setValueAtTime(1, ct);
    }
    if (this.params.adsrTarget !== 1) {
      nodes.filter.frequency.setValueAtTime(
        this.calcFreqValue(this.params.filterFreq),
        ct
      );
    }

    const atkDuration = this.params.adsrAttack * Player.MAX_ADSR_STAGE_DURATION;
    adsrTarget.setValueAtTime(this.getADSRValue(0), ct);
    adsrTarget.linearRampToValueAtTime(this.getADSRValue(1), ct + atkDuration);

    const decayDuration =
      this.params.adsrDecay * Player.MAX_ADSR_STAGE_DURATION;
    adsrTarget.setTargetAtTime(
      this.getADSRValue(this.params.adsrSustain),
      ct + atkDuration,
      decayDuration
    );

    const width = this.getUnisonWidth(this.params.unisonWidth);
    const oscillators = new Array(3);
    oscillators[0] = this.createOscillator(nodes, freq, this.params.waveform);
    oscillators[1] = this.createOscillator(
      nodes,
      freq,
      this.params.waveform,
      -width
    );
    oscillators[2] = this.createOscillator(
      nodes,
      freq,
      this.params.waveform,
      width
    );

    oscillators.forEach((osc) => osc.start(t));

    this.activeNotes.set(note, {
      oscillators: oscillators,
      nodes: nodes,
      adsrTarget: adsrTarget,
    });
  };
  noteOff = (note, t = 0) => {
    const currNote = this.activeNotes.get(note);
    if (currNote == null) return;
    const nodes = currNote.nodes;
    const oscillators = currNote.oscillators;
    const adsrTarget = currNote.adsrTarget;
    const relDuration =
      this.params.adsrRelease * Player.MAX_ADSR_STAGE_DURATION;

    this.killOscillators(nodes, oscillators, t + relDuration);

    adsrTarget.setValueAtTime(adsrTarget.value, t);
    adsrTarget.linearRampToValueAtTime(this.getADSRValue(0), t + relDuration);
  };

  killOscillators = (nodes, oscillators, t = 0) => {
    nodes.adsr.gain.cancelScheduledValues(t);
    nodes.filter.frequency.cancelScheduledValues(t);
    oscillators.forEach((osc) => {
      if (osc) osc.stop(t);
    });
  };

  createOscillator = (nodes, freq, waveform, detune = 0) => {
    const osc = Player.AC.createOscillator();
    osc.type = Player.TYPES[waveform];
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(nodes.adsr);
    return osc;
  };

  allNotesOff = () => {
    console.log("command Recieved, active notes", this.activeNotes.keys());
    for (const key of this.activeNotes.keys()) {
      console.log("Key:", key);
      this.noteOff(key, Player.AC.currentTime);
    }
  };
}

export default Player;
