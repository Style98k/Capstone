export default function Textarea({ 
  label, 
  placeholder = '', 
  value, 
  onChange, 
  error,
  className = '',
  required = false,
  rows = 4,
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

