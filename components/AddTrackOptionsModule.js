import { useState } from "react";

import styles from "../src/styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../utils/uiUtils";

const AddTrackOptionsModule = ({ addTrack }) => {
  const [formData, setFormData] = useState({
    name: "",
    instrument: "",
    color: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data if needed
    // Call the addTrack function with the form data
    addTrack(formData);
    // Optionally, reset the form after submission
    setFormData({
      name: "",
      instrument: "",
      color: "",
    });
  };

  return (
    <div className={styles.module}>
      <div className="flex flex-end">
        <button>
          <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
        </button>
      </div>
      <div className="ps-2 font-normal flex flex-col gap-1">
        <h1>Add a track</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddTrackOptionsModule;
