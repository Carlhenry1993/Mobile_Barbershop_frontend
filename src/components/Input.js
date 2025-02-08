export const Input = ({ type = "text", ...props }) => (
    <input
      type={type}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
      {...props}
    />
  );
  