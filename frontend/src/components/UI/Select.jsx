export default function Select({ 
  label, 
  options = [], 
  value, 
  onChange, 
  error,
  className = '',
  required = false,
  placeholder = 'Select...',
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

