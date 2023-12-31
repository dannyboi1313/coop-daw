import { useState, useEffect } from "react";
import styles from "@/styles/NoteGrid.module.css";
import { mapRowToKey, getNoteCount } from "../utils/keyboardUtils";

const MIN_NOTE_SIZE = 1;
const NUM_KEYS = 72;
const DEFAULT_NOTE_SIZE = 3;

const NoteGrid = ({ instrumentNotes, updateNotes, timer, instrumentID }) => {
  //console.log("Rendering grid with id ", instrumentID);
  const [gridSize, setGridSize] = useState(80);

  const [grid, setGrid] = useState(() => {
    const newArray = new Array(NUM_KEYS);
    for (let i = 0; i < NUM_KEYS; i++) {
      newArray[i] = new Array(gridSize).fill(null);
    }
    return newArray;
  }); // Grid state
  const [notes, setNotes] = useState(new Map(instrumentNotes));
  const [noteCount, setNoteCount] = useState(instrumentNotes.length);

  const [rendered, setRendered] = useState(false);
  const [draggingNote, setDraggingNote] = useState(null);
  const [expandRightNote, setExpandRightNote] = useState(null);

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    updateGrid();
  }, [notes, draggingNote, expandRightNote]);

  const handleGridClick = (row, col, cell) => {
    if (cell !== null) {
      return;
    }
    //Add a new note
    const currNotes = notes;
    const start = col;
    const end = start + DEFAULT_NOTE_SIZE;
    const id = currNotes.size + 1;
    const newNote = { id: id, row: row, start: start, end: end };
    currNotes.set(id, newNote);

    setNotes(currNotes);
    updateGrid();
    //Add a note == 0 action
    updateNotes(newNote, 0, gridSize, instrumentID);
  };

  const initializeGrid = () => {
    //Update grid with rectangles
    const newGrid = grid;

    for (let value of notes.values()) {
      //   console.log("val", value);
      newGrid[value.row][value.start] = value;
      newGrid[value.row][value.end] = value;

      for (let i = value.start + 1; i <= value.end - 1; i++) {
        newGrid[value.row][i] = value;
      }
    }

    // console.log("Updated", newGrid);

    setGrid([...newGrid]);
  };

  const updateGrid = () => {
    initializeGrid();
    // updateNotes(notes, gridSize, instrumentID);
  };

  const handleNoteClick = (row, col, note) => {
    // Start dragging the not
    if (note && expandRightNote === null) {
      setDraggingNote({ note: note, clickX: row, clickY: col });
    }
  };

  const handleNoteExpand = (direction, row, col, note) => {
    // Start dragging the note

    if (note) {
      setExpandRightNote({ note: note, clickX: row, clickY: col });
    }
  };

  const handleGridDrag = (row, col) => {
    if (draggingNote) {
      if (draggingNote.clickX == row && draggingNote.clickY == col) return;
      if (grid[row][col] !== null) return;

      const note = draggingNote.note;
      //Delete old imprint of note in grid
      for (let i = note.start; i <= note.end; i++) {
        grid[note.row][i] = null;
      }

      const oldId = note.id;
      const length = note.end - note.start;

      const id = oldId;
      const updatedNote = { id: id, row: row, start: col, end: col + length };
      const newNotes = notes;

      //newNotes.delete(oldId);
      newNotes.set(id, updatedNote);
      setDraggingNote({ note: updatedNote, clickX: row, clickY: col });

      setNotes(newNotes);
    } else if (expandRightNote) {
      if (expandRightNote.clickX == row && expandRightNote.clickY == col)
        return;
      if (
        grid[row][col] !== null &&
        grid[row][col].id !== expandRightNote.note.id
      )
        return;

      if (col < expandRightNote.note.start + MIN_NOTE_SIZE - 1) return;

      const note = expandRightNote.note;
      const oldRow = note.row;
      const oldStart = note.start;
      const oldId = note.id;

      //Delete old imprint of note in grid
      deleteNoteOnGrid(oldStart, note.end, oldRow);

      const id = oldId;
      const updatedNote = {
        id: id,
        row: oldRow,
        start: oldStart,
        end: col,
      };
      const newNotes = notes;

      //newNotes.delete(oldId);
      newNotes.set(id, updatedNote);
      setExpandRightNote({ note: updatedNote, clickX: oldRow, clickY: col });
      //   if (gridSize - updatedNote.end > 3) {
      //     setGridSize(gridSize + 2);
      //   }
      setNotes(newNotes);
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
      const updatedNotes = notes;
      deleteNoteOnGrid(noteToDelete.start, noteToDelete.end, noteToDelete.row);
      updateNotes(noteToDelete, 1, gridSize, instrumentID);
      updatedNotes.delete(note.id);
      setNotes(updatedNotes);
    }
  };
  const handleGridRelease = () => {
    // Stop dragging the note
    if (draggingNote) {
      const editedNote = notes.get(draggingNote.note.id);
      updateNotes(editedNote, 2, gridSize, instrumentID);
    }
    if (expandRightNote) {
      const editedNote = notes.get(expandRightNote.note.id);
      updateNotes(editedNote, 2, gridSize, instrumentID);
    }
    setDraggingNote(null);
    setExpandRightNote(null);
  };
  const getPosition = (cell, col) => {
    if (cell.start == col) return styles.start;
    if (cell.end == col) return styles.end;
    return styles.middle;
  };

  const getGridTick = (idx) => {
    if (idx % 16 === 0) {
      return styles.borderThick;
    } else if (idx % 4 === 0) {
      return styles.borderNormal;
    } else {
      return styles.borderThin;
    }
  };
  return (
    <div className={styles.gridWrapper} onContextMenu={handleGridRightClick}>
      <div className={styles.gridContainer}>
        <div
          className={`${styles.headerRow}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1rem)`,
            gridTemplateRows: `repeat(1, 2rem)`,
          }}
        >
          {grid[0].map((e, index) => {
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

        {/* Render the grid */}

        <div className={styles.gridVert}>
          <div
            className={styles.leftColumn}
            style={{
              gridTemplateRows: `repeat(${NUM_KEYS}, 1rem)`,
              gridTemplateColumns: `repeat(1,8rem)`,
            }}
          >
            {/* Render the row labels */}

            {grid.map((row, rowIndex) => (
              <div
                key={`row-label-${rowIndex}`}
                className={`${styles.rowLabel} ${
                  mapRowToKey(rowIndex)[1] == "#"
                    ? styles.sharpOuter
                    : styles.white
                }`}
              >
                {mapRowToKey(rowIndex)[1] == "#" && (
                  <div className={styles.sharpInner}></div>
                )}
                {mapRowToKey(rowIndex)[1] !== "#" && mapRowToKey(rowIndex)}
              </div>
            ))}
          </div>

          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1rem)`,
              gridTemplateRows: `repeat(${NUM_KEYS}, 1rem)`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.gridCell} ${getGridTick(colIndex)} ${
                    cell !== null && styles.disabled
                  }`}
                  onClick={() => handleGridClick(rowIndex, colIndex, cell)}
                  onMouseUp={handleGridRelease}
                  onMouseMove={() => handleGridDrag(rowIndex, colIndex)}
                >
                  {cell !== null && (
                    <div
                      className={`${styles.selected} ${getPosition(cell,colIndex)}`} //prettier-ignore
                      onMouseDown={() => handleNoteClick(rowIndex, colIndex, cell)} //prettier-ignore
                      onContextMenu={() => { handleNoteDelete(cell);}} //prettier-ignore
                    ></div>
                  )}
                  {cell && cell.end === colIndex && (
                    <div
                      className={`${styles.dragBox} ${styles.end}`}
                      onMouseDown={() =>
                        handleNoteExpand("right", rowIndex, colIndex, cell)
                      }
                    ></div>
                  )}
                  {cell && cell.start === colIndex && (
                    <div
                      className={`${styles.dragBoxLeft} ${styles.start}`}
                      onMouseDown={() =>
                        handleNoteExpand("left", rowIndex, colIndex, cell)
                      }
                    ></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteGrid;
