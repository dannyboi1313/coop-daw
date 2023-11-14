// const Key = () => {
//   const pressKey = (freq) => {
//     const osc = actx.createOscillator();
//     osc.type = currentWaveform;
//     osc.frequency.value = freq;
//     osc.connect(actx.destination);
//     osc.start();
//     osc.stop(actx.currentTime + 2);
//   };
//   const releaseKey = (freq) => {
//     osc.stop();
//   };
//   return <div></div>;
// };

// ///////////

// // // Step sequencer (singleton)
// // const sequencerTimer = (() => {

// //   let NUM_STEPS = 16;
// //   let NUM_BEATS = 4;

// //   let READ_AHEAD_TIME = 0.005; // time in s
// //   let UPDATE_INTERVAL = 10; // time in ms

// //   let tempo = 120;
// //   let stepDuration = (60 / tempo) / NUM_BEATS; // 16 steps/bar

// //   let playStartTime = 0;
// //   let nextStepTime = 0;
// //   let currentStepIndex = 0;
// //   let isPlaying = false;

// //   let ti;
// //   let stepCallbacks = [];

// //   // Advance the 'playhead' in the sequence (w/ looping)
// //   const nextStep = () => {
// //     if (!isPlaying) return false;

// //     currentStepIndex++;
// //     if(currentStepIndex === NUM_STEPS) currentStepIndex = 0;
// //     nextStepTime += stepDuration;
// //   };

// //   // Schedule callbacks to fire for every step within
// //   // the current 'window', and check again in a moment
// //   const update = () => {
// //     while(nextStepTime < Synth.AC.currentTime + READ_AHEAD_TIME) {
// //       stepCallbacks.forEach((cb) => cb(currentStepIndex, nextStepTime));
// //       nextStep();
// //     }

// //     ti = setTimeout(() => {
// //       update();
// //     }, UPDATE_INTERVAL);
// //   };

// //   const registerStepCallback = (callback) => {
// //     stepCallbacks.push(callback);
// //   };

// //   const unregisterStepCallback = (callback) => {
// //     stepCallbacks = stepCallbacks.filter((cb) => cb !== callback);
// //   };

// //   const start = () => {
// //     if (isPlaying) return;

// //     isPlaying = true;

// //     currentStepIndex = 0;
// //     nextStepTime = Synth.AC.currentTime;

// //     update();
// //   };

// //   const stop = () => {
// //     isPlaying = false;
// //     clearTimeout(ti);
// //   };

// //   return {
// //     start,
// //     stop,
// //     registerStepCallback,
// //     unregisterStepCallback
// //   };

// // })();

// // /** UI **/

// // const { createContext, useContext, useState, useEffect, useReducer, useRef } = React;

// // const initialSequencerState = {
// //   isEditing: false,
// //   isPlaying: false,
// //   selectedStepIndex: null,
// //   playingStepIndex: null
// // };

// // const Actions = [
// //   'SET_PLAY_STATE',
// //   'SET_EDIT_MODE',
// //   'SET_SELECTED_STEP',
// //   'SET_PLAYING_STEP',
// //   'GO_TO_NEXT_STEP'
// // ].reduce((obj, action) => {
// //   obj[action] = action;
// //   return obj;
// // }, {});

// // const ActionCreators = {
// //   setPlayState: (isPlaying) => ({
// //     type: Actions.SET_PLAY_STATE,
// //     isPlaying
// //   }),
// //   setEditMode: (isEditing) => ({
// //     type: Actions.SET_EDIT_MODE,
// //     isEditing
// //   }),
// //   setSelectedStep: (selectedStepIndex) => ({
// //     type: Actions.SET_SELECTED_STEP,
// //     selectedStepIndex
// //   }),
// //   setPlayingStep: (playingStepIndex) => ({
// //     type: Actions.SET_PLAYING_STEP,
// //     playingStepIndex
// //   }),
// //   goToNextStep: () => ({
// //     type: Actions.GO_TO_NEXT_STEP
// //   })
// // };

// // const sequencerReducer = (state = initialSequencerState, action = {}) => {
// //   switch(action.type) {
// //     case Actions.SET_PLAY_STATE: {
// //       const { isPlaying } = action;
// //       return {
// //         ...state,
// //         isPlaying,
// //         playingStepIndex: isPlaying ? state.playingStepIndex: null
// //       };
// //     };

// //     case Actions.SET_EDIT_MODE: {
// //       const { isEditing } = action;
// //       return {
// //         ...state,
// //         isEditing,
// //         selectedStepIndex: isEditing ? 0 : null
// //       };
// //     };

