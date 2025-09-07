import { InputText } from "primereact/inputtext";
import './InputField.css';

const InputField = (props: any) => {
  const { label, error, name, register, isRequired, placeholder, disabled = false , className , onChange} = props;
  
  return <div>
    {label && <div className={`font-medium text-xs ${label && 'mb-2'} text-start`}>{label} {isRequired && '*'}</div>}
    <InputText
      {...(register && { ...register(name)})}
      placeholder={placeholder}
      className={`input-field ${error ? 'error' : ''} ${className || ''}`}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e)}
    />
    {error && (
      <p className="text-red-500 text-xs text-start">
        {error}
      </p>
    )}
  </div>
}

export default InputField;