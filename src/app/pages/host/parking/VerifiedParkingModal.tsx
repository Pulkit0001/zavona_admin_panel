import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { handleErrorMessage } from '../../../../utils/helper.utils';
import { updateParking } from '../../../../services/parking.service';
import { useToast } from '../../../components/common/useToast';
import InputField from '../../../components/common/input-field/InputField';
import DangerButton from '../../../components/common/danger-button/DangerButton';
import SuccessButton from '../../../components/common/success-button/SuccessButton';
import SecondaryButton from '../../../components/common/secondary-button/SecondaryButton';
import { Divider } from 'primereact/divider';
import { Status } from '../../../../data/status.enum';

interface ProfileModalProps {
    visible: boolean;
    onHide: () => void;
    selectedParking: any;
    parkingList: any;
    setParkingList: (data: any) => void;
}

interface InputFields {
    parkingVerificationRemarks: string;
}

const enum parkingType {
    VERIFIED = "Verify",
    REJECTED = "Reject",
}

let validations = {} as any
const VerifyParkingModal: React.FC<ProfileModalProps> = ({ visible, onHide, selectedParking, parkingList, setParkingList }) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputFields>({
        mode: "all",
        defaultValues: {
            parkingVerificationRemarks: '',
        },
        resolver: yupResolver( yup.object().shape(validations)) as any
    });

    if (selectedParking?.type === parkingType.REJECTED) {
        validations = {
            parkingVerificationRemarks: yup.string().required('Reason is required')
        }
    }

    const handleVerifyRejectParking = async (data: any) => {
        try {
            setLoading(true);       
            const payload = {
                parkingVerificationStatus: selectedParking?.type == parkingType.VERIFIED ? Status.VERIFIED : Status.REJECTED
            } as any
            if (selectedParking?.type === parkingType.REJECTED) {
                    payload['parkingVerificationRemarks'] = data?.parkingVerificationRemarks
                }
                const apiRes: any = await updateParking(selectedParking?.id, payload);
                if (apiRes?.message) {
                    let updatedData: any = parkingList?.map((user: any) => {
                        if (user?.id === selectedParking?.id) {
                            return {
                                ...user,
                                status: selectedParking?.type == parkingType.VERIFIED ? Status.VERIFIED : Status.REJECTED,
                                parkingVerificationStatus: selectedParking?.type == parkingType.VERIFIED ? Status.VERIFIED : Status.REJECTED,
                            }
                        }
                        return user;
                    });
                    setParkingList(updatedData);
                    useToast("success" , apiRes?.message , "" , 3000);
                    onHide();
                }
            
        }
        catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);

        } finally {
            setLoading(false);
            reset()
        }

    };

    return (
        <Dialog header="Parking Verification" visible={visible} style={{ width: '400px' }} onHide={onHide}>
            <form className="flex flex-col " onSubmit={handleSubmit(handleVerifyRejectParking)}>
                <Divider/>
                 <div className="flex flex-col gap-4 px-4 py-4">
                {selectedParking?.type === parkingType.VERIFIED &&
                    <div className="">
                        Are you sure you want to verify this parking?
                    </div>}
                {selectedParking?.type === parkingType.REJECTED && <div className="w-full">
                    <InputField
                        label="Reason for reject"
                        name='parkingVerificationRemarks'
                        register={register}
                        isRequired={true}
                        error={errors?.parkingVerificationRemarks?.message}
                        placeholder="Enter rejection reason"
                    />
                </div>}
                </div>
                <Divider/>
                 <div className="flex justify-end w-full gap-2 px-6 py-4">
                    <SecondaryButton disabled={loading} label="Cancel" type="button" onClick={onHide} />
                    {selectedParking?.type === parkingType.VERIFIED ? <SuccessButton disabled={loading} loading={loading} label="Verify" type="submit"  /> :
                        <DangerButton disabled={loading} loading={loading} label="Reject" type="submit" />
                    }
                </div>
            </form>
        </Dialog>
    );
};

export default VerifyParkingModal;
