import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import DateFilterTemplate from '../../../components/common/DateFilterTemplate';
import { formatDate, getPendingStatus, IMAGE_BASE_URL } from '../../../../utils/helper.utils';
import { Menu } from 'primereact/menu';
import Avatar from '../../../components/common/Avatar';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../../../data/path.enum';
import BlockUnblockUserModal from './BlockUnBlockUserModal';
import { Status } from '../../../../data/status.enum';

interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  kycStatus: string
}

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  totalRecords?: number;
  rows?: number;
  pagination: any;
  setUserList: (data: any) => void;
}

enum MenuListItem {
  VIEW_PROFILE = 'View Profile',
  BLOCK = 'Block',
  UNBLOCK = 'Unblock',
  BLOCK_UNBLOCK = 'Block_UnBlock'
}
let tableRowMenuOptions: any
const UserTable: React.FC<UserTableProps> = ({
  users,
  // loading = false,
  onPageChange,
  pagination,
  setUserList
}) => {
  const navigate = useNavigate();
  const menuRef = React.useRef(null) as any;
  const [blockUnblockUserModalVisible, setBlockUnblockUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const products = Array.isArray(users) ? users?.map(user => {
    // Convert boolean flags to a single status string that matches the filter values
    const status = user?.isBlocked ? 'blocked' : user?.isActive ? 'active' : 'inactive';
    return {
      id: user?.id,
      name: user?.name,
      profileImage: user?.profileImage,
      email: user?.email || "-",
      mobile: user?.mobile || "-",
      isActive: user?.isActive || false,
      isBlocked: user?.isBlocked || false,
      status: status, // This will match exactly with the filter values from StatusFilterTemplate
      createdAt: user?.createdAt || "-",
      updatedAt: user?.updatedAt || "-",
      kycStatus: getPendingStatus(user?.kycStatus),
      kycStatusType: getPendingStatus(user?.kycStatus)

    };
  }) : [];

  const statusBodyTemplate = (rowData: any) => {
    if (!rowData) return null;
    const severity = rowData.status === 'blocked' ? 'danger' : rowData.status === 'active' ? 'success' : 'warning';
    const value = rowData.status === 'active' ? 'Active' : rowData.status === 'blocked' ? 'Blocked' : 'Inactive';
    return <Tag severity={severity} value={value} />;
  };

  const kycStatusBodyTemplate = (rowData: any) => {
    if (!rowData) return null;
    const severity = rowData?.kycStatusType === Status.PENDING_APPROVAL ?
      'warning' : rowData?.kycStatusType === Status.VERIFIED ?
        'success' : rowData?.kycStatusType === Status.REJECTED ?
          'danger' : 'info';
    const value = rowData?.kycStatus;
    return value ? <Tag severity={severity} value={value} /> : "-";
  };

  const handleMenuClick = (option: any) => {
    if (option?.menuClickItem === MenuListItem.VIEW_PROFILE) {
      navigate(Path.USERS_DETAILS.replace(':id', String(option?.data?.id)))
    }
    if (option?.menuClickItem === MenuListItem.BLOCK_UNBLOCK) {
      setSelectedUser(option?.data);
      setBlockUnblockUserModalVisible(true);
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
        {
          data: rowData,
          label: rowData?.isBlocked ? MenuListItem.UNBLOCK : MenuListItem.BLOCK,
          menuClickItem: MenuListItem.BLOCK_UNBLOCK,
        },

      ];
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
        rows={pagination?.usersPerPage}
        first={(pagination.currentPage - 1) * pagination.usersPerPage}
        filterDisplay="row"
        lazy
        totalRecords={pagination?.totalUsers}
        onPage={(e: any) => {
          const nextPage = e.page + 1;   // PrimeReact is 0-based
          onPageChange?.(nextPage);      // 🔹 pass page number, not just e.first
        }}
        globalFilterFields={['name', 'email', 'mobile', 'status']}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        emptyMessage="No users found."
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
          field="name"
          header="Name"
          sortable
          filterPlaceholder='Search by name'
          bodyClassName="singleLine"
          style={{ overflow: "visible", minWidth: "10rem" }}
          body={(rowData) => (
            rowData?.name ? <div className="flex items-center gap-2">
              <Avatar
                image={`${IMAGE_BASE_URL}${rowData?.profileImage}`}
                label={rowData?.name}
                size="small"
              />
            </div> : "-"
          )}
        />
        <Column
          field="email"
          header="Email"
          sortable
          // filter
          filterPlaceholder='Search by email'
          bodyClassName="singleLine"
          style={{ overflow: "visible", minWidth: "8rem" }}

        />
        <Column
          field="mobile"
          header="Phone"
          sortable
          // filter
          filterPlaceholder='Search by phone'
          bodyClassName="singleLine"
          style={{ overflow: "visible", minWidth: "8rem" }}

        />
        <Column
          field="status"
          header="Status"
          sortable
          showFilterMenu={false}
          bodyClassName="singleLine"
          style={{ overflow: "visible", minWidth: "8rem" }}
          body={statusBodyTemplate}
        />
        <Column
          field="kycStatus"
          header="Kyc status"
          body={kycStatusBodyTemplate}
          sortable
          showFilterMenu={false}
          bodyClassName="singleLine"
          style={{ overflow: "visible", minWidth: "8rem" }}
        />
        <Column
          field="createdAt"
          header="Created At"
          sortable
          showFilterMenu={false}
          body={(rowData) => formatDate(rowData.createdAt)}
          style={{ overflow: "visible", minWidth: "12rem" }}
          bodyClassName="singleLine"

        />
        <Column
          field="updatedAt"
          header="Updated At"
          sortable
          filterElement={DateFilterTemplate}
          showFilterMenu={false}
          body={(rowData) => formatDate(rowData.updatedAt)}
          style={{ overflow: "visible", minWidth: "12rem" }}
          bodyClassName="singleLine"
        />
        <Column
          field=""
          header=""
          className="!w-10"
          body={renderLastActiveColumn}
        ></Column>
      </DataTable>
      <BlockUnblockUserModal
        visible={blockUnblockUserModalVisible}
        onHide={() => setBlockUnblockUserModalVisible(false)}
        selectedUser={selectedUser}
        users={users}
        setUserList={setUserList}
      />
    </>
  );





}

export default UserTable;