// //     case Actions.SET_SELECTED_STEP: {
// //       if (!state.isEditing) return state;

// //       const { selectedStepIndex } = action;
// //       return {
// //         ...state,
// //         selectedStepIndex
// //       };
// //     }

// //     case Actions.SET_PLAYING_STEP: {
// //       const { playingStepIndex } = action;
// //       return {
// //         ...state,
// //         playingStepIndex
// //       };
// //     }

// //     case Actions.GO_TO_NEXT_STEP: {
// //       if (state.selectedStepIndex === 15) {
// //         return {
// //           ...state,
// //           selectedStepIndex: null,
// //           isEditing: false
// //         };
// //       }

// //       return {
// //         ...state,
// //         selectedStepIndex: state.selectedStepIndex + 1
// //       };
// //     }

// //     default: {
// //       return state;
// //     }
// //   }
// // };

// // const SynthContext = createContext(null);
// // const useSynth = () => useContext(SynthContext);

// // const useSynthParam = (param) => {
// //   const synth = useSynth();
// //   const [val, setVal] = useState(synth.params[param]);

// //   const updateParam = (e) => {
// //     const v = Number(e.target.value);
// //     setVal(v);
// //     synth.setParam(param, v);
// //   };

// //   return [val, updateParam];
// // };

// // const SequencerStateContext = createContext(null);
// // const SequencerStateProvider = ({ children }) => {
// //   const reducer = useReducer(sequencerReducer, initialSequencerState);

// //   return (
// //     <SequencerStateContext.Provider value={reducer}>
// //       {children}
// //     </SequencerStateContext.Provider>
// //   );
// // };
// // const useSequencerState = () => useContext(SequencerStateContext);

// // const ControlGroup = ({ label, children }) => (
// //   <fieldset>
// //     <legend>{label}</legend>
// //     {children}
// //   </fieldset>
// // );

// // const GenericSlider = ({ label, belowLabel, ...options }) => {
// //   return (
// //     <label className="generic-slider">
// //       {label && <span class="sidelabel">{label}</span>}
// //       <div>
// //         <input type="range" min="0" max="1" step="0.01" {...options} />
// //         {belowLabel && <span class="sublabel">{belowLabel}</span>}
// //       </div>
// //     </label>
// //   );
// // };

// // const PotSlider = ({ param, label, belowLabel }) => {
// //   const [val, setVal] = useSynthParam(param);

// //   return (
// //     <GenericSlider label={label} value={val} onInput={setVal} />
// //   );
// // };

// // const SwitchSlider = ({ param, label, belowLabels }) => {
// //   const [val, setVal] = useSynthParam(param);

// //   return (
// //     <GenericSlider
// //       label={label}
// //       belowLabel={belowLabels.join(' - ')}
// //       value={val}
// //       max={belowLabels.length - 1}
// //       step={1}
// //       onInput={setVal}
// //     />
// //   )
// // };

// // const KeyboardController = ({ notes }) => {
// //   const synth = useSynth();
// //   const [state, dispatch] = useSequencerState();

// //   const pressKey = (note) => {
// //     synth.noteOn(NOTES[note]);
// //     if (state.isEditing) {
// //       synth.sequence[state.selectedStepIndex] = note;
// //       dispatch(ActionCreators.goToNextStep());
// //     }
// //   };

// //   const renderKeys = () => notes.map((note) => {
// //     let cn = note[1] === '#' ? 'sharp' : '';
// //     cn += (synth.sequence[state.playingStepIndex] === note && state.isPlaying) ? ' active' : '';
// //     cn += (synth.sequence[state.selectedStepIndex] === note && state.isEditing) ? ' editing' : '';

// //     return (
// //       <button
// //         key={note}
// //         className={cn}
// //         onMouseDown={() => pressKey(note)}
// //         onMouseUp={synth.noteOff}
// //       >
// //         <span>{note}</span>
// //       </button>
// //     );
// //   });

// //   return (
// //     <div className="keyboard">
// //       {renderKeys()}
// //     </div>
// //   );
// // };

// // KeyboardController.defaultProps = {
// //   notes: ['C-3','C#3','D-3','D#3','E-3','F-3','F#3','G-3','G#3','A-3','A#3','B-3','C-4']
// // };

// // const ActionButton = ({ label, className = null, onClick = () => {} }) => {
// //   const synth = useSynth();

