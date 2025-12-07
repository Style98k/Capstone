export default function Input({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error,
  className = '',
  required = false,
  leftIcon: LeftIcon,
  rightElement,
  ...props 
}) {
  const hasLeftIcon = Boolean(LeftIcon)
  const hasRightElement = Boolean(rightElement)

  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
            hasLeftIcon ? 'pl-10' : ''
          } ${hasRightElement ? 'pr-10' : ''} ${className}`}
          required={required}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

