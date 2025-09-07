import React, { useState } from 'react';
import UserTable from './UserTable';
import { getUsers } from '../../../../services/user.service';
import InputField from '../../../components/common/input-field/InputField';
import PrimaryButton from '../../../components/common/primary-button/PrimaryButton';
import UserHeader from '../../../components/common/UserHeader';

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
}

const Users: React.FC = () => {
    const [userList, setUserList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 0,
        totalUsers: 0,
        usersPerPage: 10
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        sortBy: '',
        sortOrder: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    // console.log(pagination , "===========9999999999998888888888");

    const fetchUserListing = async (page?: number = 0, searchTerm?: any) => {
        setLoading(true);
        console.log('Fetching users for page:', page);
        try {
            const response: any = await getUsers(
                page,
                pagination?.usersPerPage, // Set to 1 user per page
                searchTerm
            );
            if (response?.success) {
                setUserList(response?.data?.users);
                setPagination({
                    currentPage: response?.data?.pagination?.currentPage,
                    totalPages: response?.data?.pagination?.totalPages,
                    totalUsers: response?.data?.pagination?.totalUsers,
                    usersPerPage: response?.data?.pagination?.usersPerPage
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        console.log('Page changed in Users component:', page);
        fetchUserListing(page, null); // Adding 1 because page is 0-based from DataTable
    };

    // const handleFiltersChange = (newFilters: any) => {
    //     const updatedFilters = { ...filters, ...newFilters };
    //     setFilters(updatedFilters);
    //     fetchUserListing(1, updatedFilters);
    // };

    React.useEffect(() => {
        fetchUserListing();
    }, []);

const handleSearchUser = () => {
    fetchUserListing(pagination.currentPage, searchTerm)
}

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-br p-4">
            <div className="flex flex-1 flex-col min-h-0  ">
                <div className="mb-2">
                    <UserHeader title="Users" setSearchTerm={setSearchTerm} handleSearchUser={handleSearchUser} />
                </div>
                <div className="flex flex-1 flex-col min-h-0 rounded-2xl overflow-auto">
                    <UserTable
                        users={userList}
                        loading={loading}
                        onPageChange={handlePageChange}
                        pagination={pagination}
                        setUserList={setUserList}
                    />
                </div>
            </div>
        </div>
    );
};

export default Users;