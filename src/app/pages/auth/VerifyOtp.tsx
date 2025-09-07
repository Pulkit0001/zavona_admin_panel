import { InputOtp } from "primereact/inputotp";
import React, { useState } from "react";
import PrimaryButton from "../../components/common/primary-button/PrimaryButton";
import { verifyOtp } from "../../../services/login.service";
import { useToast } from "../../components/common/useToast";
import { handleErrorMessage, setCookie } from "../../../utils/helper.utils";
import { useNavigate } from "react-router-dom";

const VerifyOtp = (props: any) => {
        const navigate = useNavigate();
    
    const { userInfo } = props;
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);

    const handleVerifyOtp = async () => {
        if (String(otp)?.length != 6) {
            setErrorMessage(true);
            return
        }
        try {
            const payload = {
                identifier: userInfo?.email,
                otpCode: otp,
                purpose: "login"
            }
            const apiRes: any = await verifyOtp(payload);
            if (apiRes?.success) {
                useToast('success', "Login successfully", '', 3000);
                setCookie('token', apiRes?.data?.token);
                navigate('/dashboard');
            }
        } catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const inputs = document.querySelectorAll('.p-inputotp input') as any;
            if (inputs.length > 0) {
                inputs[0]?.focus();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [userInfo])

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2">
                <p className="text-2xl font-semibold">Authenticate your account</p>
                <p className="text-sm font-normal">Please enter the 6 digit code sent to your {userInfo?.email}</p>
                <h2 className="text-sm font-semibold ">Enter the 6 digit code</h2>
            </div>
            <div className={`otp-input-container flex mt-4 w-full ${(errorMessage ? "otp-input-validation-error" : "")}`}>
                <InputOtp
                    value={otp}
                    name="otpFields"
                    onChange={(e: any) => setOtp(e?.value)} length={6}
                    // disabled={isOtpverify?.email}
                    integerOnly />
            </div>
            <div className="mt-4">
                <PrimaryButton label="Verify" onClick={handleVerifyOtp} className="w-full" />
            </div>
        </div>
    );
};

export default VerifyOtp;
