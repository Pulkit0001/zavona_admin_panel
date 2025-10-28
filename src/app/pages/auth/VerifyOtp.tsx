import { InputOtp } from "primereact/inputotp";
import React, { useState } from "react";
import PrimaryButton from "../../components/common/primary-button/PrimaryButton";
import { verifyOtp } from "../../../services/login.service";
import { useToast } from "../../components/common/useToast";
import { handleErrorMessage, setCookie } from "../../../utils/helper.utils";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../../services/user.service";

const VerifyOtp = (props: any) => {
    const navigate = useNavigate();
    const { userInfo } = props;
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleVerifyOtp = async () => {
        setLoading(true);
        if (String(otp)?.length != 6) {
            setErrorMessage(true);
            return
        }
        try {
            const payload = {
                identifier: userInfo?.email,
                otpCode: otp,
                purpose: "login",
                userType: "admin"
            }
            const apiRes: any = await verifyOtp(payload);
            if (apiRes?.success) {
                if (apiRes?.data?.isNewUser) {
                    useToast('error', "Invalid email or password", '', 3000);
                    navigate('/login');
                    return
                }
                useToast('success', "Login successfully", '', 3000);
                setCookie('token', apiRes?.data?.token);
                const userApiRes: any = await getUserProfile();
                if (userApiRes?.success) {
                    setCookie("userInfo", userApiRes?.data)
                }
                navigate('/dashboard');
            }
        } catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);
        }
        finally {
            setLoading(false);
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
                <p className="text-3xl font-semibold">Authenticate your account</p>
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
                <PrimaryButton label="Verify" onClick={handleVerifyOtp} className="w-full" disabled={loading} />
            </div>
        </div>
    );
};

export default VerifyOtp;