// //   return (
// //     <button
// //       className={`button-link action-button ${className}`}
// //       onClick={onClick}
// //     >
// //       {label}
// //     </button>
// //   );
// // };

// // const PlayButton = () => {
// //   const [state, dispatch] = useSequencerState();
// //   const synth = useSynth();

// //   const seqCallback = (stepIndex) => {
// //     console.log('seqCallback', stepIndex);
// //     dispatch(ActionCreators.setPlayingStep(stepIndex))
// //   };

// //   const startSequencer = () => {
// //     synth.isPlaying ? synth.stop() : synth.play(seqCallback);
// //     dispatch(ActionCreators.setPlayState(synth.isPlaying));
// //   };

// //   const cn = `play${state.isPlaying ? ' active' : ''}`

// //   return (
// //     <ActionButton label="Play/Stop" className={cn} onClick={startSequencer} />
// //   );
// // };

// // const EditButton = () => {
// //   const [state, dispatch] = useSequencerState();

// //   const toggleEdit = () => {
// //     dispatch(ActionCreators.setEditMode(!state.isEditing));
// //   };

// //   const cn = `edit${state.isEditing ? ' active' : ''}`

// //   return (
// //     <ActionButton label="Edit" className={cn} onClick={toggleEdit} />
// //   );
// // };

// // const RestButton = () => {
// //   const [state, dispatch] = useSequencerState();
// //   const synth = useSynth();

// //   const addRest = () => {
// //     if (state.isEditing) {
// //       const n = synth.sequence[state.selectedStepIndex];
// //       synth.sequence[state.selectedStepIndex] = (n === 'xxx') ? null : 'xxx';
// //       dispatch(ActionCreators.goToNextStep());
// //     }
// //   };

// //   return (
// //     <ActionButton label="Rest" onClick={addRest} />
// //   )
// // };

// // const ClearButton = () => {
// //   const [state, dispatch] = useSequencerState();
// //   const synth = useSynth();

// //   return (
// //     <ActionButton label="Clear" className="clear" />
// //   );
// // };

// // const Sequencer = () => {
// //   const [state, dispatch] = useSequencerState();

// //   const selectStep = (idx) => {
// //     dispatch(ActionCreators.setSelectedStep(idx));
// //   };

// //   const renderSteps = (from, to) => {
// //     const st = [];
// //     for (let i = from; i < to; i++) {
// //       let cn = 'sequencer-step' + (i % 4 === 0 ? ' bar' : '');
// //       cn += (state.playingStepIndex === i) ? ' playing' : '';
// //       cn += (state.selectedStepIndex === i) ? ' editing' : '';

// //       st.push(
// //         <button
// //           key={i}
// //           className={cn}
// //           onClick={() => selectStep(i)}
// //         >
// //           {(i % 4 === 0 ? i / 4 : i % 4) + 1}
// //         </button>
// //       );
// //     }
// //     return st;
// //   };

// //   return (
// //     <div className="sequencer">
// //       <div className="sequencer-row">
// //         {renderSteps(0, 8)}
// //       </div>
// //       <div className="sequencer-row">
// //         {renderSteps(8, 16)}
// //       </div>
// //     </div>
// //   );
// // };

// // const Visualizer = () => {
// //   const synth = useSynth();
// //   const canvasRef = useRef(null)

// //   useEffect(() => {
// //     const ctx = canvasRef.current.getContext('2d');
// //     const cw = canvasRef.current.width;
// //     const ch = canvasRef.current.height;
// //     const chh = Math.round(ch * 0.5);
// //     ctx.fillStyle = 'red';
// //     ctx.strokeStyle = 'red';

// //     let canDraw = true;

// //     const draw = () => {
// //       try {
// //         if (canDraw) requestAnimationFrame(draw);
// //         ctx.clearRect(0,0,cw,ch);
// //         const data = synth.getAnalyserData();

// //         ctx.beginPath();
// //         ctx.moveTo(0, chh);
// //         for(let i = 0, ln = data.length; i < ln; i++) {;
// //           ctx.lineTo(i, ch * (data[i] / 255));
// //         }
// //         ctx.stroke();
// //       } catch (e) {
// //         console.log('Ooops', e);
// //         canDraw = false;
// //       }
// //     };

// //     draw();
// //   }, []);

// //   return (
// //     <canvas className="visualizer" width="128" height="45" ref={canvasRef} />
// //   );
// // };

// // const SynthUI = ({ synth, label, keyboardNotes }) => (
// //   <SequencerStateProvider>
// // <SynthContext.Provider value={synth}>
// //   <section>
// //     <h4>JS-2020{label && <span>&nbsp;- {label}</span>}</h4>

