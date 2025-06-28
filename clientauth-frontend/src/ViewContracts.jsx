import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { auth } from './firebase';

const ViewContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      const token = await user.getIdToken();
      console.log("Token being sent:", token);


      const response = await axios.get('http://localhost:8081/api/contracts/my-auth', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ Log the contracts received from backend
      console.log("Contracts received from backend:", response.data);

      setContracts(response.data);
    } catch (err) {
      console.error('Failed to load contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleSubmitReview = async (contractId) => {
    alert('Simulated submit for review.');
    setContracts(prev =>
      prev.map(c =>
        c.id === contractId ? { ...c, status: 'PENDING_REVIEW' } : c
      )
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'DRAFT':
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading your contracts...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Contracts</h2>
        <input
          type="text"
          placeholder="Search contracts..."
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            {filteredContracts.map(contract => {
              const status = contract.status || 'DRAFT';
              return (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/contracts/details/${contract.id}`} className="text-blue-600 hover:underline">
                      {contract.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.contractType || '-'}</td>
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
                      <Link to={`/assign-review/${contract.id}`} className="text-purple-600 hover:text-purple-900 mr-3">
                        Assign
                      </Link>
                    )}
                    <Link to={`/contracts/edit/${contract.id}`} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-400 italic">Subcontracts pending implementation</span>
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
