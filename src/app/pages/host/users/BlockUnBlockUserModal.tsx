import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { handleErrorMessage } from '../../../../utils/helper.utils';
import SecondaryButton from '../../../components/common/secondary-button/SecondaryButton';
import { useToast } from '../../../components/common/useToast';
import { updateUser } from '../../../../services/user.service';
import { Divider } from 'primereact/divider';
import SuccessButton from '../../../components/common/success-button/SuccessButton';
import DangerButton from '../../../components/common/danger-button/DangerButton';

interface ProfileModalProps {
    visible: boolean;
    onHide: () => void;
    selectedUser: any;
    users: any;
    setUserList: (data: any) => void;
}



const BlockUnblockUserModal: React.FC<ProfileModalProps> = ({ visible, onHide, users, selectedUser, setUserList }) => {
    const [loading, setLoading] = useState(false);

    const handleBlockUnblock = async () => {
        setLoading(true);
        try {
            const apiRes: any = await updateUser(selectedUser?.id, { isBlocked: !selectedUser?.isBlocked });
            if (apiRes) {
                let updatedData: any = users?.map((user: any) => {
                    if (user?.id === selectedUser?.id) {
                        return {
                            ...user,
                            isBlocked: !selectedUser?.isBlocked
                        }
                    }
                    return user;
                });
                setUserList(updatedData);
                onHide();
                useToast("success" ,  `User ${selectedUser?.isBlocked ? 'Unblocked' : 'Blocked'} successfully` , "" , 3000);
            }
        } catch (error: any) {
            handleErrorMessage(error?.errorMessage, useToast);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog header={"User"} visible={visible} style={{ width: '400px' }} onHide={onHide}>
            <div className="flex flex-col w-full">
                {/* Header */}
                <Divider className="!my-0 -mx-6" style={{ width: 'calc(100% + 48px)' }} />
                {/* Content */}
                <div className="flex flex-col items-center justify-center px-6 py-8">
                    <span className="text-center text-base">
                        Are you sure you want to {selectedUser?.isBlocked ? 'Unblock' : 'Block'} this user?
                    </span>
                </div>
                <Divider className="!my-0 -mx-6" style={{ width: 'calc(100% + 48px)' }} />
                {/* Footer Buttons */}
                <div className="flex justify-end w-full gap-2 px-6 py-4">
                    <SecondaryButton disabled={loading} label="Cancel" type="button" onClick={onHide} />
                    {selectedUser?.isBlocked ? 
                        <SuccessButton disabled={loading} loading={loading} onClick={handleBlockUnblock} label="Unblock" type="button" /> :
                        <DangerButton disabled={loading} loading={loading} onClick={handleBlockUnblock} label="Block" type="button" />
                    }
                </div>
            </div>
        </Dialog>
    );
};

export default BlockUnblockUserModal;
