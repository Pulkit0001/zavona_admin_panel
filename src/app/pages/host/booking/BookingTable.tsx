import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import Avatar from '../../../components/common/Avatar';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Path } from '../../../../data/path.enum';
import { capitalizeFirstLetter, IMAGE_BASE_URL } from '../../../../utils/helper.utils';

interface BookingType {
    id: string;
    pricing: {
        finalAmount: number;
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
    };
    checkInDateTime: string;
    checkOutDateTime: string;
}

interface BookingTableProps {
    bookings: BookingType[];
    loading?: boolean;
    onPageChange?: (page: number) => void;
    pagination: any;
    showPagination?: boolean
}

let tableRowMenuOptions: any
const BookingTable: React.FC<BookingTableProps> = ({
    bookings = [],
    // loading = false,
    onPageChange,
    pagination,
    showPagination = true
}) => {
    const menuRef = React.useRef(null) as any;
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'parkingSpot.parkingNumber': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'parkingSpace.areaSocietyName': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'parkingSpace.address': { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const onFilterChange = (e: any) => {
        setFilters(e.filters);
    };

    const formatDate = (value: string) => {
        if (!value) return '-';
        try {
            return new Date(value).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return '-';
        }
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const transformedData = bookings.map(booking => ({
        id: booking.id,
        parkingNumber: booking.parkingSpot?.parkingNumber || '-',
        price: booking.pricing?.finalAmount || 0,
        checkInDateTime: booking.checkInDateTime,
        checkOutDateTime: booking.checkOutDateTime,
        status: booking.status,
        areaSocietyName: booking.parkingSpace?.areaSocietyName || '-',
        address: booking.parkingSpace?.address || '-',
        thumbnailUrl: booking.parkingSpace?.thumbnailUrl || '',
    }));

    const parkingNumberTemplate = (rowData: any) => (
        // console.log(`${IMAGE_BASE_URL}${rowData?.thumbnailUrl}` , "`${IMAGE_BASE_URL}${rowData?.thumbnailUrl}`")

        <Avatar
            image={`${IMAGE_BASE_URL}${rowData?.thumbnailUrl}`}
            label={rowData?.parkingNumber}
            size="small"
        />
    );

    const statusBodyTemplate = (rowData: any) => {
        if (!rowData.status) return null;

        type StatusSeverity = 'warning' | 'success' | 'danger' | 'info';

        const statusConfig: Record<string, { severity: StatusSeverity, label: string }> = {
            pending_confirmation: { severity: 'warning', label: 'Pending Confirmation' },
            confirmed: { severity: 'success', label: 'Confirmed' },
            cancelled: { severity: 'danger', label: 'Cancelled' },
            completed: { severity: 'info', label: 'Completed' },
            in_progress: { severity: 'warning', label: 'In Progress' },
            checked_out: { severity: 'info', label: 'Checked Out' },
            checked_in: { severity: 'success', label: 'Checked In' },
            payment_completed: { severity: 'success', label: 'Payment Completed' }
        };
        const status = statusConfig[rowData.status] ||
            { severity: 'warning' as StatusSeverity, label: rowData.status };

        return <Tag severity={status.severity} value={capitalizeFirstLetter(status?.label?.split("_")?.join(" "))} />;
    };

    enum MenuListItem {
        VIEW_PROFILE = 'View Details',
        ACCEPT = 'Accept Interest',
        REJECT = 'Reject Interest',
    }

    const handleMenuClick = (option: any) => {
        if (option?.menuClickItem === MenuListItem.VIEW_PROFILE) {
            navigate(Path.BOOKING_DETAILS.replace(':id', String(option?.data?.id)))
        }
        // Implement your logic based on the clicked menu option
    };

    const createMenuItems = [
        {
            template: () => {
                return (
                    <div className='flex items-center flex-col p-2' >
                        {tableRowMenuOptions?.map((option: any, index: number) => (
                            <div
                                key={index}
                                className='flex flex-1 items-center cursor-pointer hover:bg-neutral-300 hover:rounded-lg w-full'
                                onClick={() => handleMenuClick(option)}
                            >
                                <div className='text-sm font-medium text-nowrap p-2'>
                                    {option?.label}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
        },
    ];

    const renderLastActiveColumn = (rowData: any) => {
        const handleToggleMenu = (event: any) => {
            tableRowMenuOptions = [
                {
                    data: rowData,
                    label: MenuListItem.VIEW_PROFILE,
                    menuClickItem: MenuListItem.VIEW_PROFILE,
                },

            ];
            menuRef?.current?.toggle(event);
        };
        return (
            <div className="relative cursor-pointer w-5">
                <div
                    className="bg-white menubar-blur p-datatable-hover absolute  -top-4 -right-1  rounded-lg  "
                    onClick={(event) => handleToggleMenu(event)}
                >
                    <i className="pi pi-ellipsis-h p-2" style={{ fontSize: '1rem' }}></i>
                </div>
                <Menu model={createMenuItems} popup ref={menuRef} className="menu-list-items !w-52" />
            </div>
        );
    };

    return (
        
        <DataTable
            value={transformedData}
            paginator={showPagination}
            rows={pagination?.bookingsPerPage}
            first={(pagination.currentPage - 1) * pagination.bookingsPerPage}
            filters={filters}
            filterDisplay="row"
            totalRecords={pagination?.totalBookings}
            // loading={loading}
            onPage={(e) => onPageChange?.(e.page ? e.page + 1 : 1)}
            onFilter={onFilterChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            emptyMessage="No bookings found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            className="p-datatable-sm custom-paginator data-table-fixed-header menu-item-table-hover"
            pt={{
                wrapper: {
                    className: "min-h-[200px]"
                }
            }}
        >
            <Column
                field="parkingNumber"
                header="Parking Number"
                body={parkingNumberTemplate}
                sortable
                // filterElement={TextFilterTemplate}
                filterPlaceholder="Search by number"
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="price"
                header="Price"
                sortable
                body={(rowData) => formatPrice(rowData.price)}
                style={{ minWidth: '8rem' }}
            />
            <Column
                field="checkInDateTime"
                header="Check In"
                sortable
                body={(rowData) => formatDate(rowData.checkInDateTime)}
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="checkOutDateTime"
                header="Check Out"
                sortable
                body={(rowData) => formatDate(rowData.checkOutDateTime)}
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="status"
                header="Status"
                sortable
                body={statusBodyTemplate}
                style={{ minWidth: '10rem' }}
            />
            <Column
                field="areaSocietyName"
                header="Society Name"
                sortable
                filterPlaceholder="Search by society"
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="address"
                header="Address"
                sortable
                filterPlaceholder="Search by address"
                style={{ minWidth: '15rem' }}
            />
            <Column
                field=""
                header=""
                className="!w-10"
                body={renderLastActiveColumn}
            ></Column>
        </DataTable>
    );
};

export default BookingTable;
