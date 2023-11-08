const Key = () => {
  const pressKey = (freq) => {
    const osc = actx.createOscillator();
    osc.type = currentWaveform;
    osc.frequency.value = freq;
    osc.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 2);
  };
  const releaseKey = (freq) => {
    osc.stop();
  };
  return <div></div>;
};

///////////

// // Step sequencer (singleton)
// const sequencerTimer = (() => {

//   let NUM_STEPS = 16;
//   let NUM_BEATS = 4;

//   let READ_AHEAD_TIME = 0.005; // time in s
//   let UPDATE_INTERVAL = 10; // time in ms

//   let tempo = 120;
//   let stepDuration = (60 / tempo) / NUM_BEATS; // 16 steps/bar

//   let playStartTime = 0;
//   let nextStepTime = 0;
//   let currentStepIndex = 0;
//   let isPlaying = false;

//   let ti;
//   let stepCallbacks = [];

//   // Advance the 'playhead' in the sequence (w/ looping)
//   const nextStep = () => {
//     if (!isPlaying) return false;

//     currentStepIndex++;
//     if(currentStepIndex === NUM_STEPS) currentStepIndex = 0;
//     nextStepTime += stepDuration;
//   };

//   // Schedule callbacks to fire for every step within
//   // the current 'window', and check again in a moment
//   const update = () => {
//     while(nextStepTime < Synth.AC.currentTime + READ_AHEAD_TIME) {
//       stepCallbacks.forEach((cb) => cb(currentStepIndex, nextStepTime));
//       nextStep();
//     }

//     ti = setTimeout(() => {
//       update();
//     }, UPDATE_INTERVAL);
//   };

//   const registerStepCallback = (callback) => {
//     stepCallbacks.push(callback);
//   };

//   const unregisterStepCallback = (callback) => {
//     stepCallbacks = stepCallbacks.filter((cb) => cb !== callback);
//   };

//   const start = () => {
//     if (isPlaying) return;

//     isPlaying = true;

//     currentStepIndex = 0;
//     nextStepTime = Synth.AC.currentTime;

//     update();
//   };

//   const stop = () => {
//     isPlaying = false;
//     clearTimeout(ti);
//   };

//   return {
//     start,
//     stop,
//     registerStepCallback,
//     unregisterStepCallback
//   };

// })();

// /** UI **/

// const { createContext, useContext, useState, useEffect, useReducer, useRef } = React;

// const initialSequencerState = {
//   isEditing: false,
//   isPlaying: false,
//   selectedStepIndex: null,
//   playingStepIndex: null
// };

// const Actions = [
//   'SET_PLAY_STATE',
//   'SET_EDIT_MODE',
//   'SET_SELECTED_STEP',
//   'SET_PLAYING_STEP',
//   'GO_TO_NEXT_STEP'
// ].reduce((obj, action) => {
//   obj[action] = action;
//   return obj;
// }, {});

// const ActionCreators = {
//   setPlayState: (isPlaying) => ({
//     type: Actions.SET_PLAY_STATE,
//     isPlaying
//   }),
//   setEditMode: (isEditing) => ({
//     type: Actions.SET_EDIT_MODE,
//     isEditing
//   }),
//   setSelectedStep: (selectedStepIndex) => ({
//     type: Actions.SET_SELECTED_STEP,
//     selectedStepIndex
//   }),
//   setPlayingStep: (playingStepIndex) => ({
//     type: Actions.SET_PLAYING_STEP,
//     playingStepIndex
//   }),
//   goToNextStep: () => ({
//     type: Actions.GO_TO_NEXT_STEP
//   })
// };

// const sequencerReducer = (state = initialSequencerState, action = {}) => {
//   switch(action.type) {
//     case Actions.SET_PLAY_STATE: {
//       const { isPlaying } = action;
//       return {
//         ...state,
//         isPlaying,
//         playingStepIndex: isPlaying ? state.playingStepIndex: null
//       };
//     };

//     case Actions.SET_EDIT_MODE: {
//       const { isEditing } = action;
//       return {
//         ...state,
//         isEditing,
//         selectedStepIndex: isEditing ? 0 : null
//       };
//     };

//     case Actions.SET_SELECTED_STEP: {
//       if (!state.isEditing) return state;

//       const { selectedStepIndex } = action;
//       return {
//         ...state,
//         selectedStepIndex
//       };
//     }

//     case Actions.SET_PLAYING_STEP: {
//       const { playingStepIndex } = action;
//       return {
//         ...state,
//         playingStepIndex
//       };
//     }

//     case Actions.GO_TO_NEXT_STEP: {
//       if (state.selectedStepIndex === 15) {
//         return {
//           ...state,
//           selectedStepIndex: null,
//           isEditing: false
//         };
//       }

//       return {
//         ...state,
//         selectedStepIndex: state.selectedStepIndex + 1
//       };
//     }

//     default: {
//       return state;
//     }
//   }
// };

// const SynthContext = createContext(null);
// const useSynth = () => useContext(SynthContext);

