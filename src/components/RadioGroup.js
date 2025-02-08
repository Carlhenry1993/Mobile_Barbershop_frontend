export const RadioGroup = ({ children }) => <div>{children}</div>;
export const RadioGroupItem = ({ id, value, ...props }) => (
  <div>
    <input type="radio" id={id} value={value} {...props} />
  </div>
);
