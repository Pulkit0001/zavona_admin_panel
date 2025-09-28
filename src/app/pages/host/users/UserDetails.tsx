import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../../services/user.service';
import { Tag } from 'primereact/tag';
import Avatar from '../../../components/common/Avatar';
import { formatDate, IMAGE_BASE_URL } from '../../../../utils/helper.utils';
import SuccessButton from '../../../components/common/success-button/SuccessButton';
import DangerButton from '../../../components/common/danger-button/DangerButton';
import { getDocuments } from '../../../../services/parking.service';
import { Status } from '../../../../data/status.enum';
import VerifyKycDocumentsModal from './VerifyKycDocumentsModal';
import { Image } from 'primereact/image';

interface UserDetailsType {
    name: string;
    profileImage: string;
    userRole: string;
    emailVerified: boolean;
    mobileVerified: boolean;
    isActive: boolean;
    isBlocked: boolean;
    email: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    kycDocs: string[]
    kycStatus: string
}

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState({}) as any
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (id) {
                    const response: any = await getUserDetails(id);
                    setUserDetails(response);
                    let docsArray = [] as any;
                    await Promise.all(response?.kycDocs?.map(async (img: string) => {
                        const doc: any = await getDocuments(img);
                        if (doc?.success) {
                            docsArray.push(doc?.url);
                        }
                    }));
                    setUserDetails({
                        ...response,
                        kycDocs: docsArray
                    })
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <i className="pi pi-spin pi-spinner text-2xl"></i>
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">User not found</p>
            </div>
        );
    }

    const renderVerificationStatus = (isVerified: boolean) => (
        <Tag
            severity={isVerified ? 'success' : 'warning'}
            value={isVerified ? 'Verified' : 'Not Verified'}
        />
    );

    const renderAccountStatus = () => {
        if (userDetails?.isBlocked) {
            return <Tag severity="danger" value="Blocked" />;
        }
        return (
            <Tag
                severity={userDetails?.isActive ? 'success' : 'warning'}
                value={userDetails?.isActive ? 'Active' : 'Inactive'}
            />
        );
    };

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex flex-col sm:flex-row py-3 border-b border-gray-200">
            <div className="w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">{label}</div>
            <div className="w-full sm:w-2/3">{value}</div>
        </div>
    );

    const handleKycAction = (type: string) => {
        setSelectedUser({
            ...userDetails,
            type
        })
        setVisible(true)
    };

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4 overflow-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto w-full">
                <div className="flex  items-center mb-4 pb-6 border-b border-gray-200">
                    <Avatar
                        image={`${IMAGE_BASE_URL}${userDetails?.profileImage}`}
                        label={""}
                        // size="large"
                        className="mb-2"
                    />
                    <div className='flex flex-col gap-2'>
                        <h1 className="text-2xl font-semibold">{userDetails?.name}</h1>
                        <Tag
                            value={userDetails?.userRole?.toUpperCase()}
                            severity="info"
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* KYC Documents Section */}
                <div className="mb-6 border border-neutral-300 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">KYC Documents</h2>
                    <div className="flex flex-wrap gap-6">
                        {userDetails?.kycDocs?.map((doc, index: number) => (
                            <div key={index} className="border rounded-lg p-4 flex flex-col items-center shadow-sm min-w-[220px] bg-gray-50">
                                    <Image
                                        src={doc}
                                        alt="Parking Space"
                                        width="180"
                                        style={{ height: '120px', objectFit: 'cover' , overflow: "hidden"}}
                                        className="rounded-lg shadow-sm"
                                        preview
                                    />
                            </div>
                        ))}
                        
                    </div>
                    {userDetails?.kycStatus == Status.PENDING_APPROVAL && <div className="flex gap-2 mt-4">
                            <SuccessButton label="Verify" onClick={() => handleKycAction('Verify')} />
                            <DangerButton label="Reject" onClick={() => handleKycAction('Reject')} />
                        </div>}
                </div>

                <div className="space-y-1">
                    <InfoRow label="Email" value={userDetails?.email} />
                    <InfoRow label="Email Status" value={renderVerificationStatus(userDetails?.emailVerified)} />
                    <InfoRow label="Mobile Status" value={renderVerificationStatus(userDetails?.mobileVerified)} />
                    <InfoRow label="Account Status" value={renderAccountStatus()} />
                    <InfoRow
                        label="Created At"
                        value={formatDate(userDetails?.createdAt)}
                    />
                    <InfoRow
                        label="Last Updated"
                        value={formatDate(userDetails?.updatedAt)}
                    />
                </div>
            </div>
            <VerifyKycDocumentsModal
                visible={visible}
                onHide={() => setVisible(false)}
                selectedUser={selectedUser}
                setUserDetails={setUserDetails}
            />
        </div>
    );
};

export default UserDetails;
