import React from 'react';
import './TextAreaField.css';

interface TextAreaFieldProps {
  label?: string;
  name: string;
  register: any;
  error?: string;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoFocus?: boolean;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setValue:any
  setError:any
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  register,
  error,
  isRequired = false,
  placeholder = "Enter text here...",
  disabled = false,
  className = "",
  rows = 3,
  maxLength,
  resize = 'none',
  autoFocus = false,
  onBlur,
  onChange,
  setValue,
  setError
}) => {
  const textareaClasses = `
    textarea-field
    w-full
    p-3
    border
    rounded-lg
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
      : 'border-[var(--warning-primary)] focus:border-emerald-500 focus:ring-emerald-200'
    }
    ${disabled 
      ? 'bg-white text-gray-500 cursor-not-allowed' 
      : 'bg-[var(--warning-gradient)] text-gray-900'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const resizeClass = {
    'none': 'resize-none',
    'both': 'resize',
    'horizontal': 'resize-x',
    'vertical': 'resize-y'
  }[resize];

  const handleChange = (e: any) => {
    onChange && onChange(e);
    if (e?.target?.value) {
      setValue(name, e?.target?.value?.trimStart());
      setError(name, undefined); // clear error if any
    } else {
      setError(name, { type: 'manual', message: 'description is required' });
    }
  };

  return (
    <div className="textarea-field-container">
      {label && (
        <label 
          htmlFor={name}
          className="font-medium text-xs mb-2 block text-dark-900"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className={`${textareaClasses} ${resizeClass}`}
          onBlur={onBlur}
          onChange={handleChange}
        />
        
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {/* Character count could be added here if needed */}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
      
      {maxLength && (
        <p className="text-gray-400 text-xs mt-1">
          Maximum {maxLength} characters allowed
        </p>
      )}
    </div>
  );
};

export default TextAreaField;
