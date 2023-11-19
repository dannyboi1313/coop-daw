import styles from "@/styles/NoteGrid.module.css";
import { useState } from "react";
import Grid from "./Grid";

const NoteGrid = ({ notes, updateNotes, timer }) => {
  const renderGrid = () => {
    return (
      <div className={styles.grid}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className={styles.gridRow}>
              {row.map((col, colIndex) => {
                return (
                  <div
                    key={colIndex}
                    className={`${styles.gridPoint} ${
                      col == 1 ? styles.green : styles.grey
                    }`}
                  >
                    {col}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.notePage}>
      <div>Title stuff</div>
      <div>
        Keyboard Juice
        <div>SideKeys</div>
        {/* <div>{renderGrid()}</div> */}
        <Grid instrumentNotes={notes} updateNotes={updateNotes} timer={timer} />
      </div>
    </div>
  );
};
export default NoteGrid;
