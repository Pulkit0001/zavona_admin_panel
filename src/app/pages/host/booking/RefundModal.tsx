import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { handleErrorMessage } from '../../../../utils/helper.utils';
import { useToast } from '../../../components/common/useToast';
import InputField from '../../../components/common/input-field/InputField';
import SecondaryButton from '../../../components/common/secondary-button/SecondaryButton';
import { Divider } from 'primereact/divider';
import { refundBooking } from '../../../../services/booking.service';
import PrimaryButton from '../../../components/common/primary-button/PrimaryButton';

interface ProfileModalProps {
    visible: boolean;
    onHide: () => void;
    bookingDetails: any;
    fetchDetails: () => void
}

interface InputFields {
    remarks: string;
    amount: string;
}

let validations = {
    remarks: yup.string().required('Reason is required'),
    amount: yup.string().required('Amount is required')
} as any
const RefundModal: React.FC<ProfileModalProps> = ({ visible, onHide, bookingDetails, fetchDetails }) => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputFields>({
        mode: "all",
        defaultValues: {
            remarks: '',
        },
        resolver: yupResolver(yup.object().shape(validations)) as any
    });

    const handleRefundPayment = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                payment_id: Array.isArray(bookingDetails?.invoices) && bookingDetails?.invoices?.[0]?.paymentId,
                amount: data?.amount,
                remarks: data?.remarks
            } as any
            const apiRes: any = await refundBooking(payload);
            if (apiRes) {
                fetchDetails();
                useToast("success", `Payment refund successfully`, "", 3000);
                onHide();
            }
        }
        catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);
        } finally {
            setLoading(false)
            reset();
        }
    };

    return (
        <Dialog header="Payment refund" visible={visible} style={{ width: '400px' }} onHide={() => {onHide(); reset()}}>
            <form className="flex flex-col " onSubmit={handleSubmit(handleRefundPayment)}>
                <Divider />
                <div className="flex flex-col gap-4 px-4 py-4
                ">
                    <div className="w-full">
                        <InputField
                            label="Amount"
                            name='amount'
                            register={register}
                            isRequired={true}
                            error={errors?.amount?.message}
                            placeholder="Enter amount"
                        />
                    </div>

                    <div className="w-full">
                        <InputField
                            label="Reason for refund"
                            name='remarks'
                            register={register}
                            isRequired={true}
                            error={errors?.remarks?.message}
                            placeholder="Enter rejection reason"
                        />
                    </div>
                </div>
                <Divider />
                <div className="flex justify-end w-full gap-2 px-6 py-4">
                    <SecondaryButton disabled={loading} label="Cancel" type="button" onClick={onHide} />
                    <PrimaryButton type="submit" loading={loading} disabled={loading} label="Refund" />
                </div>
            </form>
        </Dialog>
    );
};

export default RefundModal;