// //     <div className="row">
// //       <div className="col">
// //         <ControlGroup label="Master">
// //           <PotSlider param="volume" label="Vol" />
// //         </ControlGroup>

// //         <ControlGroup label="Voicing">
// //           <SwitchSlider param="waveform" label="WAV" belowLabels={Synth.TYPES_ABBR} />
// //           <PotSlider param="unisonWidth" label="WID" />
// //         </ControlGroup>
// //       </div>

// //       <ControlGroup label="ADSR">
// //         <SwitchSlider param="adsrTarget" label="TGT" belowLabels={Synth.ADSR_TARGETS} />
// //         <PotSlider param="adsrAttack" label="ATK" />
// //         <PotSlider param="adsrDecay" label="DEC" />
// //         <PotSlider param="adsrSustain" label="SUS" />
// //         <PotSlider param="adsrRelease" label="REL" />
// //       </ControlGroup>

// //       <div className="col">
// //         <ControlGroup label="Filter">
// //           <PotSlider param="filterFreq" label="FRQ" />
// //           <PotSlider param="filterQ" label="Q" />
// //         </ControlGroup>

// //         <ControlGroup label="Echo FX">
// //           <PotSlider param="echoTime" label="TIM" />
// //           <PotSlider param="echoFeedback" label="FBK" />
// //         </ControlGroup>
// //       </div>
// //     </div>

// //     <div className="row">
// //       <ControlGroup label="Sequencer">
// //         <div className="row">
// //           <div className="row sequencer-controls">
// //             <div className="col">
// //               <PlayButton />
// //               <ClearButton />
// //             </div>
// //             <div className="col">
// //               <EditButton />
// //               <RestButton />
// //             </div>
// //           </div>
// //           <Sequencer />
// //         </div>
// //       </ControlGroup>
// //     </div>

// //     <div className="row">
// //       <KeyboardController notes={keyboardNotes} />
// //       <ControlGroup label="Visualizer">
// //         <Visualizer />
// //       </ControlGroup>
// //     </div>
// //   </section>
// // </SynthContext.Provider>
// //   </SequencerStateProvider>
// // );

// // const App = () => {
// //   const synth = new Synth();
// //   // const synth = new Synth({
// //   //   waveform: 1,
// //   //   unisonWidth: 0.6,
// //   //   adsrTarget: 1,
// //   //   adsrAttack: 0.05,
// //   //   adsrDecay: 0.05,
// //   //   adsrSustain: 0.1,
// //   //   adsrRelease: 0.2,
// //   //   filterFreq: 0.3,
// //   //   filterQ: 0.6
// //   // });

// //   return (
// //     <div id="demo" className="slide-basic">
// //       <SynthUI synth={synth} />
// //     </div>
// //   );
// // };

// console.clear();

// var AUDIO = new (window.AudioContext || window.webkitAudioContext)();

// var dispatcher = _.extend({
//   'EventKeys': {},
//   register: function(eventHash) {
//     for(var k in eventHash) {
//       if(k in this.EventKeys) throw 'Dispatcher error: duplicate event key: ' + k;

//       this.EventKeys[k] = eventHash[k];
//     }
//   }
// }, Backbone.Events);

// /**
//  * Sample bank.  Loads and maintains sound sources
//  * and responds to requests to play them.
// **/
// var SampleBank = (function(A) {

//   var bank = {},
//       loadCount = 0,
//       totalCount = 0;

//   /**
//    * Resource loading
//   **/

//   function loadSamples(srcObj, callback) {
//     for (var k in srcObj) {
//        totalCount++;
//     }
//     for (var k in srcObj) {
//       _loadSample(k, srcObj[k]);
//     }
//     _onSamplesLoaded = callback;
//   }

//   function _onSamplesLoaded() {
//     console.warn('Need to pass a callback to load()');
//   }

//   function _handleSampleLoad(key, buffer) {
//     if (!buffer) {
//       console.error('Unable to decode audio file', url);
//       return;
//     }
//     bank[key] = buffer;
//     if(++loadCount == totalCount) _onSamplesLoaded();
//   }

//   function _loadSample(key, url) {
//     var req = new XMLHttpRequest();
//     req.responseType = "arraybuffer";
//     req.onload = function() {
//       A.decodeAudioData(req.response, function(b) {
//         _handleSampleLoad(key, b);
//       }, function(err) {
//       	console.error('Unable to decode audio data', err);
//       });
//     }
//     req.onerror = function(err) {
//       console.error('Error loading sample data', key, url, err);
//     }
//     req.open('GET', url, true);
//     req.send();
//   }

