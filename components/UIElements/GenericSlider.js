const GenericSlider = ({ label, belowLabel, ...options }) => {
  return (
    <label className="generic-slider">
      {label && <span className="sidelabel">{label}</span>}
      <div>
        <input type="range" min="0" max="1" step="0.01" {...options} />
        {belowLabel && <span className="sublabel">{belowLabel}</span>}
      </div>
    </label>
  );
};

export default GenericSlider;
