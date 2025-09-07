import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyInterestDetails } from '../../../../services/property-interest.service';
import { Tag } from 'primereact/tag';
import Avatar from '../../../components/common/Avatar';
import { formatDate } from '../../../../utils/helper.utils';

interface PropertyInterestDetails {
    interestType: string;
    status: string;
    isActive: boolean;
    parkingSpace: {
        name: string;
        areaSocietyName: string;
        address: string;
        thumbnailUrl: string;
    };
    parkingSpot: {
        parkingNumber: string;
        sellingPrice: number;
    };
    buyer: {
        name: string;
        profileImage: string;
        email: string;
    };
    owner: {
        name: string;
        email: string;
    };
    offeredPrice: number;
    leaseDurationMonths: number;
    buyerMessage: string;
    expiresAt: string;
    createdAt: string;
}

const PropertyInterestDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [details, setDetails] = useState<PropertyInterestDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (id) {
                    const response: any = await getPropertyInterestDetails(id);
                    setDetails(response);
                }
            } catch (error) {
                console.error('Error fetching property interest details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <i className="pi pi-spin pi-spinner text-2xl"></i>
            </div>
        );
    }

    if (!details) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">Property interest not found</p>
            </div>
        );
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getInterestTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            rent_monthly: 'Monthly Rent',
            rent_yearly: 'Yearly Rent',
            buy: 'Purchase'
        };
        return types[type] || type;
    };

    const getStatusTag = (status: string) => {
        const statusConfig: Record<string, { severity: 'warning' | 'success' | 'danger' | 'info', label: string }> = {
            pending: { severity: 'warning', label: 'Pending' },
            accepted: { severity: 'success', label: 'Accepted' },
            rejected: { severity: 'danger', label: 'Rejected' },
            expired: { severity: 'info', label: 'Expired' }
        };

        const config = statusConfig[status] || { severity: 'warning', label: status };
        return <Tag severity={config.severity} value={config.label} />;
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
                {/* Header with Interest Type and Status */}
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                    <Avatar 
                        image={details.parkingSpace.thumbnailUrl}
                        label={details.parkingSpace.name}
                        size="large"
                        className="mb-4"
                    />
                    <h1 className="text-2xl font-semibold mb-2">{details.parkingSpace.name}</h1>
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Tag 
                            value={getInterestTypeLabel(details.interestType)} 
                            severity="info"
                        />
                        {getStatusTag(details.status)}
                    </div>
                </div>

                <div className="space-y-1">
                    {/* Property Information */}
                    <h2 className="text-lg font-semibold mb-3">Property Information</h2>
                    <InfoRow label="Society Name" value={details.parkingSpace.areaSocietyName} />
                    <InfoRow label="Address" value={details.parkingSpace.address} />
                    <InfoRow label="Parking Number" value={details.parkingSpot.parkingNumber} />
                    
                    {/* Financial Information */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">Financial Details</h2>
                    <InfoRow 
                        label="Original Price" 
                        value={formatPrice(details.parkingSpot.sellingPrice)} 
                    />
                    <InfoRow 
                        label="Offered Price" 
                        value={formatPrice(details.offeredPrice)} 
                    />
                    {details.leaseDurationMonths && (
                        <InfoRow 
                            label="Lease Duration" 
                            value={`${details.leaseDurationMonths} months`} 
                        />
                    )}

                    {/* Buyer Information */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">Buyer Information</h2>
                    <InfoRow 
                        label="Buyer" 
                        value={
                            <div className="flex items-center gap-2">
                                <Avatar 
                                    image={details.buyer.profileImage}
                                    label={details.buyer.name}
                                    size="small"
                                />
                                <span>{details.buyer.name}</span>
                            </div>
                        } 
                    />
                    <InfoRow label="Buyer Email" value={details.buyer.email} />
                    <InfoRow label="Message" value={details.buyerMessage} />
                    
                    {/* Dates */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">Important Dates</h2>
                    <InfoRow 
                        label="Expires On" 
                        value={formatDate(details.expiresAt)} 
                    />
                    <InfoRow 
                        label="Created On" 
                        value={formatDate(details.createdAt)} 
                    />
                </div>
            </div>
        </div>
    );
};

export default PropertyInterestDetails;
