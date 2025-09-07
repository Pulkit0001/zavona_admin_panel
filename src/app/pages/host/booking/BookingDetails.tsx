import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingDetails } from '../../../../services/booking.service';
import { Tag } from 'primereact/tag';
import Avatar from '../../../components/common/Avatar';
import { formatDate } from '../../../../utils/helper.utils';

interface BookingDetails {
    id: string;
    pricing: {
        duration: {
            hours: number;
            days: number;
        };
        rateType: string;
        rate: number;
        totalAmount: number;
        finalAmount: number;
        platformFee: number;
    };
    status: string;
    parkingSpace: {
        name: string;
        areaSocietyName: string;
        address: string;
        thumbnailUrl: string;
    };
    parkingSpot: {
        parkingNumber: string;
        parkingSize: string[];
    };
    renter: {
        name: string;
        email: string;
        profileImage: string | null;
    };
    owner: {
        name: string;
        email: string;
    };
    checkInDateTime: string;
    checkOutDateTime: string;
    isCurrentlyActive: boolean;
    isExpired: boolean;
    isCheckInOverdue: boolean;
    isCheckOutOverdue: boolean;
}

const BookingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [details, setDetails] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (id) {
                    const response: any = await getBookingDetails(id);
                    setDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
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
                <p className="text-lg text-gray-600">Booking not found</p>
            </div>
        );
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusTag = (status: string) => {
        const statusConfig: Record<string, { severity: 'warning' | 'success' | 'danger' | 'info', label: string }> = {
            pending_confirmation: { severity: 'warning', label: 'Pending Confirmation' },
            confirmed: { severity: 'success', label: 'Confirmed' },
            cancelled: { severity: 'danger', label: 'Cancelled' },
            completed: { severity: 'info', label: 'Completed' },
            in_progress: { severity: 'info', label: 'In Progress' }
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
                {/* Header with Parking Space Info */}
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                    <Avatar 
                        image={details?.parkingSpace?.thumbnailUrl}
                        label={details?.parkingSpace?.name}
                        size="large"
                        className="mb-4"
                    />
                    <h1 className="text-2xl font-semibold mb-2">{details?.parkingSpace?.name}</h1>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {getStatusTag(details?.status)}
                        {details?.isCurrentlyActive && <Tag severity="success" value="Currently Active" />}
                        {details?.isExpired && <Tag severity="danger" value="Expired" />}
                    </div>
                </div>

                <div className="space-y-1">
                    {/* Parking Information */}
                    <h2 className="text-lg font-semibold mb-3">Parking Information</h2>
                    <InfoRow label="Society Name" value={details.parkingSpace.areaSocietyName} />
                    <InfoRow label="Address" value={details.parkingSpace.address} />
                    <InfoRow label="Spot Number" value={details.parkingSpot.parkingNumber} />
                    <InfoRow 
                        label="Vehicle Types" 
                        value={details.parkingSpot.parkingSize.map(size => 
                            size.charAt(0).toUpperCase() + size.slice(1)
                        ).join(', ')} 
                    />

                    {/* Booking Times */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">Booking Schedule</h2>
                    <InfoRow label="Check In" value={formatDate(details.checkInDateTime)} />
                    <InfoRow label="Check Out" value={formatDate(details.checkOutDateTime)} />
                    <InfoRow 
                        label="Duration" 
                        value={`${details.pricing.duration.days} days, ${details.pricing.duration.hours} hours`} 
                    />
                    
                    {/* Pricing Details */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">Pricing Details</h2>
                    <InfoRow label="Rate Type" value={details.pricing.rateType.toUpperCase()} />
                    <InfoRow label="Rate" value={formatPrice(details.pricing.rate)} />
                    <InfoRow label="Platform Fee" value={formatPrice(details.pricing.platformFee)} />
                    <InfoRow 
                        label="Total Amount" 
                        value={<span className="font-semibold">{formatPrice(details.pricing.finalAmount)}</span>} 
                    />

                    {/* User Information */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">User Information</h2>
                    <InfoRow 
                        label="Renter" 
                        value={
                            <div className="flex items-center gap-2">
                                <Avatar 
                                    image={details.renter.profileImage || undefined}
                                    label={details.renter.name || details.renter.email}
                                    size="small"
                                />
                                <span>{details.renter.name || details.renter.email}</span>
                            </div>
                        } 
                    />
                    <InfoRow 
                        label="Owner" 
                        value={
                            <div className="flex items-center gap-2">
                                <Avatar 
                                    label={details.owner.name || details.owner.email}
                                    size="small"
                                />
                                <span>{details.owner.name || details.owner.email}</span>
                            </div>
                        } 
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
