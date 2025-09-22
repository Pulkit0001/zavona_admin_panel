import { useState } from 'react';
import ProfileModal from './ProfileModal';
import { Button } from 'primereact/button';
import './Header.scss';
import { getCookie, IMAGE_BASE_URL } from '../../../../utils/helper.utils';
import Avatar from '../Avatar';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
    const data = JSON.parse(getCookie("userInfo"));
    const [modalVisible, setModalVisible] = useState(false);
    const [userData , setUserData] = useState(data);

    const handleProfileUpdate = (name: string, image: File | null) => {
        // TODO: Implement update logic (API call, etc.)
        // For now, just log
        console.log('Updated name:', name, 'Updated image:', image);
    };
    
    
    return (
        <header className="sticky top-0 bg-white shadow-sm z-40 px-4 w-full">
            <div className="flex items-center justify-between h-16">
                {/* Left side - Menu Toggle and Logo */}
                <div className="flex items-center">
                    <Button
                        icon="pi pi-bars"
                        onClick={onMenuToggle}
                        className="p-button-text p-button-rounded hover:bg-gray-100"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    />
                    <h1 className="text-xl font-semibold text-gray-800 ml-4">Admin Panel</h1>
                </div>

                {/* Right side - Notifications and Profile */}
                <div className="flex items-center space-x-4">
                    {/* Notification Bell */}
                    {/* <div className="relative">
                        <Button
                            icon="pi pi-bell"
                            className="p-button-text p-button-rounded hover:bg-gray-100"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </div> */}

                    {/* Profile Section */}
                    <div className="flex items-center  pl-4">
                        <div className="mr-3">
                            <p className="text-sm font-semibold text-neutral-900">{userData?.user?.name}</p>
                            <p className="text-sm text-neutral-900">Admin</p>
                        </div>
                        <Avatar image={`${IMAGE_BASE_URL}${userData?.user?.profileImage}`}   size="small" onClick={() => setModalVisible(true)} />
                    </div>
                </div>
            </div>
            <ProfileModal
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
                userData={userData}
                onUpdate={handleProfileUpdate}
                setUserData={setUserData}
            />
        </header>
    );
};

export default Header;
