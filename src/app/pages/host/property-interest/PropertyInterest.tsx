import React, { useState } from 'react';
import { getPropertyInterests } from '../../../../services/property-interest.service';
import UserHeader from '../../../components/common/UserHeader';
import PropertyInterestTable from './PropertyInterestTable';
import LoadingSkeleton from '../../../components/common/LoadingSkelton';

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const PropertyInterest: React.FC = () => {
    const [propertyInterests, setPropertyInterests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPropertyInterests = async (page: number = 1, searchTerm?: string) => {
        setLoading(true);
        try {
            const response: any = await getPropertyInterests(page, pagination.limit, searchTerm);
            if (response?.data) {
                setPropertyInterests(response.data);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching property interests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        fetchPropertyInterests(page, searchTerm);
    };

    React.useEffect(() => {
        fetchPropertyInterests();
    }, []);

    const handleSearch = () => {
        fetchPropertyInterests(1, searchTerm);
    };

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4">
            <div className="flex flex-1 flex-col min-h-0">
                <div className="mb-2">
                    <UserHeader 
                        title="Property Interests" 
                        setSearchTerm={setSearchTerm} 
                        handleSearchUser={handleSearch}
                        searchPlaceholder="Search property interests..."
                    />
                </div>
                <div className="flex flex-1 flex-col min-h-0 rounded-2xl overflow-auto">
                    {
                        loading ? <LoadingSkeleton /> :  <PropertyInterestTable
                        propertyInterests={propertyInterests}
                        loading={loading}
                        onPageChange={handlePageChange}
                        pagination={pagination}
                    />}
                </div>
            </div>
        </div>
    );
};

export default PropertyInterest;
