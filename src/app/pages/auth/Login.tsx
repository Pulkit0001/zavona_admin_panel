import React, { use, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import InputField from '../../components/common/input-field/InputField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import PrimaryButton from '../../components/common/primary-button/PrimaryButton';
import PasswordInput from '../../components/common/password-input/PasswordInput';
import { sendOtp } from '../../../services/login.service';
import { handleErrorMessage, setCookie } from '../../../utils/helper.utils';
import { useNavigate } from 'react-router-dom';
import { InputOtp } from 'primereact/inputotp';
import VerifyOtp from './VerifyOtp';
import { useToast } from '../../components/common/useToast';
import logo from '../../../assets/Vector.png';
import banner from '../../../assets/main_page.png';


interface loginPropTypes {
    email: any,
    loginType: string
}

const Login = () => {
    const [userInfo, setUserInfo] = useState<loginPropTypes>({
        email: "",
        loginType: ""
    });
    const [loading, setLoading] = useState(false);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        getValues,
        clearErrors,
        setValue,
        trigger,
        control
    } = useForm<loginPropTypes>({
        mode: "all",
        defaultValues: {},
        resolver: yupResolver(
            yup.object().shape({})
        ) as any
    });

    const handleLogin: SubmitHandler<loginPropTypes> = async (data: any) => {
        // Handle login logic here
        const { email } = data;
        let payload = {
            purpose: "login",
            userType: "Admin"
        } as any

        if (!email) {
            setError('email', {
                type: 'manual',
                message: 'Please enter valid email or phone number'
            });
            return;
        }

        const input = String(email).trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phoneRegex = /^\+?[0-9]{10,15}$/;

        // First check if it's a valid email
        if (emailRegex.test(input)) {
            payload.identifierType = "email";
            payload.identifier = input;
            setUserInfo({
                ...userInfo,
                loginType: "email"
            });
        }
        // If not email, check if it's a valid phone number
        else if (phoneRegex.test(input)) {
            payload.identifierType = "mobile";
            payload.identifier = input;
            setUserInfo({
                ...userInfo,
                loginType: "phone"
            });
        }
        // If neither email nor phone number
        else {
            setError('email', {
                type: 'manual',
                message: input.includes('@') ? 'Please enter a valid email' : 'Please enter a valid phone number'
            });
            return;
        }

        try {
            setLoading(true);
            const apiRes: any = await sendOtp(payload);
            if (apiRes?.success) {
                useToast('success', apiRes?.message, '', 3000);
                setUserInfo({
                    ...userInfo,
                    email: payload.identifier
                });
            }
        } catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex flex-col lg:flex-row h-screen w-full">
            {/* Image section - Top on mobile/tablet, Left on desktop */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-gray-100 flex-shrink-0">
                <div className='flex items-center justify-center h-full banner-image-gradient'>
                    <img
                        src={banner}
                        alt="Login Background"
                        className="  object-cover"
                    />
                </div>

            </div>

            {/* Form section - Bottom on mobile/tablet, Right on desktop */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto text-neutral-900">
                <div className="flex min-h-full flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
                    <div className='pb-12 flex justify-center items-center'>
                        <img
                            src={logo}
                            alt="Zavona Logo"
                            className={"w-72"}
                        />
                    </div>
                    <div className="w-full max-w-md space-y-4 lg:space-y-6 mx-auto">
                        {!userInfo?.email && <div>
                            <h2 className="text-3xl font-semibold text-neutral-900">Login</h2>
                            <p className="mt-1 text-sm text-neutral-primary">Welcome back! Login with your credentials</p>
                        </div>}

                        {!userInfo?.email ? <form onSubmit={handleSubmit(handleLogin)} className="space-y-3 lg:space-y-4">
                            <div className="space-y-3 lg:space-y-4">
                                <div>
                                    <InputField
                                        label="Email or Phone Number"
                                        name='email'
                                        register={register}
                                        placeholder='Enter your email or phone number'
                                        isRequired={true}
                                        error={errors?.email?.message}
                                    />
                                </div>
                                {/* <div>
                                    <PasswordInput
                                        register={register}
                                        className="w-full text-neutral-primary"
                                        label="Password"
                                        id="password"
                                        name="password"
                                        isRequired={true}
                                        placeholder="Enter your password"
                                        password={password}
                                        setPassword={setPassword}
                                        setError={setError}
                                        clearErrors={clearErrors}
                                        error={errors.password?.message}
                                    />
                                </div> */}

                            </div>

                            {/* <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => setChecked(e.checked ?? false)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-600">Remember me</label>
                                </div>
                                <a href="/forgot-password" className="text-sm text-blue-600">
                                    Forgot password?
                                </a>
                            </div> */}
                            <PrimaryButton label="Login" type="submit" disabled={loading} className="w-full" />
                        </form> : <VerifyOtp userInfo={userInfo} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login