//   /**
//    * Resource playing
//   **/

//   function playSample(id, when) {
//     var s = A.createBufferSource();
//   	s.buffer = bank[id];
//   	s.connect(A.destination);
//   	s.start(when || 0);
//   }

//   var API = {
//     play: playSample,
//     init: loadSamples
//   };
//   return API;

// })(AUDIO);

// /**
//  * Sequencer
// **/
// var Sequencer = (function(A, S) {

//   var evs = {
//     SEQUENCER_PLAY: 'sequencer:play',
//     SEQUENCER_STOP: 'sequencer:stop',
//     SEQUENCER_SET_PATTERN: 'sequencer:setpattern',
//     SEQUENCER_PATTERN_CHANGED: 'sequencer:patternchanged',
//     SEQUENCER_STEP: 'sequencer:step',
//     SEQUENCER_NOTE_PLAY: 'sequencer:noteplay'
//   };

//   var tempo, tic, _initialized = false;
//   var noteTime, startTime, ti, currentStep = 0;
//   var isPlaying = false;
//   var currentPattern = null, _currentPatternSequenceRaw;
//   var channelStatus = {};

//   function setTempo(newTempo) {
//     tempo = newTempo;
//     tic = (60 / tempo) / 4;   // 16th
//   }

//   /* Scheduling */

//   function scheduleNote() {
//     if(!isPlaying) return false;
//     var ct = A.currentTime;
//     ct -= startTime;
//     while(noteTime < ct + 0.200) {
//       var pt = noteTime + startTime;

//       playPatternStepAtTime(pt);

//       nextNote();
//     }
//     ti = setTimeout(scheduleNote, 0);
//   }

//   function nextNote() {
//     currentStep++;
//     if(currentStep == 16) currentStep = 0;
//     noteTime += tic;
//   }

//   function playPatternStepAtTime(pt) {
//     for(var k in currentPattern) {
//        if(channelStatus[k] !== false && currentPattern[k][currentStep] == "1") {
//          S.play(k, pt);
//          dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_NOTE_PLAY, k);
//        }
//        dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STEP, currentStep);
//     }
//   }

//   /* Parsing */

//   function playPattern(pattern, loops) {
//     if(!_initialized) throw('Sequencer not initialized');
//     if(currentPattern === null) _parsePattern(pattern);

//     if(loops === undefined) loops = 1;
//     if(loops === -1) loops = Number.MAX_INT;

//     play();
//   }

//   function _parsePattern(pattern) {
//     currentPattern = {};
//     _currentPatternSequenceRaw = _.extend(pattern.sequence, {});
//     for(var k in pattern.sequence) {
//       var pat = _parseLine(pattern.sequence[k]);
//       currentPattern[k] = pat;
//     }
//   }

//   function _parseLine(line) {
//     if(line.length !== 16) console.error('Invalid line length', pattern);
//     return line.split('');
//   }

//   /** Transport **/

//   function play() {
//     isPlaying = true;
//     noteTime = 0.0;
//     startTime = A.currentTime + 0.005;
//     scheduleNote();
//   }

//   function stop() {
//     isPlaying = false;
//     currentStep = 0;
//     dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STEP, currentStep);
//   }

//   function changeChannelActiveStatus(channel, status) {
//     channelStatus[channel] = status;
//   }

//   var _template = Handlebars.compile('\
//     <div class="module sequencer">\
//       <h3>Sequencer</h3>\
//       <div class="sequencer-channels">\
// 			{{#each channels}}\
// 				<div class="channel" data-inst="{{ this }}"></div>\
// 				<div class="sep"></div>\
// 			{{/each}}\
//  			</div>\
//     </div>');

//   var SequencerView = Backbone.View.extend({

//     channelViews: {},
//     initialize: function(options) {
// 			this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_PLAY, playPattern);
//       this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_STOP, this.stop);
//       this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_SET_PATTERN, this.setPattern);
//       this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_SET_TEMPO, setTempo);
//       this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_STEP, this.setPlayhead);
//       this.listenTo(dispatcher, dispatcher.EventKeys.SEQUENCER_NOTE_PLAY, this.onNotePlay);
//     },
//     setPattern: function(pattern) {
//       _parsePattern(pattern);

//       this.render();

