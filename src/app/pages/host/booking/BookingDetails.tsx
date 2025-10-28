import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingDetails } from '../../../../services/booking.service';
import { Tag } from 'primereact/tag';
import Avatar from '../../../components/common/Avatar';
import { formatDate, IMAGE_BASE_URL } from '../../../../utils/helper.utils';
import RefundModal from './RefundModal';
import { getDocuments } from '../../../../services/parking.service';
import PrimaryButton from '../../../components/common/primary-button/PrimaryButton';
import { Status } from '../../../../data/status.enum';

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
        gstAmount?: number;
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
    invoiceUrl: string
    invoices?: Array<{
        _id: string;
        invoiceStatus: string;
        bookingId: string;
        payerId: string;
        recipientId: string;
        grossAmount: number;
        platformFee: number;
        invoiceFileKey: string;
        netPayout: number;
        dueDate: string;
        invoiceId: string;
        createdAt: string;
        updatedAt: string;
        paidAt?: string;
        paymentId?: string;
    }>;
}

const BookingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [details, setDetails] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = React.useState(false)

    const fetchDetails = async () => {
        try {
            if (id) {
                const response: any = await getBookingDetails(id);
                let invoiceUrl: any
                await Promise.all(response?.data?.invoices?.map(async (img: any) => {
                    const doc: any = await getDocuments(img?.invoiceFileKey);
                    if (doc?.success) {
                        console.log(doc?.url);

                        invoiceUrl = doc?.url
                    }
                }))
                console.log(invoiceUrl);
                setDetails({
                    ...response.data,
                    invoiceUrl
                });
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            currency: 'INR'
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
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold'>Booking details</h2>
                    {(details?.status == Status.CANCELLED && details?.invoices?.[0]?.invoiceStatus == Status.PAID) ? <PrimaryButton label="Refund" onClick={() => setVisible(true)} className="h-auto" /> : ""}
                </div>
                <div className="flex gap-4 items-center mb-6 pb-6 border-b border-gray-200">
                    <Avatar
                        image={`${IMAGE_BASE_URL}${details?.parkingSpace?.thumbnailUrl}`}
                        label={details?.parkingSpace?.name}
                        size="large"
                        labelShow={false}
                    />
                    <div>
                        <h1 className="text-2xl font-semibold mb-2">{details?.parkingSpace?.name}</h1>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {getStatusTag(details?.status)}
                            {details?.isCurrentlyActive && <Tag severity="success" value="Currently Active" />}
                            {details?.isExpired && <Tag severity="danger" value="Expired" />}
                        </div>
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
                    <InfoRow label="GST Amount" value={formatPrice(details.pricing.gstAmount || 0)} />
                    <InfoRow label="Total Amount" value={<span className="font-semibold">{formatPrice(details.pricing.finalAmount)}</span>} />

                    {/* Invoice Details */}
                    {details?.invoices && details?.invoices?.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-3">Invoice Details</h2>
                            {details.invoices.map((invoice: any) => (
                                <div key={invoice._id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                        <div>Gross Amount: <span className="font-semibold">{formatPrice(invoice.grossAmount)}</span></div>
                                        <div>Platform Fee: {formatPrice(invoice.platformFee)}</div>
                                        <div>Net Payout: {formatPrice(invoice.netPayout)}</div>
                                        <div>Due Date: {formatDate(invoice.dueDate)}</div>
                                        <div>Status: <Tag severity={invoice.invoiceStatus === 'paid' ? 'success' : 'warning'} value={invoice.invoiceStatus === 'paid' ? 'Paid' : 'Unpaid'} /></div>
                                    </div>
                                    <div className="mt-2">
                                        <a
                                            href={`${details?.invoiceUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline text-sm font-medium"
                                        >
                                            View Invoice Document
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* User Information */}
                    <h2 className="text-lg font-semibold mb-3 mt-6">User Information</h2>
                    <InfoRow
                        label="Renter"
                        value={
                            <div className="flex items-center gap-2">
                                <Avatar
                                    image={details?.renter?.profileImage || undefined}
                                    label={details?.renter?.name || details?.renter?.email}
                                    size="small"
                                    labelShow={false}
                                />
                                <span>{details?.renter?.name || details?.renter?.email}</span>
                            </div>
                        }
                    />
                    <InfoRow
                        label="Owner"
                        value={
                            <div className="flex items-center gap-2">
                                <Avatar
                                    label={details?.owner?.name || details?.owner?.email}
                                    size="small"
                                    labelShow={false}
                                />
                                <span>{details?.owner?.name || details?.owner?.email}</span>
                            </div>
                        }
                    />
                </div>
            </div>
            <RefundModal
                visible={visible}
                onHide={() => setVisible(false)}
                bookingDetails={details}
                fetchDetails={fetchDetails}
            />
        </div>
    );
};

export default BookingDetails;
