import { getSampleFilePath } from "../utils/sampleLoadingUtils";

const { default: PARAM_DEFAULTS } = require("../data/paramDefaults");

export default class DrumMachine {
  playbackRate = 1;
  static PARAM_DEFAULTS = {
    kickSample: "kickSample",
    snareSample: "snareSample",
    hiHatSample: "hiHatSample",
    hiHatClosedSample: "hiHatClosedSample",
  };

  num_sequences = 4;
  param_keys = [
    "kickSample",
    "snareSample",
    "hiHatSample",
    "hiHatClosedSample",
  ];

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
      const snareBuff = await this.setupSamples(this.params.snareSample);
      const kickBuff = await this.setupSamples(this.params.kickSample);
      const hhBuff = await this.setupSamples(this.params.hiHatSample);
      const hhCBuff = await this.setupSamples(this.params.hiHatClosedSample);

      this.sampleBuffers.set(this.params.snareSample, snareBuff);
      this.sampleBuffers.set(this.params.kickSample, kickBuff);
      this.sampleBuffers.set(this.params.hiHatSample, hhBuff);
      this.sampleBuffers.set(this.params.hiHatClosedSample, hhCBuff);
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
    console.log("playing sample", sample, this.sampleBuffers.get(sample));
    const sampleSource = new AudioBufferSourceNode(this.AC, {
      buffer: this.sampleBuffers.get(sample),
      playbackRate,
    });
    sampleSource.connect(this.AC.destination);
    sampleSource.start(time);
    return sampleSource;
  }
}