//       for(var k in this.channelViews) {
//         this.channelViews[k].remove();
//       }
//       for(var k in currentPattern) {
//         var $cel = this.$el.find('.channel[data-inst="' + k + '"]');
//         this.channelViews[k] = new ChannelView({
//           channel: k,
//           model: currentPattern[k],
//         	el: $cel
//         });
//       }

//       this.renderChannels();
//     },
//     render: function() {
//       var data = (currentPattern) ? Object.keys(currentPattern) : [];
//       var rawHTML = _template({ channels: data });
//       this.$el.html(rawHTML);
//       return this;
//     },
//     renderChannels: function() {
//       this.$channelContainer = this.$el.find('.sequencer-channels');
//       for(var k in this.channelViews) {
//         this.channelViews[k].render();
//       }
//       this.$steps = $('.channel span');
//     },
//     setPlayhead: function(stepId) {
//       for(var k in this.channelViews) {
//         this.channelViews[k].setPlayhead(stepId);
//       }
//     },
//     onNotePlay: function(channel) {
//       this.channelViews[channel].spikeEQ();
//     },
//     stop: function() {
//       stop();
//       for(var k in this.channelViews) {
//         this.channelViews[k].clearPlayhead();
//       }
//     }
//   });

//   var _channelTemplate = Handlebars.compile('\
//       <button class="control mute active"></button>\
//       <button class="control pad">{{ symbol }}</button>\
//       <div class="control meter vertical">\
//       	<span></span>\
//       </div>\
//       <div class="seq-row inline">\
//       	{{#each notes}}\
//         <span data-tic="{{ @index }}" class=""></span>\
// 				{{/each}}\
//       </div>\
// 	');

//   var ChannelView = Backbone.View.extend({
//     events: {
//       'click .seq-row span': 'onNoteClick',
//       'click .pad': 'onPadClick',
//       'click .mute': 'onMuteClick'
//     },
//     channel: null,
//     active: true,
//     initialize: function(options) {
//       this.channel = options.channel;
//     },
//     render: function() {
//       var rawHTML = _channelTemplate({
//         id: this.channel,
//         symbol: this.channel.substr(0,1).toUpperCase(),
//         notes: this.model
//       });
//       this.$el.html(rawHTML);

//       this.$notes = this.$el.find('.seq-row span');
//       this.$eq_bar = this.$el.find('.meter span');
//       this.$active = this.$el.find('.mute');

//       var self = this;
//       this.model.forEach(function(note, idx) {
//         var $el = self.$notes.eq(idx);
//         if(note === "1") $el.addClass('seq-note');
//         if(idx % 4 === 0) $el.addClass('seq-step-measure');
//       });
//       this.spikeEQ();
//       this.$active.toggleClass('active', this.active);
//       return this;
//     },
//     clearPlayhead: function() {
//       this.$notes.removeClass('seq-playhead');
//     },
//     setPlayhead: function(id) {
//       this.clearPlayhead();
//       this.$notes.filter('[data-tic="' + id + '"]').addClass('seq-playhead');
//     },
//     onNoteClick: function(e) {
//       var tic = $(e.currentTarget).attr('data-tic');
//       currentPattern[this.channel][tic] = (currentPattern[this.channel][tic] === "1") ? "0" : "1";
//       this.render();
//     },
//     onMuteClick: function(e) {
//       this.active = !this.active;
//       channelStatus[this.channel] = this.active;
//       this.$active.toggleClass('active', this.active);
//     },
//     onPadClick: function(e) {
//       S.play(this.channel);
//       this.spikeEQ(this.channel);
//     },
//     spikeEQ: function() {

//       var self = this;
//       this.$eq_bar.removeClass('fade');
//       this.$eq_bar.css('transform', 'scaleX(1)');

//       setTimeout(function() {
//         self.$eq_bar.addClass('fade');
//         self.$eq_bar.css('transform', 'scaleX(0)');
//       }, 50);
//     }
//   });

//   function init(options) {
//     dispatcher.register(evs);
//     new SequencerView(options).render();
//     setTempo(130);
//     _initialized = true;
//   }

//   return {
//     init: init
//   }

// })(AUDIO, SampleBank);

// /**
//  * Transport
// **/
// var Transport = (function() {

//   var evs = {
//     TRANSPORT_PLAY: 'transport:play',
//     TRANSPORT_STOP: 'transport:stop',
//     TRANSPORT_REQUEST_PLAY: 'transport:requestplay',
//     TRANSPORT_REQUEST_STOP: 'transport:requeststop',
//     TRANSPORT_TEMPO_CHANGED: 'transport:tempochanged',
//     TRANSPORT_CHANGE_TEMPO: 'transport:changetempo'
//   }

