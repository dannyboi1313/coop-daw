import Head from "next/head";
import { Inter, Play } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import Player from "../../classes/Player";
const inter = Inter({ subsets: ["latin"] });
import { useAudioContext } from "../../providers/AudioContextContext";
import SynthPlayer from "../../components/instruments/SynthPlayer";
import SynthModel from "../../models/SynthModel";
import SectionMarker from "../../components/SectionMarker";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState(null);
  const [instruments, setInstruments] = useState(null);
  const [audioContext, setAudioContext] = useState(useAudioContext());
  const [masterSchedule, setMasterSchedule] = useState(
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,]) //prettier-ignore
  const [timerID, setTimerID] = useState(null);

  const [sections, setSections] = useState([]);
  const [eventQueue, setEventQueue] = useState(null);
  const [dtmf, setDtmf] = useState(null);
  const [metronomeOn, setMetronomeOn] = useState(false);

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
    const s = new SynthModel(audioContext, 1);
    const s2 = new SynthModel(audioContext, 2);
    setInstrument(s);
    setInstruments({ 1: s, 2: s2 });
    setSections({
      1: { sectionId: 1, startTime: 0, instrument: 1 },
      2: { sectionId: 2, startTime: 8, instrument: 1 },
      3: { sectionId: 3, startTime: 1, instrument: 2 },
      4: { sectionId: 4, startTime: 4, instrument: 2 },
      5: { sectionId: 5, startTime: 8, instrument: 2 },
      6: { sectionId: 6, startTime: 12, instrument: 2 },
    });
    setTracks([
      { id: 1, volumn: 80, sections: [1, 2] },
      { id: 2, volumn: 80, sections: [3, 4, 5, 6] },
    ]);
    setEventQueue([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]); //prettier-ignore
    setLoading(false);
  }, []);

  // useEffect(() => {}, [loading, instrument, counter, metronomeOn, isPlaying]);

  const updateInstrument = (notes, size, instrumentId) => {
    const oldInstrument = instruments[instrumentId];
    const updated = oldInstrument.updateEvents(notes, size);
    const oldList = instruments;
    oldList[instrumentId] = updated;
    setInstruments(oldList);
    console.log("Insturment", instrument);
  };
  const emptyQueue = (queue) => {
    //const queue = eventQueue;
    queue.map((a, index) => {
      queue[index] = [];
    });
    //setEventQueue(queue);
    return queue;
  };
  const updateEventQueue = () => {
    const queue = emptyQueue(eventQueue);
    console.log("TRACks", tracks[0]);
    tracks.map((track) => {
      track.sections.map((sec) => {
        const section = sections[sec];
        const startTime = section.startTime;
        const instrument = instruments[section.instrument];
        console.log("TESTING", instrument);
        const events = instrument.getEventList();
        events.map((event, index) => {
          event.map((e) => {
            queue.at(startTime + index).push(e);
          });
        });
      });
    });

    setEventQueue(queue);
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
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero when reaching 4
    currentNote = (currentNote + 1) % 20;
    setCounter(currentNote);
  }

  const getMetronome = () => {
    return metronomeOn;
  };
  function scheduleNote(beatNumber, time) {
    updateEventQueue();
    console.log("Event Queue", eventQueue);

    if (getMetronome() === true) {
      console.log("Scheduled some metronome", metronomeOn, time);
      playSample(dtmf, time);
    }

    if (eventQueue[beatNumber].length > 0) {
      console.log("BEAT: ", beatNumber);

      eventQueue[beatNumber].forEach((e) => {
        console.log("Playing ", e.note);
        instrument.handleEvent(e, time);
      });
      eventQueue[beatNumber] = [];
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
    console.log("Starting to play");
    // Start playing
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    currentNote = counter;
    nextNoteTime = audioContext.currentTime;
    scheduler(); // kick off scheduling
  };
  //const synth = new SynthModel(audioContext);
  const NUM_GRIDS = 24;
  const handleStop = () => {
    setIsPlaying(false);
    window.clearTimeout(timerID);
    instrument.stopAllNotes();
  };
  const handleMetronomeClick = () => {
    handleStop();
    setMetronomeOn(!metronomeOn);
    setTimeout(() => {
      handlePlay();
    }, 200);
  };

  // const GetGridCellDisplay = (sections, col) => {
  //   for (let section of sections) {
  //     const start = section.start;
  //     const end = section.end;
  //     if (col == start) return { class: styles.start, section: section };
  //     if (col == end) return { class: styles.end, section: section };
  //     if (col > start && col < end)
  //       return { class: styles.middle, section: section };
  //   }
  // };
  const renderGridCells = () => {
    const cellArray = Array.from({ length: NUM_GRIDS }, (_, index) => index);

    return (
      <>
        {cellArray.map((index) => {
          return <div>{index}</div>;
        })}
      </>
    );
  };
  const renderSections = (section) => {
    const currSection = sections[section];
    if (currSection === null) {
      return <></>;
    }
    const currInstrument = instruments[currSection.instrument];

    //console.log(currInstrument);
    return (
      <SectionMarker
        section={currSection}
        instrument={currInstrument}
        updateInstrument={updateInstrument}
        timer={counter - 1}
      />
    );
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <div className="flex flex-row w-100 ml-1 justify-center">
          <button onClick={handlePlay}>Play All</button>
          <button onClick={handleStop}>STOP</button>
          <button
            onClick={() => {
              setCounter(counter + 1);
            }}
          >
            WOOOOHOOO
          </button>
          <button
            onClick={() => {
              handleMetronomeClick();
            }}
          >
            METRONOME {metronomeOn ? "ON" : "OFF"} {metronomeOn}
          </button>
          <p>{counter}</p>
          {isPlaying ? <p>PLAYING</p> : ""}{" "}
        </div>
        <div className={styles.trackWrapper}>
          {tracks.map((track) => {
            return (
              <div
                className={styles.trackContainer}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${NUM_GRIDS},3rem)`,
                  position: "relative",
                }}
              >
                {renderGridCells()}

                {track.sections.map((section) => {
                  return renderSections(section);
                })}
                {/* {track.sections.map((section) => {
                  <div>{section.sectionId}</div>;
                })} */}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
