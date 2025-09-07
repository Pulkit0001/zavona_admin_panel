import React, { useState, useEffect } from "react";
import "./PasswordInput.scss"
function PasswordInput(props: any) {
    const [viewPassword, setViewPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false)

    const passwordEye = () => {
        setViewPassword(!viewPassword);
    };

    const {
        register,
        className,
        id,
        disabled,
        name,
        password,
        isRequired,
        setPassword,
        requiredAsteriskStyle,
        label,
        required,
        placeholder,
        error,
        setError,
        clearErrors,
        passwordMessage,
        setPasswordMessage,
        isPasswordValidation,
        systemSettingInfo,
        onBlur,
        maxCharacterValidation = true,
        ...rest
    } = props;

    console.log({ error });


    const MINIMUM_CHARACTER_COUNT = systemSettingInfo?.security?.minimumCharacters || { isRequired: true, value: 8 };
    const UPPERCASE_CHARACTER_COUNT = systemSettingInfo?.security?.upperCaseCharacters || { isRequired: true, value: 1 };
    const SPECIAL_CHARACTER_COUNT = systemSettingInfo?.security?.specialCharacters || { isRequired: true, value: 1 };
    const NUMBER_CHARACTER_COUNT = systemSettingInfo?.security?.specialCharacters || { isRequired: true, value: 1 };
    const MAXIMUM_CHARACTER_COUNT = systemSettingInfo?.security?.maximumCharacters || { isRequired: true, value: 12 };

    const inputStyle = {
        paddingLeft: "1rem",
        paddingRight: "45px",
        fontSize: '16px',
        border: error
            ? '1px solid #FF0000'  // Using hex code for red
            : isFocused
                ? '1px solid #0066CC'  // Using hex code for blue
                : "1px solid var(--neutral-400)",
        outline: error ? '1px solid #FF0000' : 'none',  // Added outline for error state
    };


    const handleChangePassword = (e) => {
        setPassword(e.target.value)
        const inputPass = e.target.value;
        if (inputPass > 0) {
            clearErrors(name)
        }
        var specialCharacter = /[$&+,:;=?@#|'<>.^*()%!-]/g;
        var upperCaseRegex = /[A-Z]/g;
        var numbersRegex = /[0-9]/g;

        passwordMessage && setPasswordMessage({
            specialCharacterRegex: inputPass?.match(/[$&+,:;=?@#|'<>.^*()%!-]/g)?.length >= SPECIAL_CHARACTER_COUNT?.value,
            uppercase: inputPass?.match(/[A-Z]/g)?.length >= UPPERCASE_CHARACTER_COUNT?.value,
            number: inputPass?.match(/[0-9]/g)?.length >= NUMBER_CHARACTER_COUNT?.value,
            character: inputPass?.length >= MINIMUM_CHARACTER_COUNT.value,
            isUpperCaseAvailable: passwordMessage?.isFormSubmit ? false : true,
            isNumberAvailable: passwordMessage?.isFormSubmit ? false : true,
            isCharacterCountAvailable: passwordMessage?.isFormSubmit ? false : true,
            isSpecialCharAvailable: passwordMessage?.isFormSubmit ? false : true,
            isFormSubmit: passwordMessage?.isFormSubmit,
        });
    };


    const linkStyle = {
        fontSize: '1rem',
        borderRadius: '50px',
        color: (passwordMessage?.uppercase || (password && !passwordMessage?.uppercase)) ? 'white' : 'inherit',
        backgroundColor: passwordMessage?.uppercase ? 'var(--success-600)' : password ? 'var(--error-500)' : 'transparent',
    };
    const linkStyle2 = {
        fontSize: '1rem',
        borderRadius: '50px',
        color: (passwordMessage?.number || (password && !passwordMessage?.number)) ? 'white' : 'inherit',
        backgroundColor: passwordMessage?.number ? 'var(--success-600)' : password ? 'var(--error-500)' : 'transparent',
    }
    const linkStyle3 = {
        fontSize: '1rem',
        borderRadius: '50px',
        color: (passwordMessage?.specialCharacterRegex || (password && !passwordMessage?.specialCharacterRegex)) ? 'white' : 'inherit',
        backgroundColor: passwordMessage?.specialCharacterRegex ? 'var(--success-600)' : password ? 'var(--error-500)' : 'transparent',
    }
    const linkStyle4 = {
        fontSize: '1rem',
        borderRadius: '50px',
        color: (passwordMessage?.character || (password && !passwordMessage?.character)) ? 'white' : 'inherit',
        backgroundColor: passwordMessage?.character ? 'var(--success-600)' : password ? 'var(--error-500)' : 'transparent',
    }

    return (
        <div className={`input-password-field ${className}`}>
            <div className="flex">
                <label className="text-xs font-bold" htmlFor={id}>
                    {label}{" "}
                    {isRequired && <span className={`text-error-500 ${requiredAsteriskStyle}`} > * </span>}
                </label>
            </div>
            <div className="input-container">
                <div className="form-group ">
                    <div className="relative password-input">
                        <input
                            type={viewPassword ? "text" : "password"}
                            id={id}
                            {...register(name, {
                                required: isRequired && "Password is required",
                                onChange: handleChangePassword,
                            })}
                            style={inputStyle}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                setIsFocused(false)
                                if (onBlur) {
                                    onBlur()
                                }
                            }}
                            name={name}
                            value={password}
                            autoComplete={'new-password'}
                            placeholder={placeholder}
                            disabled={disabled}
                            maxLength={maxCharacterValidation && MAXIMUM_CHARACTER_COUNT?.value}
                        />
                        <i
                            className={
                                `${viewPassword
                                    ? "pi pi-eye password-eye-icon"
                                    : "pi pi-eye-slash password-eye-icon"}`
                            }
                            onClick={passwordEye}
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs text-start">
                        {error}
                    </p>}
                    {isPasswordValidation && <div className="mt-4">
                        <p className="text-xs font-semibold text-neutral-600">
                            {" "}
                            Password must contain at least
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {/* MINIMUM CHARACTER  */}
                            {MINIMUM_CHARACTER_COUNT?.isRequired &&
                                <div className="flex items-center mr-4">
                                    <i
                                        style={linkStyle4}
                                        alt="accessleveldisable"
                                        className={passwordMessage?.character ? 'icon-tick-circle' : password ? "icon-close-circle" : 'icon-tick-circle'}
                                    />
                                    <span className="ml-1 text-xs">{MINIMUM_CHARACTER_COUNT.value} characters</span>
                                </div>
                            }

                            {/* UPPERCASE CHARACTER */}
                            {UPPERCASE_CHARACTER_COUNT?.isRequired &&
                                <div className="flex items-center mr-4">
                                    <i
                                        style={linkStyle}
                                        alt="accessleveldisable"
                                        className={passwordMessage?.uppercase ? 'icon-tick-circle' : password ? "icon-close-circle" : 'icon-tick-circle'}
                                    />
                                    <span className="ml-1 text-xs">
                                        {UPPERCASE_CHARACTER_COUNT?.value}
                                        {UPPERCASE_CHARACTER_COUNT?.value === 1 ? " uppercase letter" : " uppercase letters"}
                                    </span>
                                </div>
                            }

                            {/* NUMBER CHARACTER */}
                            {NUMBER_CHARACTER_COUNT?.isRequired &&
                                <div className="flex items-center mr-4">
                                    <i
                                        style={linkStyle2}
                                        alt="accessleveldisable"
                                        className={passwordMessage?.number ? 'icon-tick-circle' : password ? "icon-close-circle" : 'icon-tick-circle'}
                                    />
                                    <span className="ml-1 text-xs">
                                        {NUMBER_CHARACTER_COUNT?.value}
                                        {NUMBER_CHARACTER_COUNT?.value === 1 ? " number" : " numbers"}
                                    </span>
                                </div>
                            }

                            {/* SPECIAL CHARACTER */}
                            {SPECIAL_CHARACTER_COUNT?.isRequired &&
                                <div className="flex items-center">
                                    <i
                                        style={linkStyle3}
                                        alt="accessleveldisable"
                                        className={passwordMessage?.specialCharacterRegex ? 'icon-tick-circle' : password ? "icon-close-circle" : 'icon-tick-circle'}
                                    />
                                    <span className="ml-1 text-xs">
                                        {SPECIAL_CHARACTER_COUNT?.value}
                                        {SPECIAL_CHARACTER_COUNT?.value === 1 ? " special character" : " special characters"}
                                    </span>
                                </div>}

                        </div>
                    </div>}
                </div>
            </div>

        </div>
    );
}

export default PasswordInput;
