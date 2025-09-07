import React, { useState } from 'react';
import BookingTable from './BookingTable';
import { getBookings } from '../../../../services/booking.service';
import UserHeader from '../../../components/common/UserHeader';

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    bookingsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

const Booking: React.FC = () => {
    const [bookingList, setBookingList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 0,
        totalBookings: 0,
        bookingsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });
  
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async (page: number = 1, searchTerm?: string) => {
        setLoading(true);
        console.log('Fetching bookings for page:', page);
        try {
            const response: any = await getBookings(
                page,
                pagination.bookingsPerPage,
                searchTerm
            );
            if (response?.success) {
                setBookingList(response.bookings);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        console.log('Page changed in Bookings component:', page);
        fetchBookings(page, searchTerm);
    };

    React.useEffect(() => {
        fetchBookings();
    }, []);

    const handleSearchBooking = () => {
        fetchBookings(1, searchTerm);
    }

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4">
            <div className="flex flex-1 flex-col min-h-0  ">
                <div className="mb-2">
                    <UserHeader 
                        title="Bookings" 
                        setSearchTerm={setSearchTerm} 
                        handleSearchUser={handleSearchBooking}
                        searchPlaceholder="Search bookings..."
                    />
                </div>
                <div className="flex flex-1 flex-col min-h-0 rounded-2xl overflow-auto">
                    <BookingTable
                        bookings={bookingList}
                        loading={loading}
                        onPageChange={handlePageChange}
                        pagination={pagination}
                    />
                </div>
            </div>
        </div>
    );
};

export default Booking;