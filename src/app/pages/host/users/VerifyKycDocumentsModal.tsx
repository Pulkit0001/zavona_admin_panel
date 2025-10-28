import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { handleErrorMessage } from '../../../../utils/helper.utils';
import { useToast } from '../../../components/common/useToast';
import InputField from '../../../components/common/input-field/InputField';
import DangerButton from '../../../components/common/danger-button/DangerButton';
import SuccessButton from '../../../components/common/success-button/SuccessButton';
import SecondaryButton from '../../../components/common/secondary-button/SecondaryButton';
import { Divider } from 'primereact/divider';
import { Status } from '../../../../data/status.enum';
import { updateUser } from '../../../../services/user.service';

interface ProfileModalProps {
    visible: boolean;
    onHide: () => void;
    selectedUser: any;
    setUserDetails: (data: any) => void;
}

interface InputFields {
    kycRemarks: string;
}

const enum parkingType {
    VERIFIED = "Verify",
    REJECTED = "Reject",
}

let validations = {} as any
const VerifyKycDocumentsModal: React.FC<ProfileModalProps> = ({ visible, onHide, selectedUser, setUserDetails }) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputFields>({
        mode: "all",
        defaultValues: {
            kycRemarks: '',
        },
        resolver: yupResolver(yup.object().shape(validations)) as any
    });

    if (selectedUser?.type === parkingType.REJECTED) {
        validations = {
            kycRemarks: yup.string().required('Reason is required')
        }
    }

    const handleVerifyRejectKyc = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                kycStatus: selectedUser?.type == parkingType.VERIFIED ? Status.VERIFIED : Status.REJECTED
            } as any
            if (selectedUser?.type === parkingType.REJECTED) {
                payload['kycRemarks'] = data?.kycRemarks
            }
            const apiRes: any = await updateUser(selectedUser?.id, payload);


            if (apiRes) {
                setUserDetails((prev:any) => {
                    return {
                        ...prev,
                            kycStatus: selectedUser?.type == parkingType.VERIFIED ? Status.VERIFIED : Status.REJECTED,
                    }
                })
                useToast("success", `Documents ${selectedUser?.type == parkingType.VERIFIED ? Status.VERIFIED : Status.REJECTED} successfully`, "", 3000);
                onHide();
            }

        }
        catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);

        } finally {
            setLoading(false)
            reset()
        }

    };

    return (
        <Dialog header="Kyc Verification" visible={visible} style={{ width: '400px' }} onHide={onHide}>
            <form className="flex flex-col " onSubmit={handleSubmit(handleVerifyRejectKyc)}>
                <Divider />
                <div className="flex flex-col gap-4 px-4 
                ">
                    {selectedUser?.type === parkingType.VERIFIED &&
                        <div className="">
                            Are you sure you want to verify these Documents?
                        </div>}
                    {selectedUser?.type === parkingType.REJECTED && <div className="w-full">
                        <InputField
                            label="Reason for reject"
                            name='kycRemarks'
                            register={register}
                            isRequired={true}
                            error={errors?.kycRemarks?.message}
                            placeholder="Enter rejection reason"
                        />
                    </div>}
                </div>
                <Divider />
                <div className="flex justify-end w-full gap-2 px-6 py-4">
                    <SecondaryButton disabled={loading} label="Cancel" type="button" onClick={onHide} />
                    {selectedUser?.type === parkingType.VERIFIED ? <SuccessButton disabled={loading} loading={loading} label="Verify" type="submit" /> :
                        <DangerButton disabled={loading} loading={loading} label="Reject" type="submit" />
                    }
                </div>
            </form>
        </Dialog>
    );
};

export default VerifyKycDocumentsModal;
