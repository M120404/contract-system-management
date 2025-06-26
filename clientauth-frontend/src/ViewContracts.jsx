import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ViewContracts = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [contracts, setContracts] = useState([
    {
      id: 1,
      title: 'Website Development Contract',
      contract_type: 'Service',
      status: 'DRAFT',
      createdAt: new Date(),
      subcontracts: [],
    },
    {
      id: 2,
      title: 'Product Supply Agreement',
      contract_type: 'Procurement',
      status: 'PENDING_REVIEW',
      createdAt: new Date(),
      subcontracts: [
        { id: 101, title: 'Logistics Agreement' },
        { id: 102, title: 'Warehousing Subcontract' },
      ],
    },
    {
      id: 3,
      title: 'HR Outsourcing Agreement',
      contract_type: 'Outsourcing',
      status: 'APPROVED',
      createdAt: new Date(),
      subcontracts: [],
    },
    {
      id: 4,
      title: 'Annual Maintenance Contract',
      contract_type: 'Service',
      status: 'REJECTED',
      createdAt: new Date(),
      subcontracts: [],
    },
    {
      id: 5,
      title: 'Cloud Service SLA',
      contract_type: 'IT',
      status: 'DRAFT',
      createdAt: new Date(),
      subcontracts: [],
    },
    {
      id: 6,
      title: 'Consulting Agreement',
      contract_type: 'Consulting',
      status: 'PENDING_REVIEW',
      createdAt: new Date(),
      subcontracts: [{ id: 201, title: 'Analytics Subcontract' }],
    },
  ]);

  const filteredContracts = contracts.filter(contract => {
    const status = contract.status || 'DRAFT';
    const matchesFilter = filter === 'all' || status === filter.toUpperCase();
    const matchesSearch =
      contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmitReview = async (contractId) => {
    alert("Simulated submit for review.");
    setContracts(prev =>
      prev.map(c =>
        c.id === contractId ? { ...c, status: 'PENDING_REVIEW' } : c
      )
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Contracts</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search contracts..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcontracts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audit Logs</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContracts.map((contract) => {
              const status = contract.status || 'DRAFT';
              return (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/contracts/details/${contract.id}`} className="text-blue-600 hover:underline">
                      {contract.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.contract_type || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(status)}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {status === 'DRAFT' && (
                      <button
                        onClick={() => handleSubmitReview(contract.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Submit
                      </button>
                    )}
                    {status === 'PENDING_REVIEW' && (
                      <Link
                        to={`/assign-review/${contract.id}`}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        Assign
                      </Link>
                    )}
                    <Link 
                      to={`/contracts/edit/${contract.id}`} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contract.subcontracts?.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {contract.subcontracts.map((sub) => (
                          <li key={sub.id}>
                            <Link to={`/contracts/details/${sub.id}`} className="text-blue-500 hover:underline">
                              {sub.title || `Subcontract #${sub.id}`}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">No subcontracts</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/contracts/audit-logs/${contract.id}`} className="text-indigo-500 hover:underline">
                      View Logs
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewContracts;
