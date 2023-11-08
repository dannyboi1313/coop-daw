import GenericSlider from "./GenericSlider";

const SwitchSlider = ({ param, label, belowLabels, useSynthParam }) => {
  const [val, setVal] = useSynthParam(param);

  return (
    <GenericSlider
      label={label}
      belowLabel={belowLabels.join(" - ")}
      value={val}
      max={belowLabels.length - 1}
      step={1}
      onInput={setVal}
    />
  );
};
export default SwitchSlider;