//   var _template = Handlebars.compile('\
//     <div class="module transport">\
//       <h3>Transport</h3>\
//       <button class="transport-play" title="Play">&#9658;</button>\
// 			<button class="transport-stop" title="Stop">&#9632;</button>\
// 			<input type="text" size="3" min="30" max="250" value="130" class="transport-tempo" /> \
//     </div>\
//   ');

//   function play() {
//     console.log('play');
//     dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY);
//   }

//   function stop() {
//     dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP);
//   }

//   var TransportView = Backbone.View.extend({
//     events: {
//       'click .transport-play': 'onPlayClick',
//       'click .transport-stop': 'onStopClick',
//       'change .transport-tempo': 'onTempoChange'
//     },
//     initialize: function(options) {
// 			this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_PLAY, play);
//       this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_STOP, stop);
//       this.listenTo(dispatcher, dispatcher.EventKeys.TRANSPORT_CHANGE_TEMPO, this.onIncomingTempoChange);
//     },
//     render: function() {
//       var rawHTML = _template();
//       this.$el.html(rawHTML);
//       this.$tempo = this.$el.find('.transport-tempo');
//       return this;
//     },
//     onPlayClick: play,
//     onStopClick: stop,
//     onTempoChange: function(e) {
//       var newTempo = $(e.currentTarget).val();
//       dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, newTempo);
//     },
//     onIncomingTempoChange: function(newTempo) {
//       this.$tempo.val(newTempo);
//       dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, newTempo);
//     }
//   });

//   function init(options) {
//     dispatcher.register(evs);
//     new TransportView(options).render();
//   }

//   return {
//     init: init
//   }

// })();

// /**
//  * Metronome
// **/
// var Metronome = (function() {

//   var evs = {
//     METRONOME_TIC: 'metronome:tic',
//     METRONOME_CLEAR: 'metronome:clear'
//   }

//   var _template = Handlebars.compile('\
// 		<h3>Metronome</h3>\
// 		<div class="control metronome">\
//       <span></span>\
//       <span></span>\
//       <span></span>\
//       <span></span>\
//     </div>\
// 	');

//   var MetronomeView = Backbone.View.extend({
//     initialize: function(options) {
//       this.listenTo(dispatcher, dispatcher.EventKeys.METRONOME_TIC, this.onTic);
//       this.listenTo(dispatcher, dispatcher.EventKeys.METRONOME_CLEAR, this.clear);
//     },
//     render: function() {
//       var rawHTML = _template();
//     	this.$el.html(rawHTML);
//       this.$steps = this.$el.find('span');
//       return this;
//     },
//     clear: function() {
//       this.$steps.removeClass('active');
//     },
//     onTic: function(stepId) {
//       if(stepId % 4 == 0) {
//         this.clear();
//         this.$steps.eq(Math.floor(stepId / 4)).addClass('active');
//       }
//     }
//   });

//   function init(options) {
//     dispatcher.register(evs);
//     new MetronomeView(options).render();
//   }

//   return {
//     init: init
//   }
// })();

// /**
//  * Preset pattern selector
//  **/
// var PresetList = (function() {

//   var evs = {
//     PRESET_SELECTED: 'preset:selected'
//   }

//   var presets = {
//     'remaining': {
//       tempo: 100,
//       name: 'Remaining',
//       sequence: {
//         'openHat':		'0010001000100010',
//         'closedHat':	'1000100010001000',
//         'snare':			'0000100000001000',
//         'kick':				'1000000010100100'
//       }
//     },
//     'coagulate': {
//       tempo: 124,
//       name: 'Coagulate',
//       sequence: {
//         'openHat':		'0010000000000010',
//         'closedHat':	'1100111111111100',
//         'snare':			'0000100000001000',
//         'kick':				'0110000010000001'
//       }
//     },
//     'deodorize': {
//       tempo: 118,
//       name: 'Deodorize',
//       sequence: {
//         'openHat':		'1000100010001000',
//         'closedHat':	'0000000000000000',
//         'snare':			'0000100101001000',
//         'kick':				'1001000000110100'
//       }
//     },
//     'maintain': {
//       tempo: 90,
//       name: 'Maintain',
//       sequence: {
//         'openHat':		'0000000000100000',
//         'closedHat':	'1010101010001010',
//         'snare':			'0000100000001000',
//         'kick':				'0010010010000010'
//       }
//     },
//     'mufuh': {
//       tempo: 130,
//       name: 'Mufu',
//       sequence: {
//         'openHat':		'0011000000000110',
//         'closedHat':	'1100111111111001',
//         'snare':			'0000100101001101',
//         'kick':				'1010000000100000'
//       }
//     },
//     'gabriel': {
//       tempo: 135,
//       name: 'Gabriel',
//       sequence: {
//         'openHat':		'0000000000010000',
//         'closedHat':	'0000011000000100',
//         'snare':			'0000109000001000',
//         'kick':				'1000010100100000'
//       }
//     },
//     'empty': {
//       tempo: 130,
//       name: '[empty]',
//       sequence: {
//         'openHat':		'0000000000000000',
//         'closedHat':	'0000000000000000',
//         'snare':			'0000000000000000',
//         'kick':				'0000000000000000'
//       }
//     }
//   };

