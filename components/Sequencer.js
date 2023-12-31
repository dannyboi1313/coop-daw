import { useState, useEffect } from "react";
import styles from "@/styles/Sequencer.module.css";
import { mapRowToKey, getNoteCount } from "../utils/keyboardUtils";

const MIN_NOTE_SIZE = 1;
const NUM_KEYS = 4;
const DEFAULT_NOTE_SIZE = 3;

const Sequencer = ({ instrumentNotes, updateNotes, timer, instrumentID }) => {
  const [gridSize, setGridSize] = useState(16);

  const [grid, setGrid] = useState(() => {
    const newArray = new Array(NUM_KEYS);
    for (let i = 0; i < NUM_KEYS; i++) {
      newArray[i] = new Array(gridSize).fill(null);
    }
    return newArray;
  }); // Grid state

  const [pads, setPads] = useState(null);
  const [notes, setNotes] = useState(instrumentNotes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const pads = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    for (let value of notes.values()) {
      //   console.log("val", value);
      pads[value.row][value.start] = 1;
    }
    setPads(pads);
    console.log("Rendering seq with these notes", notes);
    setLoading(false);
  }, []);

  useEffect(() => {}, [pads]);

  if (loading) {
    return <div>Laoding</div>;
  }

  const initializePads = () => {};

  //   useEffect(() => {
  //     updateGrid();
  //   }, [notes]);

  const handleGridClick = (row, col, cell) => {
    const padsCopy = [...pads];
    const id = `${row}${col}`;
    const newNote = { id: id, row: row, start: col };

    const notesCopy = notes;
    if (cell === 1) {
      padsCopy[row][col] = 0;
      notesCopy.delete(id);
      updateNotes(newNote, 1, gridSize, instrumentID);
    } else {
      padsCopy[row][col] = 1;
      notesCopy.set(id, newNote);
      updateNotes(newNote, 0, gridSize, instrumentID);
    }
    //setNotes(notesCopy);
    setPads(padsCopy);
    //updateNotes(notesCopy, gridSize, instrumentID);
  };

  const updateGrid = () => {
    //Update grid with rectangles
    const newGrid = grid;
  };

  const handleNoteClick = (row, col, note) => {
    // Start dragging the not
    if (note && expandRightNote === null) {
      console.log("setting drag", note);
      setDraggingNote({ note: note, clickX: row, clickY: col });
    }
  };

  const deleteNoteOnGrid = (start, end, row) => {
    for (let i = start; i <= end + 1; i++) {
      grid[row][i] = null;
    }
  };
  const handleGridRightClick = (event) => {
    event.preventDefault();
  };
  const handleNoteDelete = (note) => {
    const noteToDelete = notes.get(note.id);
    if (noteToDelete !== null) {
      const updateNotes = notes;
      deleteNoteOnGrid(noteToDelete.start, noteToDelete.end, noteToDelete.row);
      updateNotes.delete(note.id);
      setNotes(updateNotes);
    }
  };

  return (
    <div className={styles.gridWrapper} onContextMenu={handleGridRightClick}>
      <div className={styles.gridContainer}>
        {/* Render the grid */}
        <div
          className={styles.leftColumn}
          style={{
            gridTemplateRows: `repeat(${NUM_KEYS}, 6rem)`,
            gridTemplateColumns: `repeat(1,4rem)`,
          }}
        >
          {/* Render the row labels */}
          <div key={`row-label-start`} className="">
            Row Header
          </div>
          {grid.map((row, rowIndex) => (
            <div
              key={`row-label-${rowIndex}`}
              className={`${styles.rowLabel} `}
            ></div>
          ))}
        </div>

        <div className="flex flex-col w-100 h-100 ps-1">
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(10px, 1fr))`,
              gridTemplateRows: `repeat(1, 2rem)`,
            }}
          >
            {pads[0].map((e, index) => {
              return (
                <div
                  className={`${styles.gridHeaderCell} ${
                    index === timer && styles.highlighted
                  }`}
                >
                  {index % 16 === 0 && index / 16 + (index % 16)}
                </div>
              );
            })}
          </div>

          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(30px, 40px))`,
              gridTemplateRows: `repeat(${NUM_KEYS}, minmax(40px, 40px))`,
            }}
          >
            {pads.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.pad} ${cell === 1 && styles.selected} `}
                  onClick={() => handleGridClick(rowIndex, colIndex, cell)}
                ></div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sequencer;
