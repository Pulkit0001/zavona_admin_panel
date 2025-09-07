import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import TextFilterTemplate from '../../../components/common/TextFilterTemplate';
import StatusFilterTemplate from '../../../components/common/StatusFilterTemplate';
import Avatar from '../../../components/common/Avatar';
import { FilterMatchMode } from 'primereact/api';
import { Menu } from 'primereact/menu';
import { Path } from '../../../../data/path.enum';
import { useNavigate } from 'react-router-dom';

interface PropertyInterestType {
    id: string;
    interestType: string;
    status: string;
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
    };
    owner: {
        name: string;
    };
    offeredPrice: number;
    buyerMessage: string;
}

interface PropertyInterestTableProps {
    propertyInterests: PropertyInterestType[];
    loading?: boolean;
    onPageChange?: (page: number) => void;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
let tableRowMenuOptions: any
const PropertyInterestTable: React.FC<PropertyInterestTableProps> = ({
    propertyInterests = [],
    loading = false,
    onPageChange,
    pagination
}) => {
    const menuRef = React.useRef(null) as any;
    const [manageMenuList, setManageMenuList] = React.useState() as any;
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'buyer.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'owner.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'parkingSpot.parkingNumber': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'parkingSpace.areaSocietyName': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'parkingSpace.address': { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        interestType: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const onFilterChange = (e: any) => {
        setFilters(e.filters);
    };

    const formatPrice = (amount: number) => {
        // return new Intl.NumberFormat('en-US', {
        //     style: 'currency',
        //     currency: 'USD'
        // }).format(amount);
        return amount
    };

    const transformedData = propertyInterests.map(interest => ({
        id: interest.id,
        buyerName: interest.buyer?.name || '-',
        buyerImage: interest.buyer?.profileImage,
        ownerName: interest?.owner?.name || '-',
        parkingNumber: interest.parkingSpot?.parkingNumber || '-',
        price: interest.parkingSpot?.sellingPrice || 0,
        offeredPrice: interest.offeredPrice || 0,
        buyerMessage: interest.buyerMessage || '-',
        areaSocietyName: interest.parkingSpace?.areaSocietyName || '-',
        address: interest.parkingSpace?.address || '-',
        status: interest.status,
        interestType: interest.interestType,
        thumbnailUrl: interest.parkingSpace?.thumbnailUrl || ''
    }));

    const buyerTemplate = (rowData: any) => (
        <Avatar
            image={rowData.buyerImage}
            label={rowData.buyerName}
            size="small"
        />
    );

    const parkingNumberTemplate = (rowData: any) => (
        <Avatar
            image={rowData.thumbnailUrl}
            label={rowData.parkingNumber}
            size="small"
        />
    );

    const priceTemplate = (rowData: any) => (
        <div className="flex flex-col">
            <span>{formatPrice(rowData.price)}</span>
            {/* <small className="text-green-500">{formatPrice(rowData.offeredPrice)}</small> */}
        </div>
    );

    const statusBodyTemplate = (rowData: any) => {
        if (!rowData.status) return null;

        type StatusSeverity = 'warning' | 'success' | 'danger' | 'info';

        const statusConfig: Record<string, { severity: StatusSeverity, label: string }> = {
            pending: { severity: 'warning', label: 'Pending' },
            accepted: { severity: 'success', label: 'Accepted' },
            rejected: { severity: 'danger', label: 'Rejected' },
            expired: { severity: 'info', label: 'Expired' },
            withdrawn: { severity: 'info', label: 'Withdrawn' }
        };

        const status = statusConfig[rowData.status] ||
            { severity: 'warning' as StatusSeverity, label: rowData.status };
        return <Tag severity={status.severity} value={status.label} />;
    };

    const interestTypeTemplate = (rowData: any) => {
        if (!rowData.interestType) return null;

        const typeConfig: Record<string, { label: string }> = {
            rent_monthly: { label: 'Monthly Rent' },
            rent_yearly: { label: 'Yearly Rent' },
            buy: { label: 'Purchase' }
        };

        const type = typeConfig[rowData.interestType] || { label: rowData.interestType };

        return <span>{type.label}</span>;
    };

    enum MenuListItem {
        VIEW_PROFILE = 'View Details',
        ACCEPT = 'Accept Interest',
        REJECT = 'Reject Interest',
    }

    const handleMenuClick = (option: any) => {
        console.log('Menu option clicked:', option, manageMenuList);
        if (option?.menuClickItem === MenuListItem.VIEW_PROFILE) {
            navigate(Path.PROPERTY_INTEREST_DETAILS.replace(':id', String(option?.data?.id)))
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
            setManageMenuList(rowData);
            menuRef?.current?.toggle(event);
        };
        return (
            <div className="relative cursor-pointer w-5">
                <div
                    className="bg-white menubar-blur p-datatable-hover absolute -top-4 -right-1 rounded-lg"
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
            paginator
            rows={pagination?.limit}
            first={(pagination.page - 1) * pagination.limit}
            filters={filters}
            filterDisplay="row"
            totalRecords={pagination?.total}
            loading={loading}
            onPage={(e) => onPageChange?.(e.page ? e.page + 1 : 1)}
            onFilter={onFilterChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            emptyMessage="No property interests found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            className="p-datatable-sm custom-paginator data-table-fixed-header"
            pt={{
                wrapper: {
                    className: "min-h-[200px]"
                }
            }}
        >
            <Column
                field="buyerName"
                header="Buyer Name"
                body={buyerTemplate}
                sortable
                filterPlaceholder="Search by buyer"
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="ownerName"
                header="Owner Name"
                sortable
                filterPlaceholder="Search by owner"
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="parkingNumber"
                header="Parking Number"
                body={parkingNumberTemplate}
                sortable
                filterPlaceholder="Search by number"
                style={{ minWidth: '12rem' }}
            />
            <Column
                field="price"
                header="Price"
                sortable
                body={priceTemplate}
                style={{ minWidth: '10rem' }}
            />
            <Column
                field="buyerMessage"
                header="Buyer Message"
                sortable
                style={{ minWidth: '15rem' }}
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
                field="status"
                header="Status"
                sortable
                body={statusBodyTemplate}
                style={{ minWidth: '10rem' }}
            />
            <Column
                field="interestType"
                header="Interest Type"
                sortable
                body={interestTypeTemplate}
                style={{ minWidth: '10rem' }}
            />
            <Column
                field=""
                header=""
                className="!w-10"
                body={renderLastActiveColumn}
            />
        </DataTable>
    );
};

export default PropertyInterestTable;
