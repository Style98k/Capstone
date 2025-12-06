export default function Input({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error,
  className = '',
  required = false,
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

