import React, { useState } from "react";
import BookingTable from "./booking/BookingTable";
import { getBookings } from "../../../services/booking.service";
import { useNavigate } from "react-router-dom";
import { Path } from "../../../data/path.enum";
import { getDashBoardCount } from "../../../services/user.service";

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

interface DashboardData {
    totalUsers: number;
    totalBookings: number;
    totalParkingSpaces: number;
    totalPlatformFee: number;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [bookingList, setBookingList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dashboardData , setDasBoardData] = React.useState<DashboardData | null>(null);
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

    const fetchBookings = async (page: number = 1, searchTerm?: string) => {
        setLoading(true);
        try {
            const response: any = await getBookings(
                page,
                5,
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

     const fetchDashboardCounts = async () => {
            try {
                const response: any = await getDashBoardCount()
                if (response?.success) {
                    setDasBoardData(response.data);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } 
        };

    React.useEffect(() => {
        fetchBookings();
        fetchDashboardCounts()
    }, []);

    return (
        <div className="p-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Users Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                            <p className="text-2xl font-bold text-gray-800">{dashboardData?.totalUsers || 0}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <i className="pi pi-users text-xl text-blue-500"></i>
                        </div>
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Bookings</h3>
                            <p className="text-2xl font-bold text-gray-800">{dashboardData?.totalBookings || 0}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <i className="pi pi-calendar text-xl text-green-500"></i>
                        </div>
                    </div>
                    
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Parkings</h3>
                            <p className="text-2xl font-bold text-gray-800">{dashboardData?.totalParkingSpaces || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <i className="pi pi-car text-xl text-purple-500"></i>
                        </div>
                    </div>
                </div>

                {/* Growth Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total earnings</h3>
                            <p className="text-2xl font-bold text-gray-800">{dashboardData?.totalPlatformFee || 0}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <i className="pi pi-home text-xl text-orange-500"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity and Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 ">Recent Bookings</h2>
                       {pagination?.totalBookings > 5 ? <h2 className="text-sm text-blue-500 cursor-pointer" onClick={() => navigate(Path.BOOKINGS)}>View More</h2> : ""} 
                       </div>
                        <div className="space-y-4">
                            {/* Activity Items */}

                            <BookingTable
                                bookings={bookingList}
                                loading={loading}
                                pagination={pagination}
                                showPagination = {false}
                            />

                            {/* {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <i className="pi pi-user text-blue-500"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-800">New user registered</h4>
                                        <p className="text-sm text-gray-500">John Doe created a new account</p>
                                    </div>
                                    <span className="text-xs text-gray-400">2 min ago</span>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>

                {/* Overview Stats */}
                {/* <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-600">Active Users</h4>
                                    <span className="text-sm text-blue-600">1.2k</span>
                                </div>
                                <div className="w-full bg-blue-100 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-600">Completed Orders</h4>
                                    <span className="text-sm text-green-600">845</span>
                                </div>
                                <div className="w-full bg-green-100 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-600">Pending Tasks</h4>
                                    <span className="text-sm text-purple-600">23</span>
                                </div>
                                <div className="w-full bg-purple-100 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-600">Support Tickets</h4>
                                    <span className="text-sm text-orange-600">15</span>
                                </div>
                                <div className="w-full bg-orange-100 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;
