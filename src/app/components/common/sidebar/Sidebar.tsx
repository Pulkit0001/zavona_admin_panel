import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { removeCookie } from "../../../../utils/helper.utils";
// import { Path } from "../../data/path.enum";
// import { useAppProvider } from "../../context/appContext";

const Sidebar: React.FC<{ isCollapsed: boolean }> = ({
    //   items,
    isCollapsed,
}) => {
    const location = useLocation();
    const activePath = `/${location?.pathname?.split('/')?.[1]}`
    console.log("activePath", activePath);
    
    const [activeItem, setActiveItem] = useState<string>(activePath ? activePath : "dashboard");
    //   const { setUserData } = useAppProvider()
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);


    useEffect(() => {
        // Update active item based on current path
        const currentPath = location.pathname;
        const findActiveItem = (items: any[]): void => {
            items.forEach(item => {
                if (item.path === currentPath) {
                    setActiveItem(item.path);
                } else if (item.children) {
                    findActiveItem(item.children);
                }
            });
        };
        findActiveItem(menuItems);
    }, [location.pathname]);

    const toggleSubmenu = (label: string) => {
        setExpandedItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const handleLogout = () => {
        // Clear user data and redirect to login
        removeCookie('token');
        navigate('/login');
    };

    const menuItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            path: '/dashboard',
            // badge: '5'
        },
        {
            label: 'Users',
            icon: 'pi pi-users',
            path: '/users',
            // badge: '5'
        },
          {
            label: 'Parkings',
            icon: 'pi pi-users',
            path: '/parkings',
            // badge: '5'
        },
          {
            label: 'Bookings',
            icon: 'pi pi-users',
            path: '/bookings',
            // badge: '5'
        },
          {
            label: 'Property Interests',
            icon: 'pi pi-users',
            path: '/property-interests',
            // badge: '5'
        },
        // {
        //     label: 'User Management',
        //     icon: 'pi pi-users',
        //     children: [
        //         { label: 'User List', path: '/users', icon: 'pi pi-list' },
        //         { label: 'Add User', path: '/users/add', icon: 'pi pi-user-plus' },
        //         { label: 'User Roles', path: '/users/roles', icon: 'pi pi-shield' },
        //     ]
        // },
        // {
        //     label: 'Content',
        //     icon: 'pi pi-file',
        //     children: [
        //         { label: 'Articles', path: '/content/articles', icon: 'pi pi-file-o' },
        //         { label: 'Categories', path: '/content/categories', icon: 'pi pi-tags' },
        //         { label: 'Media Library', path: '/content/media', icon: 'pi pi-images' },
        //     ]
        // },
        // {
        //     label: 'Analytics',
        //     icon: 'pi pi-chart-bar',
        //     children: [
        //         { label: 'Reports', path: '/analytics/reports', icon: 'pi pi-chart-line' },
        //         { label: 'Statistics', path: '/analytics/stats', icon: 'pi pi-chart-pie' },
        //     ]
        // },
        // { label: 'Settings', icon: 'pi pi-cog', path: '/settings' },
        { label: 'Logout', icon: 'pi pi-power-off', path: '/login', onClick: () => handleLogout() },
    ];

    return (
        <div
            className={`${isCollapsed ? "w-20" : "w-60"
                } h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
        >
            <div className="flex p-2 border-gray-200">
                <div className="flex items-center gap-2">
                    <img
                        // src={require("../../../assets/ShabdAILogo.svg").default}
                        alt="Zavona Logo"
                        className={`${isCollapsed ? "w-12 ml-2" : "w-32 ml-8"}`}
                    />
                </div>
            </div>

            {/* <nav
        className={`flex-1 py-6 flex flex-col ${isCollapsed ? "items-center px-2" : ""
          }`}
      >
        <div className="space-y-1 w-full">
          {items?.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                flex items-center cursor-pointer
                transition-all duration-200
                ${isCollapsed
                  ? "justify-center h-11 w-11 mx-auto rounded-lg relative"
                  : "px-4 py-3"
                }
                ${activeItem === item.id
                  ? isCollapsed
                    ? "bg-primary-blue text-white before:absolute before:left-[-16px] before:top-1 before:bottom-1 before:w-1 before:bg-primary-blue before:rounded-full"
                    : "text-primary-blue"
                  : "text-gray-600 hover:bg-gray-50"
                }
              `}
              id={`tooltip-${item.id}`}
            >
              <i
                className={`pi ${item.icon} ${isCollapsed ? "" : "px-4"}`}
                style={{ fontSize: "1rem" }}
              ></i>
              {!isCollapsed && (
                <span
                  className={`${activeItem === item.id ? "font-bold" : ""
                    } text-sm transition-all`}
                >
                  {item.text}
                </span>
              )}
            </div>
          ))}
          {isCollapsed &&
            items.map((item) => (
              <Tooltip
                key={item.id}
                target={`#tooltip-${item.id}`}
                content={item.text}
                position="right"
              />
            ))}
        </div>

        <div className="mt-auto px-3">
          <div className="border-gray-200 pt-4">
            <div className="flex items-center px-4 py-3 cursor-pointer text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              id={`tooltip-logout`}
              onClick={handleLogout}
            >
              <i
                className={`pi pi-power-off ${isCollapsed ? "" : "px-4"}`}
                style={{ fontSize: "1rem" }}
              ></i>
              {!isCollapsed && (
                <span className="font-medium text-sm">Logout</span>
              )}
            </div>
          </div>
        </div>
      </nav> */}

            <nav className="flex-1 overflow-y-auto">
                <ul className="p-4 space-y-1">
                    {menuItems?.map((item:any, index) => (
                        <li key={index} className="rounded-lg overflow-hidden text-sm">
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleSubmenu(item?.label)}
                                        className={`flex items-center justify-between w-full px-4 py-3 transition-colors rounded-lg ${expandedItems.includes(item.label)
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-700 hover:bg-blue-50'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <i className={`${item.icon} mr-3 text-lg ${expandedItems.includes(item.label) ? 'text-blue-600' : ''
                                                }`}></i>
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <i className={`pi ${expandedItems.includes(item.label) ? 'pi-chevron-down' : 'pi-chevron-right'} text-sm transition-transform duration-200`}></i>
                                    </button>
                                    {expandedItems.includes(item.label) && (
                                        <ul className="bg-white/50 py-2 px-4 mt-1 rounded-lg">
                                            {item.children.map((child:any, childIndex:number) => (
                                                <li key={childIndex}>
                                                    <button onClick={() => {
                                                        if (child.path) {
                                                            navigate(child.path);
                                                        }
                                                    }}
                                                        className={`flex items-center w-full px-4 py-2 rounded-md transition-colors text-sm ${activeItem === child.path
                                                            ? 'bg-blue-500 text-white'
                                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        <i className={`${child.icon} mr-3 ${activeItem === child.path ? 'text-white' : ''
                                                            }`}></i>
                                                        <span>{child.label}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <button onClick={() => {
                                    if (item.path) {
                                        if (item.onClick) {
                                            return item.onClick()
                                        }
                                        navigate(item.path);
                                    }
                                }}
                                    className={`flex items-center justify-between w-full px-4 py-3 transition-colors rounded-lg ${activeItem === item.path
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <i className={`${item.icon} mr-3 text-lg`}></i>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${activeItem === item.path
                                            ? 'bg-white text-blue-600'
                                            : 'bg-blue-500 text-white'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
