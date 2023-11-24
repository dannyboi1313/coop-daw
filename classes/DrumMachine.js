import { getSampleFilePath } from "../utils/sampleLoadingUtils";

const { default: PARAM_DEFAULTS } = require("../data/paramDefaults");

export default class DrumMachine {
  playbackRate = 1;
  static PARAM_DEFAULTS = {
    kick: "kickSample",
    snare: "snareSample",
    hiHat: "hiHatSample",
    hiHatClosed: "hiHatClosedSample",
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
      const snareBuff = await this.setupSamples(this.params.snare);
      const kickBuff = await this.setupSamples(this.params.kick);
      const hhBuff = await this.setupSamples(this.params.hiHat);
      const hhCBuff = await this.setupSamples(this.params.hiHatClosed);

      this.sampleBuffers.set("snare", snareBuff);
      this.sampleBuffers.set("kick", kickBuff);
      this.sampleBuffers.set("hitHat", hhBuff);
      this.sampleBuffers.set("hiHatClosed", hhCBuff);
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
