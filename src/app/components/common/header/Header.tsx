import React from 'react';
import { Button } from 'primereact/button';
import './Header.scss';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
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
                    <div className="relative">
                        <Button
                            icon="pi pi-bell"
                            className="p-button-text p-button-rounded hover:bg-gray-100"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center border-l pl-4">
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-800">John Doe</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <Button
                            icon="pi pi-user"
                            className="p-button-text p-button-rounded hover:bg-gray-100"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
