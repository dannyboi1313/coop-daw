const ControlGroup = ({ label, children }) => (
  <fieldset>
    <legend>{label}</legend>
    {children}
  </fieldset>
);
export default ControlGroup;
