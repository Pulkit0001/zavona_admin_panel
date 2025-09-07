import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './common/sidebar/Sidebar';
import Header from './common/header/Header';

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="flex flex-1 flex-col h-screen w-screen bg-gray-50">
      {/* Main Container */}
      <div className="flex flex-1  min-h-screen min-w-screen">
        <Sidebar isCollapsed={sidebarVisible}/>
        
        {/* Main Content Area with Header */}
        <div className={`flex-1 flex flex-col min-w-0 min-h-0 transition-all duration-300 `}>
          {/* Header */}
          <div className="sticky top-0 z-10 flex min-w-0 ">
            <Header onMenuToggle={() => setSidebarVisible(!sidebarVisible)} />
          </div>
          
          {/* Page Content */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

