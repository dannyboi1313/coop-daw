import GenericSlider from "./GenericSlider";

const PotSlider = ({ param, label, belowLabel, useSynthParam }) => {
  const [val, setVal] = useSynthParam(param);

  return <GenericSlider label={label} value={val} onInput={setVal} />;
};
export default PotSlider;
