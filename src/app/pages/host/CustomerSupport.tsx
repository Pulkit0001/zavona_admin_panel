import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../../components/common/input-field/InputField';
import TextAreaField from '../../components/common/textarea-field/TextAreaField';
import PrimaryButton from '../../components/common/primary-button/PrimaryButton';
import { customerSupport } from '../../../services/customer-support.service';
import { useToast } from '../../components/common/useToast';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
    description: yup.string().required('Description is required'),
});

const CustomerSupport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res: any = await customerSupport(data);
            if (res?.success) {
                useToast('success', 'Support request sent successfully', '', 3000);
                reset();
            }
        } catch (error: any) {
            useToast('error', error?.message || 'Failed to send request', '', 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full px-2">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-4 sm:p-8 mt-6 sm:mt-10">
                <h2 className="text-2xl font-semibold mb-6 text-center">Customer Support</h2>
                <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="Name"
                        name="name"
                        register={register}
                        isRequired={true}
                        error={errors?.name?.message}
                        placeholder="Enter your name"
                    />
                    <InputField
                        label="Email"
                        name="email"
                        register={register}
                        isRequired={true}
                        error={errors?.email?.message}
                        placeholder="Enter your email"
                    />
                    <InputField
                        label="Mobile Number"
                        name="mobile"
                        register={register}
                        isRequired={true}
                        error={errors?.mobile?.message}
                        placeholder="Enter your mobile number"
                    />
                    <TextAreaField
                        label="Description"
                        name="description"
                        register={register}
                        setValue={setValue}
                        error={errors.description?.message}
                        isRequired={true}
                        placeholder="Describe your issue"
                        rows={3}
                        maxLength={500}
                        resize="vertical"
                        setError={setError}
                    />
                    <PrimaryButton label={loading ? 'Submitting...' : 'Submit'} type="submit" disabled={loading} loading={loading} />
                </form>
            </div>
        </div>
    );
};

export default CustomerSupport;
