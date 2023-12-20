import { useState } from "react";

import styles from "../src/styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../utils/uiUtils";

const AddTrackOptionsModule = ({
  addTrack,
  closeModule,
  createNewInstrument,
  currTrackLen,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    instrument: "",
    color: "",
  });
  const [loadingSamples, setLoadingSamples] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCloseModule = () => {
    closeModule();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data if needed
    // Call the addTrack function with the form data
    const trackId = currTrackLen + 1;

    setLoadingSamples(true);
    const newInstrument = await createNewInstrument(
      trackId,
      formData.instrument,
      formData.name
    );
    setLoadingSamples(false);
    addTrack(trackId, newInstrument, formData.color);
    // Optionally, reset the form after submission
    setFormData({
      name: "",
      instrument: "",
      color: "",
    });
    closeModule();
  };

  return (
    <div className={styles.module}>
      <div className="flex flex-end">
        <button onClick={closeModule}>
          <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
        </button>
      </div>
      {loadingSamples && <div>HELPING LOAD</div>}
      <div className="ps-2 font-normal ">
        <h1>Add a track</h1>
        <form className="flex flex-col gap-s" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Instrument:
            <select
              name="instrument"
              value={formData.instrument}
              onChange={handleInputChange}
            >
              <option value="">Select an instrument</option>
              <option value="drums">Drums</option>
              <option value="synth">Synth</option>
            </select>
          </label>
          <br />
          <label>
            Color:
            <select
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            >
              <option value="">Select a color</option>
              <option value={colors.yellow}>Yellow</option>
              <option value={colors.pink}>Pink</option>
              <option value={colors.blue}>Blue</option>
            </select>
            {formData.color && (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: formData.color,
                  display: "inline-block",
                  marginLeft: "10px",
                }}
              ></div>
            )}
          </label>
          <br />
          <div className="flex justify-around ">
            <button type="submit">Add</button>
            <button onClick={closeModule}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrackOptionsModule;
