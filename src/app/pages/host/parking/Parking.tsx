import React, { useState } from 'react';
import ParkingTable from './ParkingTable';
// import { getParkingList } from '../../../../services/parking.service';
import UserHeader from '../../../components/common/UserHeader';
import { getParkings } from '../../../../services/parking.service';

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const Parking: React.FC = () => {
    const [parkingList, setParkingList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchParkingList = async (page: number = 1, searchTerm?: string) => {
        setLoading(true);
        try {
            const response: any = await getParkings(page, pagination.limit, searchTerm);
            if (response?.data) {
                setParkingList(response?.data);
                setPagination(response?.pagination);
            }
        } catch (error) {
            console.error('Error fetching parking spaces:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        console.log('Page changed:', page);
        fetchParkingList(page, searchTerm);
    };

    const handleSearch = () => {
        fetchParkingList(1, searchTerm);
    };

    React.useEffect(() => {
        fetchParkingList();
    }, []);

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4">
            <div className="flex flex-1 flex-col min-h-0">
                <div className="mb-2">
                    <UserHeader 
                        title="Parking" 
                        setSearchTerm={setSearchTerm} 
                        handleSearchUser={handleSearch}
                        searchPlaceholder="Search parking spaces..."
                    />
                </div>
                <div className="flex flex-1 flex-col min-h-0 rounded-2xl overflow-auto">
                    <ParkingTable
                        parkingList={parkingList}
                        loading={loading}
                        onPageChange={handlePageChange}
                        pagination={pagination}
                        setParkingList={setParkingList}
                    />
                </div>
            </div>
        </div>
    );
};

export default Parking;
