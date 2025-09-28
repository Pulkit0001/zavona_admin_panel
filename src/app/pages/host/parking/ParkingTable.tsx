import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import StatusFilterTemplate from '../../../components/common/StatusFilterTemplate';
import Avatar from '../../../components/common/Avatar';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../../../data/path.enum';
import { Menu } from 'primereact/menu';
import VerifyParkingModal from './VerifiedParkingModal';
import { Status } from '../../../../data/status.enum';
import { getPendingStatus } from '../../../../utils/helper.utils';

interface ParkingSpot {
    parkingNumber: string;
    availableToSell: boolean;
    availableToRent: boolean;
    isActive: boolean;
    isVerified: boolean;
}

interface ParkingData {
    id: string;
    name: string;
    areaSocietyName: string;
    address: string;
    isActive: boolean;
    spots: ParkingSpot[];
    isVerified: boolean;
    thumbnailUrl: string;
    status: string;
    parkingVerificationStatus: string;
}

interface ParkingTableProps {
    parkingList: ParkingData[];
    loading?: boolean;
    onPageChange?: (page: number) => void;
    pagination: any;
    setParkingList: (data: any) => void;
}

enum MenuListItem {
    VIEW_PROFILE = 'View profile',
    VERIFIED = "Verify",
    REJECTED = "Reject",
}

let tableRowMenuOptions: any
const ParkingTable: React.FC<ParkingTableProps> = ({
    parkingList,
    // loading = false,
    onPageChange,
    pagination,
    setParkingList
}) => {
    const navigate = useNavigate();
    const menuRef = React.useRef(null) as any;
    const [visible, setVisible] = useState(false);
    const [selectedParking, setSelectedParking] = useState<any>(null);
    const [filters, setFilters] = useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'spots.parkingNumber': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        areaSocietyName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        address: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const onFilterChange = (e: any) => {
        setFilters(e.filters);
    };

   

    const products = Array.isArray(parkingList) ? parkingList?.map(parking => {
        const firstSpot = Array.isArray(parking?.spots) ? parking?.spots[0] : null;
        const pendingStatus = getPendingStatus(parking?.parkingVerificationStatus);
        return {
            id: parking.id,
            parkingNumber: firstSpot?.parkingNumber || '-',
            name: parking.name || '-',
            areaSocietyName: parking?.areaSocietyName || '-',
            address: parking?.address || '-',
            // status: parking?.isActive ? 'active' : 'inactive',
            availableToSell: firstSpot?.availableToSell ? "yes" : "no",
            availableToRent: firstSpot?.availableToRent ? "yes" : "no",
            isVerified: parking?.isVerified,
            thumbnailUrl: parking?.thumbnailUrl || '',
            status: parking?.parkingVerificationStatus,
            parkingVerificationStatus: pendingStatus
        };
    }) : [];

    const statusBodyTemplate = (rowData: any) => {
        if (!rowData) return null;
        const severity = rowData?.status === Status.PENDING_APPROVAL ?
            'warning' : rowData?.status === Status.VERIFIED ?
                'success' : rowData?.status === Status.REJECTED ?
                    'danger' : 'info';
        const value = rowData?.parkingVerificationStatus;
        return value ? <Tag severity={severity} value={value} /> : "-";
    };

    const parkingNumberTemplate = (rowData: any) => {
        return (
            <Avatar
                image={rowData?.thumbnailUrl}
                label={rowData?.parkingNumber}
                size="small"
            />
        );
    };

    const handleMenuClick = (option: any) => {
        if (option?.menuClickItem === MenuListItem.VIEW_PROFILE) {
            navigate(Path.PARKING_DETAILS.replace(':id', String(option?.data?.id)))
        }
        else if (option?.menuClickItem === MenuListItem.VERIFIED || option?.menuClickItem === MenuListItem.REJECTED) {
            setSelectedParking({
                ...option?.data,
                type: option?.menuClickItem
            });
            setVisible(true);
        }
    };

    let createMenuItems = [
        {
            template: () => {
                return (
                    <div className='flex items-center flex-col p-2' >
                        {tableRowMenuOptions?.map((option: any, index: number) => (
                            <>
                                <div
                                    key={index}
                                    className='flex flex-1 items-center cursor-pointer  hover:bg-neutral-300 hover:rounded-lg w-full'
                                    onClick={() => handleMenuClick(option)}
                                >
                                    <div
                                        className='text-sm font-medium text-nowrap p-2'
                                    >
                                        {option?.label}
                                    </div>
                                </div>
                            </>
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
                rowData?.status == Status.PENDING_APPROVAL && {
                    data: rowData,
                    label: MenuListItem.VERIFIED,
                    menuClickItem: MenuListItem.VERIFIED,
                },
                rowData?.status == Status.PENDING_APPROVAL && {
                    data: rowData,
                    label: MenuListItem.REJECTED,
                    menuClickItem: MenuListItem.REJECTED,
                },

            ]?.filter(Boolean) // Filter out any falsey values
            menuRef?.current?.toggle(event)
        }
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
        <>
            <DataTable
                value={products}
                paginator
                rows={pagination?.limit}
                first={(pagination.page - 1) * pagination.limit}
                filters={filters}
                filterDisplay="row"
                totalRecords={pagination?.total}
                //   loading={loading}
                onPage={(e: any) => {
                    onPageChange?.(e.page + 1);
                }}
                onFilter={onFilterChange}
                globalFilterFields={['parkingNumber', 'areaSocietyName', 'address', 'status']}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                emptyMessage="No parking spaces found."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                tableStyle={{ minWidth: "50rem" }}
                className="p-datatable-sm menu-item-table-hover custom-paginator data-table-fixed-header"
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
                    filterPlaceholder='Search by number'
                    bodyClassName="singleLine"
                    style={{ overflow: "visible", minWidth: "12rem" }}
                />
                <Column
                    field="areaSocietyName"
                    header="Society Name"
                    sortable
                    filterPlaceholder='Search by society'
                    bodyClassName="singleLine"
                    style={{ overflow: "visible", minWidth: "12rem" }}
                />
                <Column
                    field="address"
                    header="Address"
                    sortable
                    filterPlaceholder='Search by address'
                    bodyClassName="singleLine"
                    style={{ overflow: "visible", minWidth: "15rem" }}
                />
                <Column
                    field="parkingVerificationStatus"
                    header="Status"
                    body={statusBodyTemplate}
                    sortable
                    filterElement={StatusFilterTemplate}
                    showFilterMenu={false}
                    bodyClassName="singleLine"
                    style={{ overflow: "visible", minWidth: "8rem" }}
                />
                <Column
                    field="availableToSell"
                    header="Available to Sell"
                    // body={(rowData) => booleanBodyTemplate(rowData, 'availableToSell')}
                    sortable
                    bodyClassName="singleLine"
                    style={{ overflow: "visible", minWidth: "8rem" }}
                />
                <Column
                    field="availableToRent"
                    header="Available to Rent"
                    // body={(rowData) => booleanBodyTemplate(rowData, 'availableToRent')}
                    sortable
                    bodyClassName="singleLine"
                    style={{ overflow: "visible", minWidth: "8rem" }}
                />
                <Column
                    field=""
                    header=""
                    className="!w-10"
                    body={renderLastActiveColumn}
                ></Column>
            </DataTable>
            <VerifyParkingModal
                visible={visible}
                onHide={() => setVisible(false)}
                selectedParking={selectedParking}
                parkingList={parkingList}
                setParkingList={setParkingList}
            />
        </>
    );
}

export default ParkingTable;
