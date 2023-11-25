import { getSampleFilePath } from "../utils/sampleLoadingUtils";

const { default: PARAM_DEFAULTS } = require("../data/paramDefaults");

export default class DrumMachine {
  playbackRate = 1;
  static PARAM_DEFAULTS = {
    slot0: "kickSample",
    slot1: "snareSample",
    slot2: "hiHatSample",
    slot3: "hiHatClosedSample",
  };

  num_sequences = 4;
  param_keys = ["kick", "snare", "hiHat", "hiHatClosed"];

  sampleBuffers = new Map();
  //  {
  //     kickSample: null,
  //     snareSample: null,
  //     hiHatSample: null,
  //     hiHatClosedSample: null,
  //   }

  constructor(audioCtx, params = {}) {
    this.AC = audioCtx;

    this.params = {
      ...DrumMachine.PARAM_DEFAULTS,
      ...params,
    };
    console.log("calling setup");

    const backGroundWork = async () => {
      const slot1Buff = await this.setupSamples(this.params.slot1);
      const slot0Buff = await this.setupSamples(this.params.slot0);
      const slot2Buff = await this.setupSamples(this.params.slot2);
      const slot3Buff = await this.setupSamples(this.params.slot3);

      this.sampleBuffers.set(1, slot1Buff);
      this.sampleBuffers.set(0, slot0Buff);
      this.sampleBuffers.set(2, slot2Buff);
      this.sampleBuffers.set(3, slot3Buff);
    };
    backGroundWork();
  }

  async getFile(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.AC.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }
  async setupSamples(sample) {
    console.log(sample);
    const filePath = getSampleFilePath(sample);
    const buffer = await this.getFile(filePath);
    return buffer;
  }

  playSample(sample, time) {
    let playbackRate = 1;
    console.log(
      "playing sample",
      sample,
      this.sampleBuffers,
      this.sampleBuffers.get(sample)
    );
    const sampleSource = new AudioBufferSourceNode(this.AC, {
      buffer: this.sampleBuffers.get(sample),
      playbackRate,
    });
    sampleSource.connect(this.AC.destination);
    sampleSource.start(time);
    return sampleSource;
  }
}
