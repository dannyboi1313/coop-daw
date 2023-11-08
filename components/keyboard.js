import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
  useRef,
} from "react";
import Synth from "../classes/Synth";
import ControlGroup from "./ControlGroup";
import NOTES from "../data/notes";
import PotSlider from "./UIElements/PotSlider";
import SwitchSlider from "./UIElements/SwitchSlider";
import { useAudioContext } from "../providers/AudioContextContext";

const Keyboard = () => {
  const [currentWaveform, setCurrentWaveform] = useState("sawtooth");
  //const [synth, setSynth] = useState(null);
  const synth = new Synth(useAudioContext());

  const handleWaveChange = (wave) => {
    setCurrentWaveform(wave);
  };

  const releaseKey = () => {
    synth.noteOff();
  };

  const SynthContext = createContext(null);
  const useSynth = () => useContext(SynthContext);

  const useSynthParam = (param) => {
    const synth = useSynth();
    if (!synth) return [0, null];
    const [val, setVal] = useState(synth.params[param]);

    const updateParam = (e) => {
      const v = Number(e.target.value);
      setVal(v);
      synth.setParam(param, v);
    };

    return [val, updateParam];
  };

  const KeyboardController = ({ notes }) => {
    const synth = useSynth();

    const pressKey = (note) => {
      synth.noteOn(NOTES[note]);
    };

    const renderKeys = () =>
      notes.map((note) => {
        let cn = note[1] === "#" ? "key sharp" : "key";

        return (
          <button
            className={cn}
            key={note}
            onMouseDown={() => {
              pressKey(note);
            }}
            onMouseUp={() => {
              releaseKey();
            }}
          >
            {note}
          </button>
        );
      });

    return <div className="keyboard">{renderKeys()}</div>;
  };

  const notes = [
    "C-3",
    "C#3",
    "D-3",
    "D#3",
    "E-3",
    "F-3",
    "F#3",
    "G-3",
    "G#3",
    "A-3",
    "A#3",
    "B-3",
    "C-4",
  ];
  return (
    <div>
      <h1>Simple Keyboard</h1>

      <SynthContext.Provider value={synth}>
        <section>
          <h4>Testing</h4>

          <div className="row">
            <div className="col">
              <ControlGroup label="Master">
                <PotSlider
                  param="volume"
                  label="Vol"
                  useSynthParam={useSynthParam}
                />
              </ControlGroup>

              <ControlGroup label="Voicing">
                <SwitchSlider
                  param="waveform"
                  label="WAV"
                  belowLabels={Synth.TYPES_ABBR}
                  useSynthParam={useSynthParam}
                />
                <PotSlider
                  param="unisonWidth"
                  label="WID"
                  useSynthParam={useSynthParam}
                />
              </ControlGroup>
            </div>

            <ControlGroup label="ADSR">
              <SwitchSlider
                param="adsrTarget"
                label="TGT"
                belowLabels={Synth.ADSR_TARGETS}
                useSynthParam={useSynthParam}
              />
              <PotSlider
                param="adsrAttack"
                label="ATK"
                useSynthParam={useSynthParam}
              />
              <PotSlider
                param="adsrDecay"
                label="DEC"
                useSynthParam={useSynthParam}
              />
              <PotSlider
                param="adsrSustain"
                label="SUS"
                useSynthParam={useSynthParam}
              />
              <PotSlider
                param="adsrRelease"
                label="REL"
                useSynthParam={useSynthParam}
              />
            </ControlGroup>

            <div className="col">
              <ControlGroup label="Filter">
                <PotSlider
                  param="filterFreq"
                  label="FRQ"
                  useSynthParam={useSynthParam}
                />
                <PotSlider
                  param="filterQ"
                  label="Q"
                  useSynthParam={useSynthParam}
                />
              </ControlGroup>

              <ControlGroup label="Echo FX">
                <PotSlider
                  param="echoTime"
                  label="TIM"
                  useSynthParam={useSynthParam}
                />
                <PotSlider
                  param="echoFeedback"
                  label="FBK"
                  useSynthParam={useSynthParam}
                />
              </ControlGroup>
            </div>
          </div>
          {/* 
          <div className="row">
            <ControlGroup label="Sequencer">
              <div className="row">
                <div className="row sequencer-controls">
                  <div className="col">
                    <PlayButton />
                    <ClearButton />
                  </div>
                  <div className="col">
                    <EditButton />
                    <RestButton />
                  </div>
                </div>
                <Sequencer />
              </div>
            </ControlGroup>
          </div> */}

          <div className="row">
            <KeyboardController notes={notes} />
            {/* <ControlGroup label="Visualizer">
              <Visualizer />
            </ControlGroup> */}
          </div>
        </section>
      </SynthContext.Provider>
    </div>
  );
};

export default Keyboard;
