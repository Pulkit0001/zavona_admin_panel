import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../../services/user.service';
import { Tag } from 'primereact/tag';
import Avatar from '../../../components/common/Avatar';
import { formatDate } from '../../../../utils/helper.utils';

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
}

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (id) {
                    const response: any = await getUserDetails(id);
                    setUserDetails(response);
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

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4 overflow-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto w-full">
                <div className="flex  items-center mb-4 pb-6 border-b border-gray-200">
                    <Avatar 
                        image={userDetails?.profileImage}
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
        </div>
    );
};

export default UserDetails;
