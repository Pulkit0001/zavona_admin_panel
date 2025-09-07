import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getParkingDetails } from '../../../../services/parking.service';
import { Tag } from 'primereact/tag';
import { Carousel } from 'primereact/carousel';
import { Image } from 'primereact/image';
import Avatar from '../../../components/common/Avatar';


interface ParkingSpot {
    parkingNumber: string;
    parkingSize: string[];
    sellingPrice: number;
    rentPricePerDay: number;
    rentPricePerHour: number;
    isActive: boolean;
    isAvailable: boolean;
    availableToSell: boolean;
    availableToRent: boolean;
}

interface ParkingSpace {
    name: string;
    areaSocietyName: string;
    address: string;
    type: string;
    images: string[];
    thumbnailUrl: string;
    isActive: boolean;
    isVerified: boolean;
    owner: {
        name: string;
        email: string;
        profileImage: string | null;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

interface ParkingDetailsResponse {
    parkingSpace: ParkingSpace;
    parkingSpot: ParkingSpot[];
}

const ParkingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [parkingDetails, setParkingDetails] = useState<ParkingDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParkingDetails = async () => {
            try {
                if (id) {
                    const response: any = await getParkingDetails(id);
                    setParkingDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching parking details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchParkingDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <i className="pi pi-spin pi-spinner text-2xl"></i>
            </div>
        );
    }

    if (!parkingDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">Parking space not found</p>
            </div>
        );
    }

    const { parkingSpace, parkingSpot } = parkingDetails;

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const imageTemplate = (image: string) => (
        <div className="flex justify-center p-2">
            <Image 
                src={image} 
                alt="Parking Space" 
                width="400" 
                height="300" 
                className="rounded-lg shadow-sm"
                preview
            />
        </div>
    );


    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4 overflow-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto w-full">
                {/* Images Carousel */}
                <div className="mb-6">
                    <Carousel 
                        value={parkingSpace?.images} 
                        numVisible={1} 
                        numScroll={1} 
                        itemTemplate={imageTemplate}
                        className="custom-carousel"
                    />
                </div>

                {/* Main Info */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold mb-2">{parkingSpace?.name}</h1>
                            <p className="text-gray-600 mb-2">{parkingSpace?.areaSocietyName}</p>
                            <p className="text-gray-500">{parkingSpace?.address}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Tag 
                                severity={parkingSpace?.isActive ? 'success' : 'danger'} 
                                value={parkingSpace?.isActive ? 'Active' : 'Inactive'} 
                            />
                            <Tag 
                                severity={parkingSpace?.isVerified ? 'success' : 'warning'} 
                                value={parkingSpace?.isVerified ? 'Verified' : 'Unverified'} 
                            />
                        </div>
                    </div>
                </div>

                {/* Parking Spots */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Parking Spots</h2>
                    {parkingSpot.map((spot, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-medium">Spot {spot.parkingNumber}</h3>
                                <Tag 
                                    severity={spot.isAvailable ? 'success' : 'danger'} 
                                    value={spot.isAvailable ? 'Available' : 'Unavailable'} 
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600 mb-2">
                                        Vehicle Types: {spot.parkingSize.map(size => 
                                            size.charAt(0).toUpperCase() + size.slice(1)
                                        ).join(', ')}
                                    </p>
                                    {spot.availableToSell && (
                                        <p className="font-medium">Selling Price: {formatPrice(spot.sellingPrice)}</p>
                                    )}
                                </div>
                                {spot.availableToRent && (
                                    <div>
                                        <p className="font-medium">Rent Prices:</p>
                                        <p>Per Hour: {formatPrice(spot.rentPricePerHour)}</p>
                                        <p>Per Day: {formatPrice(spot.rentPricePerDay)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Owner Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Owner Information</h2>
                    <div className="flex items-center gap-4">
                        <Avatar 
                            image={parkingSpace.owner.profileImage || undefined}
                            label={parkingSpace.owner.name || parkingSpace.owner.email}
                            size="medium"
                        />
                        <div>
                            <p className="font-medium">{parkingSpace.owner.name || 'Owner'}</p>
                            <p className="text-gray-600">{parkingSpace.owner.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingDetails;
