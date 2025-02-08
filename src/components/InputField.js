const InputField = ({
    label,
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    error = "",
    required = false,
    disabled = false,
}) => (
    <div className="mb-4">
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
        >
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            aria-label={label}
            aria-invalid={!!error}
            className={`mt-1 block w-full border ${
                error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            } rounded-md shadow-sm sm:text-sm ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
        />
        {error && (
            <p className="mt-1 text-sm text-red-500" role="alert">
                {error}
            </p>
        )}
    </div>
);

export default InputField;
