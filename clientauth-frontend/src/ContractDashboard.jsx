import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaBars, FaTimes, FaFileAlt, FaEdit, FaClipboardList, FaLink, FaEye, FaUserCheck } from 'react-icons/fa';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { Helmet } from 'react-helmet';
import { useState } from 'react';

const ContractDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const themeClasses = {
    light: {
      background: 'bg-white',
      text: 'text-black',
      heading: 'text-[#3ab6de]',
      button: 'bg-[#3ab6de] hover:bg-[#33a5cb] text-white',
      buttonDark: 'bg-[#2a9bb4] hover:bg-[#278da4] text-white',
      sidebar: 'bg-gray-50',
      linkHover: 'hover:bg-blue-100',
      linkActive: 'bg-blue-100 text-[#33a5cb]',
    },
    dark: {
      background: 'bg-black',
      text: 'text-white',
      heading: 'text-[#33a5cb]',
      button: 'bg-[#33a5cb] hover:bg-[#3ab6de] text-white',
      buttonDark: 'bg-[#2c8ca1] hover:bg-[#24798a] text-white',
      sidebar: 'bg-gray-900',
      linkHover: 'hover:bg-gray-800',
      linkActive: 'bg-gray-800 text-[#33a5cb]',
    },
  };

  const currentTheme = themeClasses[theme];

  const navItems = [
    { to: '/create-template', label: 'Create Template', icon: <FaFileAlt />, type: 'button' },
    { to: '/contracts/create', label: 'Create Contract', icon: <FaEdit />, type: 'button' },
    { to: '/contracts/subcontracts/create', label: 'Create Subcontract', icon: <FaClipboardList />, type: 'button' },
    { to: '/contracts/review', label: 'Review Queue', icon: <FaEye />, type: 'dark' },
    { to: '/contracts/assign-review', label: 'Assign Review', icon: <FaUserCheck />, type: 'dark' },
  ];

  return (
    <>
      <Helmet>
        <title>Contract Manager</title>
      </Helmet>
      <div className={`min-h-screen flex ${currentTheme.background} ${currentTheme.text}`}>
        {/* Sidebar */}
        <aside className={`${collapsed ? 'w-16' : 'w-64'} ${currentTheme.sidebar} border-r shadow-sm transition-all duration-300`}>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className={`text-xl font-bold ${currentTheme.heading} ${collapsed && 'hidden'}`}>OPPORTUNITIES</h2>
            <button onClick={() => setCollapsed(!collapsed)} className={`${currentTheme.text}`}>
              {collapsed ? <FaBars /> : <FaTimes />}
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition w-full justify-center ${item.type === 'dark' ? currentTheme.buttonDark : currentTheme.button}`}
                  title={collapsed ? item.label : ''}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>

          <nav className="px-4 py-2 space-y-2 text-sm">
            <div className={`mt-6 font-semibold ${currentTheme.text} opacity-50 uppercase text-xs`}>
              {!collapsed && 'Views'}
            </div>

            <Link
              to="/contracts/links"
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${getLinkClass(location.pathname, '/contracts/links', currentTheme)}`}
              title={collapsed ? 'Useful Links' : ''}
            >
              <FaLink />
              {!collapsed && 'Useful Links'}
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <header className={`${currentTheme.sidebar} shadow px-6 py-4 border-b border-gray-700 flex items-center justify-between`}>
            <h1 className={`text-xl font-semibold ${currentTheme.heading}`}>Contract Management System</h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${currentTheme.button}`}
                title="Toggle Theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className={`px-4 py-2 rounded ${currentTheme.button}`}
              >
                Logout
              </button>
            </div>
          </header>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

function getLinkClass(currentPath, path, theme) {
  return currentPath === path
    ? `${theme.linkActive} font-medium`
    : `${theme.text} ${theme.linkHover}`;
}

export default ContractDashboard;