// const useSynthParam = (param) => {
//   const synth = useSynth();
//   const [val, setVal] = useState(synth.params[param]);

//   const updateParam = (e) => {
//     const v = Number(e.target.value);
//     setVal(v);
//     synth.setParam(param, v);
//   };

//   return [val, updateParam];
// };

// const SequencerStateContext = createContext(null);
// const SequencerStateProvider = ({ children }) => {
//   const reducer = useReducer(sequencerReducer, initialSequencerState);

//   return (
//     <SequencerStateContext.Provider value={reducer}>
//       {children}
//     </SequencerStateContext.Provider>
//   );
// };
// const useSequencerState = () => useContext(SequencerStateContext);

// const ControlGroup = ({ label, children }) => (
//   <fieldset>
//     <legend>{label}</legend>
//     {children}
//   </fieldset>
// );

// const GenericSlider = ({ label, belowLabel, ...options }) => {
//   return (
//     <label className="generic-slider">
//       {label && <span class="sidelabel">{label}</span>}
//       <div>
//         <input type="range" min="0" max="1" step="0.01" {...options} />
//         {belowLabel && <span class="sublabel">{belowLabel}</span>}
//       </div>
//     </label>
//   );
// };

// const PotSlider = ({ param, label, belowLabel }) => {
//   const [val, setVal] = useSynthParam(param);

//   return (
//     <GenericSlider label={label} value={val} onInput={setVal} />
//   );
// };

// const SwitchSlider = ({ param, label, belowLabels }) => {
//   const [val, setVal] = useSynthParam(param);

//   return (
//     <GenericSlider
//       label={label}
//       belowLabel={belowLabels.join(' - ')}
//       value={val}
//       max={belowLabels.length - 1}
//       step={1}
//       onInput={setVal}
//     />
//   )
// };

// const KeyboardController = ({ notes }) => {
//   const synth = useSynth();
//   const [state, dispatch] = useSequencerState();

//   const pressKey = (note) => {
//     synth.noteOn(NOTES[note]);
//     if (state.isEditing) {
//       synth.sequence[state.selectedStepIndex] = note;
//       dispatch(ActionCreators.goToNextStep());
//     }
//   };

//   const renderKeys = () => notes.map((note) => {
//     let cn = note[1] === '#' ? 'sharp' : '';
//     cn += (synth.sequence[state.playingStepIndex] === note && state.isPlaying) ? ' active' : '';
//     cn += (synth.sequence[state.selectedStepIndex] === note && state.isEditing) ? ' editing' : '';

//     return (
//       <button
//         key={note}
//         className={cn}
//         onMouseDown={() => pressKey(note)}
//         onMouseUp={synth.noteOff}
//       >
//         <span>{note}</span>
//       </button>
//     );
//   });

//   return (
//     <div className="keyboard">
//       {renderKeys()}
//     </div>
//   );
// };

// KeyboardController.defaultProps = {
//   notes: ['C-3','C#3','D-3','D#3','E-3','F-3','F#3','G-3','G#3','A-3','A#3','B-3','C-4']
// };

// const ActionButton = ({ label, className = null, onClick = () => {} }) => {
//   const synth = useSynth();

//   return (
//     <button
//       className={`button-link action-button ${className}`}
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );
// };

// const PlayButton = () => {
//   const [state, dispatch] = useSequencerState();
//   const synth = useSynth();

//   const seqCallback = (stepIndex) => {
//     console.log('seqCallback', stepIndex);
//     dispatch(ActionCreators.setPlayingStep(stepIndex))
//   };

//   const startSequencer = () => {
//     synth.isPlaying ? synth.stop() : synth.play(seqCallback);
//     dispatch(ActionCreators.setPlayState(synth.isPlaying));
//   };

//   const cn = `play${state.isPlaying ? ' active' : ''}`

//   return (
//     <ActionButton label="Play/Stop" className={cn} onClick={startSequencer} />
//   );
// };

// const EditButton = () => {
//   const [state, dispatch] = useSequencerState();

//   const toggleEdit = () => {
//     dispatch(ActionCreators.setEditMode(!state.isEditing));
//   };

//   const cn = `edit${state.isEditing ? ' active' : ''}`

//   return (
//     <ActionButton label="Edit" className={cn} onClick={toggleEdit} />
//   );
// };

// const RestButton = () => {
//   const [state, dispatch] = useSequencerState();
//   const synth = useSynth();

//   const addRest = () => {
//     if (state.isEditing) {
//       const n = synth.sequence[state.selectedStepIndex];
//       synth.sequence[state.selectedStepIndex] = (n === 'xxx') ? null : 'xxx';
//       dispatch(ActionCreators.goToNextStep());
//     }
//   };

//   return (
//     <ActionButton label="Rest" onClick={addRest} />
//   )
// };

// const ClearButton = () => {
//   const [state, dispatch] = useSequencerState();
//   const synth = useSynth();

//   return (
//     <ActionButton label="Clear" className="clear" />
//   );
// };

