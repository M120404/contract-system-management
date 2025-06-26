import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ThemeSwitcher from './components/ThemeSwitcher';

const ContractDashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-[#3ab6de]">OPPORTUNITIES</h2>
        </div>

        <div className="p-4">
          <Link
            to="/create-template"
            className="inline-flex items-center bg-[#3ab6de] text-white px-4 py-2 rounded-md hover:bg-[#33a5cb] transition w-full justify-center"
          >
            <FaPlus className="mr-2" />
            Create Template
          </Link>
        </div>

        <nav className="px-4 py-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="font-semibold text-gray-500 uppercase text-xs mt-4">Lists</div>
          <Link to="/contracts/create" className={getLinkClass(location.pathname, '/contracts/create')}>
            Create Contract
          </Link>
          <Link to="/contracts/view" className={getLinkClass(location.pathname, '/contracts/view')}>
            Show All
          </Link>
          <Link to="/subcontracts/create" className={getLinkClass(location.pathname, '/subcontracts/create')}>
            Create Subcontract
          </Link>
          <Link to="/contracts/review" className={getLinkClass(location.pathname, '/contracts/review')}>
            Review Queue
          </Link>
          <Link to="/contracts/assign-review" className={getLinkClass(location.pathname, '/contracts/assign-review')}>
            Assign Review
          </Link>

          <div className="mt-6 font-semibold text-gray-500 uppercase text-xs">Views</div>
          <Link to="/contracts/links" className={getLinkClass(location.pathname, '/contracts/links')}>
            Useful Links
          </Link>
          <Link to="/contracts/audit-logs" className={getLinkClass(location.pathname, '/contracts/audit-logs')}>
            Audit Logs
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <header className="bg-white dark:bg-gray-800 shadow px-6 py-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Contract Management System
          </h1>
          <ThemeSwitcher />
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function getLinkClass(currentPath, path) {
  return `block px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 ${
    currentPath === path
      ? 'bg-blue-100 dark:bg-gray-700 font-medium text-[#33a5cb]'
      : 'text-gray-700 dark:text-gray-300'
  }`;
}

export default ContractDashboard;
