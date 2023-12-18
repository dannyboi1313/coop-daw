import Head from "next/head";
import { Inter, Play } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import Player from "../../classes/Player";
const inter = Inter({ subsets: ["latin"] });
import { useAudioContext } from "../../providers/AudioContextContext";
import SynthPlayer from "../../components/editors/SynthEditor";
import SynthFacade from "../../models/SynthFacade";
import SectionMarker from "../../components/SectionMarker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faRepeat,
  faBackwardStep,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import DrumFacade from "../../models/DrumFacade";
import DrumMachine from "../../classes/DrumMachine";
import { getSolidColor, colors } from "../../utils/uiUtils";
import VolumeSlider from "../../components/UIElements/VolumeSlider";
import AddTrackOptionsModule from "../../components/AddTrackOptionsModule";
import Error from "next/error";

const NUM_GRIDS = 320;

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState(null);
  const [instruments, setInstruments] = useState(new Map());
  const [audioContext, setAudioContext] = useState(useAudioContext());
  const [masterSchedule, setMasterSchedule] = useState(
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,]) //prettier-ignore
  const [timerID, setTimerID] = useState(null);

  const [sections, setSections] = useState(new Map());
  const [eventQueue, setEventQueue] = useState(null);
  const [dtmf, setDtmf] = useState(null);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedGridCell, setSelectedGridCell] = useState(null);
  const [copiedSectionId, setCopiedSectionId] = useState(null);
  const [draggingSection, setDraggingSection] = useState(null);

  const [lastBeatToPlay, setLastBeatToPlay] = useState(null);
  const [trackCount, setTrackCount] = useState(0);
  const [showAddNewTrackOptions, setShowAddNewTrackOptions] = useState(false);

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSection, selectedGridCell, copiedSectionId, draggingSection]); //prettier-ignore

  //KeyBindings
  const handleKeyDown = (event) => {
    // Handle key events here
    //console.log(event.key, selectedSection);

    if (
      event.key === "c" &&
      (event.ctrlKey || event.metaKey) &&
      selectedSection !== null
    ) {
      // Perform your desired action here
      setCopiedSectionId(selectedSection);
      console.log("Ctrl + C pressed");
    }
    if (
      event.key === "v" &&
      (event.ctrlKey || event.metaKey) &&
      copiedSectionId !== null
    ) {
      console.log("Pasted");
      const copiedSection = sections.get(copiedSectionId);
      addSection(copiedSection.track, copiedSectionId, selectedGridCell.col);
    }
  };

  useEffect(() => {
    // const fetchInstruments = async () => {
    //   try {
    //     // const response = await fetch("your-api-endpoint-for-instruments");
    //     // const data = await response.json();
    //     setInstruments(data);
    //     setLoading(false); // Set loading to false once instruments are fetched
    //   } catch (error) {
    //     console.error("Error fetching instruments:", error);
    //     setLoading(false); // Set loading to false in case of an error
    //   }
    // };

    const samples = async () => {
      const sample = await setupSample();
      setDtmf(sample);
    };
    samples();
    //fetchInstruments();
    // const ac = useAudioContext();
    //setAudioContext(ac);
    const s = new SynthFacade(audioContext, 1);
    const s2 = new SynthFacade(audioContext, 2);
    const d = new DrumFacade(audioContext, 3);

    const i = instruments;
    i.set(1, s);
    i.set(2, s2);
    i.set(3, d);

    setInstruments(i);
    const initialSections = new Map();
    initialSections.set(1, {
      sectionId: 1,
      track: 1,
      startTime: 0,
      instrument: 1,
      color: colors.blue,
    });
    initialSections.set(2, {
      sectionId: 2,
      track: 2,
      startTime: 0,
      instrument: 2,
      color: colors.pink,
    });
    initialSections.set(3, {
      sectionId: 3,
      track: 3,
      startTime: 0,
      instrument: 3,
      color: colors.yellow,
    });
    setSections(initialSections);
    setLastBeatToPlay(64);
    const initialTracks = [
      { id: 1, volumn: 80, sections: [1], color: colors.blue },
      { id: 2, volumn: 80, sections: [2], color: colors.pink },
      { id: 3, volumn: 80, sections: [3], color: colors.yellow },
    ];
    setTracks(initialTracks);
    const eq = [];
    for (let i = 0; i < NUM_GRIDS; i++) {
      eq.push([]);
    }
    //setEventQueue(eq);
    initializeEventQueue(eq, initialTracks, initialSections, i);
    //updateEventQueue();
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log("refresing");
  // }, [loading, instrument, metronomeOn, isPlaying, tracks]); //prettier-ignore

  useEffect(() => {
    updateEventQueue();
  }, [sections]);

  useEffect(() => {}, [trackCount]);
  // const updateInstrument = (notes, size, instrumentId) => {
  //   console.log("updating", notes, size, instrumentId);
  //   const oldInstrument = instruments.get(instrumentId);
  //   const updated = oldInstrument.updateEvents(notes, size);
  //   const oldList = instruments;
  //   oldList[instrumentId] = updated;
  //   console.log("updated instrument", updated);
  //   setInstruments(oldList);
  //   updateEventQueue();
  //   //console.log("Insturment", instrument);
  // };

  const updateInstrument = (notes, action, size, instrumentId) => {
    const oldInstrument = instruments.get(instrumentId);

    let updated;

    switch (action) {
      case 0:
        updated = oldInstrument.addNote(notes, size);
        break;
      case 1:
        updated = oldInstrument.deleteNote(notes, size);
        break;
      case 2:
        updated = oldInstrument.editNote(notes, size);
        break;
      default:
        break;
    }

    const oldList = instruments;
    oldList[instrumentId] = updated;
    setInstruments(oldList);
    updateEventQueue();
    //console.log("Insturment", instrument);
  };
  const emptyQueue = (queue) => {
    if (queue === null) {
      const eq = [];
      for (let i = 0; i < NUM_GRIDS; i++) {
        eq.push([]);
      }
      return eq;
    }
    //const queue = eventQueue;
    queue.map((a, index) => {
      queue[index] = [];
    });
    //setEventQueue(queue);
    return queue;
  };

  const initializeEventQueue = (queue, t, s, i) => {
    // t.map((track) => {
    //   track.sections.map((sec) => {
    //     const section = s.get(sec);
    //     const startTime = section.startTime;
    //     const instrument = i.get(section.instrument);
    //     //console.log("TESTING", instrument);
    //     const events = instrument.getEventList();
    //     events.map((event, index) => {
    //       event.map((e) => {
    //         queue.at(startTime + index).push(e);
    //       });
    //     });
    //   });
    // });

    setEventQueue(queue);
  };
  const updateEventQueue = () => {
    const queue = emptyQueue(eventQueue);
    tracks.map((track) => {
      track.sections.map((sec) => {
        const section = sections.get(sec);
        const startTime = section.startTime;
        const instrument = instruments.get(section.instrument);
        const events = instrument.getEventList();
        // events.map((event, index) => {
        //   event.map((e) => {
        //     queue.at(startTime + index).push(e);
        //   });
        // });
        for (let event of events) {
          event[1].map((e) => {
            queue.at(startTime + event[0]).push(e);
          });
        }
      });
    });

    setEventQueue(queue);
  };

  const addSection = (trackId, id, start) => {
    const newId = sections.size + 1;
    const currSections = new Map(sections);
    const sectionInstrument = instruments.get(trackId);
    const sectionTrack = tracks[trackId - 1];
    currSections.set(newId, {
      sectionId: newId,
      track: trackId,
      startTime: start,
      instrument: trackId,
      color: sectionTrack.color,
    });
    //setSections(null);

    const tracksCopy = tracks;
    tracksCopy[trackId - 1].sections.push(newId);
    setTracks(tracksCopy);
    setSections(currSections);
  };

  const deleteSection = (id, start) => {
    const currSections = new Map(sections);
    const sectionInstrument = instruments.get(id);
    const sectionToDelete = currSections.get(id);
    const tracksCopy = tracks;
    tracksCopy[sectionToDelete.track - 1].sections = tracksCopy[
      sectionToDelete.track - 1
    ].sections.filter((a) => {
      return a !== id;
    });
    setTracks(tracksCopy);
    currSections.delete(id);
    setSections(currSections);
  };

  let tempo = 120.0;
  let playbackRate = 1;
  //const audioContext = useAudioContext();

  /////////////
  //////////////////

  async function getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }
  async function setupSample() {
    const filePath = "/sounds/metronome.wav";
    const sample = await getFile(audioContext, filePath);
    return sample;
  }
  function playSample(audioBuffer, time) {
    const sampleSource = new AudioBufferSourceNode(audioContext, {
      buffer: audioBuffer,
      playbackRate,
    });
    sampleSource.connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource;
  }

  if (loading) {
    return <p>Loading</p>;
  }
  //const player = new Player(audioContext);

  // Expose frequency & frequency modulation

  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  let currentNote = 0; // The note we are currently playing
  let nextNoteTime = 0.0; // when the next note is due.
  function nextNote() {
    const secondsPerBeat = 60.0 / tempo / 4;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero when reaching 4
    currentNote = (currentNote + 1) % lastBeatToPlay;
    // if (currentNote === 0) {
    //   console.log("Restart count.. Sections", sections);
    //   handleStop();
    // }
    setCounter(currentNote);
  }

  const getMetronome = () => {
    return metronomeOn;
  };
  function scheduleNote(beatNumber, time) {
    // if (beatNumber === 0) {
    //   updateEventQueue();
    // }
    if (getMetronome() === true && beatNumber % 4 == 0) {
      //console.log("Scheduled some metronome", metronomeOn, time);
      playSample(dtmf, time);
    }

    if (eventQueue[beatNumber].length > 0) {
      // console.log("BEAT: ", beatNumber, eventQueue[beatNumber]);

      eventQueue[beatNumber].forEach((e) => {
        //console.log("Playing ", e.note);
        // console.log(e, e.instrumentId, instruments[e.instrumentId]);
        instruments.get(e.instrumentId).handleEvent(e, time);
      });
    }
  }

  function scheduler() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
      scheduleNote(currentNote, nextNoteTime);

      nextNote();
    }
    setTimerID(setTimeout(scheduler, lookahead));
  }

  const handlePlay = () => {
    //console.log("Starting to play");
    // Start playing
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    updateEventQueue();
    currentNote = counter;
    nextNoteTime = audioContext.currentTime;
    scheduler(); // kick off scheduling
  };
  //const synth = new SynthModel(audioContext);

  const handleStop = () => {
    console.log("STOPPPPING");
    setIsPlaying(false);
    window.clearTimeout(timerID);
    instruments.forEach((instrument) => {
      //console.log("stopping", instrument);
      instrument.stopAllNotes();
    });
    updateEventQueue();
  };
  const handleMetronomeClick = () => {
    handleStop();
    setMetronomeOn(!metronomeOn);
    setTimeout(() => {
      handlePlay();
    }, 200);
  };
  const handleGridCellClick = (index, row) => {
    setSelectedGridCell({ row: row, col: index });
  };
  const findNextOpenSlot = (track) => {
    //If track is empyt, just add it to the first slot
    if (track.sections.length === 0) {
      return 0;
    }
    //Sort sections by the start time
    const sortedTracks = track.sections.sort(
      (a, b) => sections.get(a).startTime - sections.get(b).startTime
    );
    const currInstrument = instruments.get(
      sections.get(sortedTracks[0]).instrument
    );
    const minLength = currInstrument.getSectionLength(); //prettier-ignore
    //Do some fancy mathing to check if the distance between any of the sections is large enough to fit a new section
    for (let i = 0; i < sortedTracks.length - 1; i++) {
      if (
        (sections.get(sortedTracks[i+1]).startTime)  - sections.get(sortedTracks[i]).startTime  > (minLength * 2) //prettier-ignore
      ) {
        return sections.get(sortedTracks[i]).startTime + minLength;
      }
    }
    // Make sure we catch the cases from the endTime of the last section to the end of the grid
    if (
      NUM_GRIDS - sections.get(sortedTracks[sortedTracks.length - 1]).startTime > minLength * 2 //prettier-ignore
    ) {
      return (
        sections.get(sortedTracks[sortedTracks.length - 1]).startTime + minLength //prettier-ignore
      );
    }
    //No place to enter, return -1
    return -1;
  };

  const handleAddSectionClick = (track) => {
    const indexToAdd = findNextOpenSlot(track);
    if (indexToAdd === -1) return;
    addSection(track.id, track.id, indexToAdd);
  };
  const getBeatStyle = (index) => {
    switch (index % 16) {
      case 0:
        return styles.beatFull;
      case 4:
        return styles.beatQuarter;
      case 8:
        return styles.beatQuarter;
      case 12:
        return styles.beatQuarter;

      case 2:
        return styles.beatEight;
      case 6:
        return styles.beatEight;
      case 10:
        return styles.beatEight;
      case 14:
        return styles.beatEight;
      default:
        return styles.beatSixteen;
    }
  };

  const handleSelectionClick = (id, col) => {
    //setSelectedSection(id);
  };
  const preventDefaults = (e) => {
    e.preventDefault();
  };
  const handleSectionMouseDown = (event, id, col) => {
    event.preventDefault();
    if (
      selectedSection === null ||
      (selectedSection !== null && selectedSection !== id)
    ) {
      setSelectedSection(id);
    }
    setDraggingSection({ id: id, clickX: id, clickY: col });
  };
  const handleSectionRelease = () => {
    setDraggingSection(null);
  };
  const handleSectionDrag = (col, sectionId) => {
    if (draggingSection !== null) {
      const currSection = sections.get(draggingSection.id);
      const currSections = new Map(sections);
      if (col > currSection.startTime) {
        currSection.startTime = currSection.startTime += 1;
      } else {
        currSection.startTime = col;
      }
      currSections.set(draggingSection.id, currSection);
      setSections(currSections);
    }
  };
  const getNotchStyle = (col) => {
    if (col % 16 === 0) {
      return styles.largeNotch;
    } else if (col % 8 === 0) {
      return styles.mediumNotch;
    } else if (col % 4 === 0) {
      return styles.smallNotch;
    }
  };

  const renderGridCells = (row) => {
    const cellArray = Array.from({ length: NUM_GRIDS }, (_, index) => index);

    return (
      <>
        {cellArray.map((index) => {
          return (
            <div
              className={`${styles.gridCell} ${
                selectedGridCell !== null &&
                selectedGridCell.col === index &&
                selectedGridCell.row === row &&
                styles.selectedGrid
              } 
              ${getBeatStyle(index)}`}
              onClick={() => {
                handleGridCellClick(index, row);
              }}
              onMouseMove={() => {
                handleSectionDrag(index, row);
              }}
            ></div>
          );
        })}
      </>
    );
  };
  const renderGridMarker = () => {
    const cellArray = Array.from({ length: NUM_GRIDS }, (_, index) => index);

    return (
      <>
        {cellArray.map((index) => {
          return (
            <div className={`${styles.gridCellMarker} ${getNotchStyle(index)}`}>
              {index % 16 === 0 && index / 16 + (index % 16)}
            </div>
          );
        })}
      </>
    );
  };
  const renderSections = (section) => {
    const currSection = sections.get(section);
    if (currSection === null) {
      return <></>;
    }
    const currInstrument = instruments.get(currSection.instrument);

    //console.log(currInstrument, selectedSection, section.sectionId);
    //console.log("RENDEring SECTIONS");
    return (
      <SectionMarker
        key={section}
        section={currSection}
        instrument={currInstrument}
        updateInstrument={updateInstrument}
        timer={counter - 1}
        selected={selectedSection === section}
        handleClick={handleSelectionClick}
        handleSectionMouseDown={handleSectionMouseDown}
        handleSectionRelease={handleSectionRelease}
        handleDelete={deleteSection}
      />
    );
  };

  const renderTimePointer = () => {
    return (
      <div
        className={styles.timeBar}
        style={{
          left: `calc(${counter}*.5rem)`, // Calculate left position based on counter
          height: "100vh",
        }}
      ></div>
    );
  };
  const handleTestClick = () => {
    console.log(dtmf);
    drum.handleEvent(
      { type: "trigger", note: "kickSample" },
      audioContext.currentTime
    );
  };

  const handleShowTrackAdd = () => {
    setShowAddNewTrackOptions(true);
  };

  const handleCloseTrackAdd = () => {
    setShowAddNewTrackOptions(false);
  };
  const addTrack = (formData) => {
    console.log(formData);
    const trackId = tracks.length + 1;
    const color = formData.color;

    let newInstrument;

    if (formData.instrument == "drums") {
      newInstrument = new DrumFacade(audioContext, trackId);
    } else if (formData.instrument == "synth") {
      newInstrument = new SynthFacade(audioContext, trackId);
    } else {
      throw Error;
    }
    const i = instruments;
    i.set(trackId, newInstrument);
    setInstruments(i);
    const currSections = sections;
    currSections.set(trackId, {
      sectionId: trackId,
      track: trackId,
      startTime: 0,
      instrument: trackId,
      color: color,
    });

    setSections(currSections);

    const initialTracks = tracks;
    initialTracks.push({
      id: trackId,
      volumn: 80,
      sections: [trackId],
      color: color,
    });
    setTracks(initialTracks);
    setTrackCount(trackCount + 1);
  };

  const renderTrackOptions = () => {
    return <AddTrackOptionsModule addTrack={addTrack} />;
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${styles.main} bg-darkest text-light`}
        onContextMenu={preventDefaults}
      >
        {showAddNewTrackOptions && renderTrackOptions()}
        <div className="flex flex-row w-100 justify-between align-center bg-darker h-4 p-1">
          <div className="">Title - Project Name</div>
          <div className="flex h-100 justify-around gap-1 ps-1">
            <div className="bg-grey-dark h-100 flex flex-row justify-between align-center rounded-1 ps-1">
              <button
                className={styles.buttonControl}
                onClick={() => {
                  setCounter(0);
                }}
              >
                <FontAwesomeIcon icon={faBackwardStep} size="lg" />
              </button>
              <div className="vert-divider"></div>
              <button onClick={handlePlay} className={styles.buttonControl}>
                <FontAwesomeIcon icon={faPlay} size="lg" />
              </button>
              <div className="vert-divider"></div>
              <button onClick={handleStop} className={styles.buttonControl}>
                <FontAwesomeIcon icon={faStop} size="lg" />
              </button>
              <div className="vert-divider"></div>
              <button className={styles.buttonControl}>
                <FontAwesomeIcon icon={faRepeat} size="lg" />
              </button>
            </div>
            <div className="bg-darkest ml-1 w-8 flex gap-1 flex-end align-center br-1 p-s">
              <div className="h-100 flex t-center flex-col flex-end">
                <label className="tc-grey t-small">Time</label>
                <p> {(counter / 16).toFixed(2)}</p>
              </div>
              <div className="h-100 flex t-center flex-col flex-end">
                <label className="tc-grey t-small">BPM</label>
                <p>{tempo}</p>
              </div>
              <div className="h-100 flex t-center flex-col flex-end">
                <p>4/4</p>
              </div>
            </div>
            {/* <button
              onClick={() => {
                handleMetronomeClick();
              }}
            >
              METRONOME {metronomeOn ? "ON" : "OFF"} {metronomeOn}
            </button>
            <button
              onClick={() => {
                setCounter(counter + 1);
              }}
              onMouseDown={preventDefaults}
            >
              WOOOOHOOO
            </button> */}
            <div className="flex ">
              <VolumeSlider />
            </div>
          </div>

          <div>Icons Share</div>
        </div>
        <div className={styles.trackWrapper}>
          <div className={styles.trackColumn}>
            <div className={styles.topPadding}>
              <h1>Tracks</h1>
            </div>
            {tracks.map((track, index) => {
              return (
                <div className={styles.trackInfo}>
                  <button
                    onClick={() => {
                      handleAddSectionClick(track);
                    }}
                  >
                    <FontAwesomeIcon icon={faAdd} size="xl" />
                  </button>
                  <div className={styles.trackInfoRow}>
                    <h2>0{index + 1}</h2>
                    <h1>{instruments.get(index + 1).name}</h1>
                  </div>
                  <div className={styles.trackInfoRow}>
                    <h3>Instrument</h3>
                    <div>
                      <p>Selector</p>
                    </div>
                  </div>
                  <div className={styles.trackInfoRow}>
                    <h3>Elements</h3>
                    <button>Rev</button>
                    <button>Rev</button>
                    <button>Rev</button>
                  </div>
                  <div
                    className={`${styles.colorIndicator}`}
                    style={{
                      backgroundColor: `${getSolidColor(track.color)}`,
                    }}
                  ></div>
                </div>
              );
            })}

            <button onClick={handleShowTrackAdd}>
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
          </div>
          <div className={styles.gridContainer}>
            <div
              className={styles.timeBarContainer}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
                transition: "grid ease 0.3s",
              }}
            >
              {renderTimePointer()}
            </div>
            <div
              className={`bg-dark ${styles.topPadding}`}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
              }}
            >
              {renderGridMarker()}
            </div>

            {tracks.map((track) => {
              return (
                <div
                  className={styles.trackContainer}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                    position: "relative",
                  }}
                  onMouseDown={preventDefaults}
                >
                  {renderGridCells(track.id)}
                  {track.sections.map((section) => {
                    return renderSections(section);
                  })}
                </div>
              );
            })}
            <div
              className={styles.trackContainer}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
              }}
              onMouseDown={preventDefaults}
            >
              {renderGridCells(4)}
            </div>
            <div
              className={styles.trackContainer}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
              }}
              onMouseDown={preventDefaults}
            >
              {renderGridCells(5)}
            </div>
            <div
              className={styles.trackContainer}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
              }}
              onMouseDown={preventDefaults}
            >
              {renderGridCells(5)}
            </div>
            <div
              className={styles.trackContainer}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
              }}
              onMouseDown={preventDefaults}
            >
              {renderGridCells(5)}
            </div>
            <div
              className={styles.trackContainer}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_GRIDS}, .5rem)`,
                position: "relative",
              }}
              onMouseDown={preventDefaults}
            >
              {renderGridCells(5)}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
