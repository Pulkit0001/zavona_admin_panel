import { Dropdown } from "primereact/dropdown";
import React from "react";

const CustomDropdown = (props: any) => {
    const {
        label,
        error,
        isRequired,
        name,
        options,
        setValue,
        placeholder,
        onChange,
        disabled = false,
        selectedOption,
        optionLabel,
        id,
        clearError,
    } = props;

    const [selectedValue, setSelectedValue] = React.useState(null) as any
    const handleOnChange = (e: any) => {
        onChange && onChange(e)
        setSelectedValue(e?.value)
        setValue(name, e?.value);
        e?.value && clearError(name)
    }

    React.useEffect(() => {
        if (selectedOption) {
            setSelectedValue(selectedOption)
            setValue(name, selectedOption);
            clearError(name)
        }
    }, [selectedOption])

    return <div>
        <div className="font-medium text-xs mb-2">{label} {label && isRequired && '*'}</div>
        <Dropdown
            value={selectedValue}
            id={id}
            optionLabel={optionLabel}
            onChange={handleOnChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            className={`bg-[#F4F4F5] border ${error ? '!border-error-primary' : 'border-[#E6E6E7] '}  focus:outline-none text-xs`}
        />
        {error && (
            <p className="text-error-primary text-xs">
                {error}
            </p>
        )}
    </div>
}

export default CustomDropdown;