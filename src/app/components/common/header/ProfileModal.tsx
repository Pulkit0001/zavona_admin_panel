import React, { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import InputField from '../input-field/InputField';
import PrimaryButton from '../primary-button/PrimaryButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { mediaUpload, updateUser } from '../../../../services/user.service';
import { ImageType } from '../../../../data/imageType.enum';
import { handleErrorMessage, IMAGE_BASE_URL } from '../../../../utils/helper.utils';
import { useToast } from '../useToast';
import SecondaryButton from '../secondary-button/SecondaryButton';
import { Divider } from 'primereact/divider';

interface ProfileModalProps {
    visible: boolean;
    onHide: () => void;
    userData: any;
    onUpdate: (name: string, image: File | null) => void;
    setUserData: (data: any) => void;
}

interface InputFields {
    userName: string;
    profilePic: string
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onHide, userData, setUserData }) => {
    // const [username, setUsername] = useState(userData?.user?.name || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(userData?.user?.profileImage);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    React.useEffect(() => {
        setPreview(userData?.user?.profileImage);
    }, [userData]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InputFields>({
        mode: "all",
        defaultValues: {
            userName: userData?.user?.name || '',
        },
        resolver: yupResolver(
            yup.object().shape({ userName: yup.string().required('Username is required') })
        ) as any
    });

    const handleSave = async (data: any) => {
        try {
            setLoading(true);
            let updateUserPayload = {} as any
            if (data?.userName != userData?.user?.name) {
                updateUserPayload['name'] = data?.userName
            }
            if (image?.type) {
                const payload = {
                    fileType: ImageType.PROFILE_PIC,
                    fileName: image?.name,
                    contentType: image?.type
                }
                const apiRes: any = await mediaUpload(payload);
                if (apiRes?.success) {
                    const uploadResponse = await fetch(apiRes.uploadUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': image?.type || 'application/octet-stream',
                        },
                        body: image,
                    });
                    if (uploadResponse?.status === 200) {
                        updateUserPayload['profileImage'] = apiRes?.key
                    }
                }
            }
            if (image?.type || data?.userName != userData?.user?.name) {
                const updateApiRes: any = await updateUser(userData?.user?.id, updateUserPayload)
                updateApiRes && useToast('success', "Profile updated successfully", '', 3000);
                onHide();
                setUserData((prev: any) => {
                    return {
                        user: {
                            ...prev?.user,
                            name: data?.userName != userData?.user?.name ? data?.userName : prev?.user?.name,
                            profileImage: updateUserPayload?.profileImage ? updateUserPayload?.profileImage : prev?.user?.profileImage
                        }
                    }
                })
                // onUpdate(username, image);

            }
        } catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);

        } finally {
            setLoading(false);
        }

    };

    return (
        <Dialog header="Edit Profile" visible={visible} style={{ width: '400px' }} onHide={onHide}>
            <form className="flex flex-col items-center " onSubmit={handleSubmit(handleSave)}>
                <Divider />
                <div className="relative">
                    <img
                        src={image ? preview : `${IMAGE_BASE_URL}${preview}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border"
                    />
                    <div className='h-8 w-8 flex items-center justify-center bg-gray-500 absolute bottom-0 right-0 rounded-full'>
                        <i
                            className="pi pi-pencil  p-button-text   text-white cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        name='profilePic'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <div className="w-full p-4">
                    <InputField
                        label="Username"
                        name='userName'
                        register={register}
                        isRequired={true}
                        error={errors?.userName?.message}
                        placeholder="Enter your username"
                    />
                </div>
                <Divider />

                <div className="flex justify-end w-full gap-2  p-4">
                    <SecondaryButton disabled={loading} label="Cancel" type="button" onClick={onHide} />
                    <PrimaryButton disabled={loading} loading={loading} label="Save" type="submit" />
                </div>
            </form>
        </Dialog>
    );
};

export default ProfileModal;