// const Sequencer = () => {
//   const [state, dispatch] = useSequencerState();

//   const selectStep = (idx) => {
//     dispatch(ActionCreators.setSelectedStep(idx));
//   };

//   const renderSteps = (from, to) => {
//     const st = [];
//     for (let i = from; i < to; i++) {
//       let cn = 'sequencer-step' + (i % 4 === 0 ? ' bar' : '');
//       cn += (state.playingStepIndex === i) ? ' playing' : '';
//       cn += (state.selectedStepIndex === i) ? ' editing' : '';

//       st.push(
//         <button
//           key={i}
//           className={cn}
//           onClick={() => selectStep(i)}
//         >
//           {(i % 4 === 0 ? i / 4 : i % 4) + 1}
//         </button>
//       );
//     }
//     return st;
//   };

//   return (
//     <div className="sequencer">
//       <div className="sequencer-row">
//         {renderSteps(0, 8)}
//       </div>
//       <div className="sequencer-row">
//         {renderSteps(8, 16)}
//       </div>
//     </div>
//   );
// };

// const Visualizer = () => {
//   const synth = useSynth();
//   const canvasRef = useRef(null)

//   useEffect(() => {
//     const ctx = canvasRef.current.getContext('2d');
//     const cw = canvasRef.current.width;
//     const ch = canvasRef.current.height;
//     const chh = Math.round(ch * 0.5);
//     ctx.fillStyle = 'red';
//     ctx.strokeStyle = 'red';

//     let canDraw = true;

//     const draw = () => {
//       try {
//         if (canDraw) requestAnimationFrame(draw);
//         ctx.clearRect(0,0,cw,ch);
//         const data = synth.getAnalyserData();

//         ctx.beginPath();
//         ctx.moveTo(0, chh);
//         for(let i = 0, ln = data.length; i < ln; i++) {;
//           ctx.lineTo(i, ch * (data[i] / 255));
//         }
//         ctx.stroke();
//       } catch (e) {
//         console.log('Ooops', e);
//         canDraw = false;
//       }
//     };

//     draw();
//   }, []);

//   return (
//     <canvas className="visualizer" width="128" height="45" ref={canvasRef} />
//   );
// };

// const SynthUI = ({ synth, label, keyboardNotes }) => (
//   <SequencerStateProvider>
// <SynthContext.Provider value={synth}>
//   <section>
//     <h4>JS-2020{label && <span>&nbsp;- {label}</span>}</h4>

//     <div className="row">
//       <div className="col">
//         <ControlGroup label="Master">
//           <PotSlider param="volume" label="Vol" />
//         </ControlGroup>

//         <ControlGroup label="Voicing">
//           <SwitchSlider param="waveform" label="WAV" belowLabels={Synth.TYPES_ABBR} />
//           <PotSlider param="unisonWidth" label="WID" />
//         </ControlGroup>
//       </div>

//       <ControlGroup label="ADSR">
//         <SwitchSlider param="adsrTarget" label="TGT" belowLabels={Synth.ADSR_TARGETS} />
//         <PotSlider param="adsrAttack" label="ATK" />
//         <PotSlider param="adsrDecay" label="DEC" />
//         <PotSlider param="adsrSustain" label="SUS" />
//         <PotSlider param="adsrRelease" label="REL" />
//       </ControlGroup>

//       <div className="col">
//         <ControlGroup label="Filter">
//           <PotSlider param="filterFreq" label="FRQ" />
//           <PotSlider param="filterQ" label="Q" />
//         </ControlGroup>

//         <ControlGroup label="Echo FX">
//           <PotSlider param="echoTime" label="TIM" />
//           <PotSlider param="echoFeedback" label="FBK" />
//         </ControlGroup>
//       </div>
//     </div>

//     <div className="row">
//       <ControlGroup label="Sequencer">
//         <div className="row">
//           <div className="row sequencer-controls">
//             <div className="col">
//               <PlayButton />
//               <ClearButton />
//             </div>
//             <div className="col">
//               <EditButton />
//               <RestButton />
//             </div>
//           </div>
//           <Sequencer />
//         </div>
//       </ControlGroup>
//     </div>

//     <div className="row">
//       <KeyboardController notes={keyboardNotes} />
//       <ControlGroup label="Visualizer">
//         <Visualizer />
//       </ControlGroup>
//     </div>
//   </section>
// </SynthContext.Provider>
//   </SequencerStateProvider>
// );

// const App = () => {
//   const synth = new Synth();
//   // const synth = new Synth({
//   //   waveform: 1,
//   //   unisonWidth: 0.6,
//   //   adsrTarget: 1,
//   //   adsrAttack: 0.05,
//   //   adsrDecay: 0.05,
//   //   adsrSustain: 0.1,
//   //   adsrRelease: 0.2,
//   //   filterFreq: 0.3,
//   //   filterQ: 0.6
//   // });

//   return (
//     <div id="demo" className="slide-basic">
//       <SynthUI synth={synth} />
//     </div>
//   );
// };