//   var _template = Handlebars.compile('\
// 		<h3>Presets</h3>\
// 		<ul class="control presets menu">\
// 		{{#each items}}\
//     	<li><a href="#" data-preset-id="{{ @key }}">{{ name }}</a></li>\
//     {{/each}}\
//     </ul>\
// 	');

//   var PresetListView = Backbone.View.extend({
// 		events: {
//       'click a': 'onPresetClick'
//     },
//     render: function() {
//       var rawHTML = _template({ items: presets });
//     	this.$el.html(rawHTML);
//       this.$items = this.$el.find('a');
//       return this;
//     },
//     onPresetClick: function(e) {
//       var id = $(e.currentTarget).attr('data-preset-id');
//       this.$items.removeClass('active');
//       $(e.currentTarget).addClass('active');
//       dispatcher.trigger(dispatcher.EventKeys.PRESET_SELECTED, presets[id]);
//     }
//   });

//   function init(options) {
//     dispatcher.register(evs);
//     new PresetListView(options).render();
//   }

//   return {
//     init: init
//   }

// })();

// /** Application **/

// var App = {

//   _connectModules: function() {

//     // Transport controls -> sequencer
//     dispatcher.on(dispatcher.EventKeys.TRANSPORT_REQUEST_PLAY, function() {
//       dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_PLAY);
//     });
//     dispatcher.on(dispatcher.EventKeys.TRANSPORT_REQUEST_STOP, function() {
//       dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STOP);
//     });
//     dispatcher.on(dispatcher.EventKeys.TRANSPORT_TEMPO_CHANGED, function(newTempo) {
//       dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_TEMPO, newTempo);
//     });

//     // Sequencer actions -> metronome
//     dispatcher.on(dispatcher.EventKeys.SEQUENCER_STEP, function(stepId) {
//       dispatcher.trigger(dispatcher.EventKeys.METRONOME_TIC, stepId);
//     });
//     dispatcher.on(dispatcher.EventKeys.SEQUENCER_STOP, function() {
//       dispatcher.trigger(dispatcher.EventKeys.METRONOME_CLEAR);
//     });

//     // Preset list -> tempo and sequencer
//     dispatcher.on(dispatcher.EventKeys.PRESET_SELECTED, function(preset) {
//       dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_CHANGE_TEMPO, preset.tempo);
//       dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_PATTERN, preset);
//     });

//   },

//   onLoad: function() {

//     this._connectModules();

//     var pattern = {
//       sequence: {
//         'openHat':		'0000000000000000',
//         'closedHat':	'0000000000000000',
//         'snare':			'0000100000001000',
//         'kick':				'1000000010000000'
//       }
//     };

//     dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_SET_PATTERN, pattern);
// 		//dispatcher.trigger(dispatcher.EventKeys.TRANSPORT_PLAY);
//   },

//   init: function() {
//     //
//     document.addEventListener('visibilitychange', function(e) {
//       if(document.hidden) dispatcher.trigger(dispatcher.EventKeys.SEQUENCER_STOP);
//     }, false);

//     // 808 or GTFO
//     var samples = {},
//     sampleList = ['kick', 'snare', 'openHat', 'closedHat'];
//     sampleList.forEach(function(id) {
//       samples[id] = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/101507/' + id + '.wav';
//     });

//     Sequencer.init({ el: $('#r-mid') });
//   	Transport.init({ el: $('#r-top') });
//     Metronome.init({ el: $('#r-head') });
//     PresetList.init({ el: $('#r-footer') });

//     // Load samples and kickoff
//     SampleBank.init(samples, this.onLoad.bind(this));
//   }
// }

// App.init();
