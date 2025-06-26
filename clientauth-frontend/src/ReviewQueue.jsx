import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';

const ReviewQueue = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      heading: 'text-[#3ab6de]',
      tableHeader: 'bg-gray-50 text-gray-500',
      tableRow: 'bg-white text-gray-700',
      buttonApprove: 'text-green-600 hover:text-green-900',
      buttonReject: 'text-red-600 hover:text-red-900',
      buttonView: 'text-blue-600 hover:text-blue-900'
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      heading: 'text-[#33a5cb]',
      tableHeader: 'bg-gray-700 text-gray-300',
      tableRow: 'bg-gray-800 text-white',
      buttonApprove: 'text-green-400 hover:text-green-200',
      buttonReject: 'text-red-400 hover:text-red-200',
      buttonView: 'text-blue-400 hover:text-blue-200'
    }
  };

  const styles = themeStyles[theme];

  useEffect(() => {
    const fetchPendingContracts = async () => {
      try {
        const response = await axios.get('/api/contracts/review');
        setContracts(response.data);
      } catch (error) {
        console.error("Failed to fetch contracts for review", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingContracts();
  }, []);

  const handleApprove = async (contractId) => {
    try {
      await axios.put(`/api/contracts/${contractId}/approve`);
      setContracts(contracts.filter(c => c.id !== contractId));
    } catch (error) {
      console.error("Failed to approve contract", error);
    }
  };

  const handleReject = async (contractId) => {
    try {
      await axios.put(`/api/contracts/${contractId}/reject`);
      setContracts(contracts.filter(c => c.id !== contractId));
    } catch (error) {
      console.error("Failed to reject contract", error);
    }
  };

  if (loading) return <div className={`${styles.text}`}>Loading...</div>;

  return (
    <div className={`min-h-screen py-10 px-4 ${styles.background} ${styles.text}`}>
      <h2 className={`text-xl font-semibold mb-6 ${styles.heading}`}>Contracts Pending Review</h2>

      {contracts.length === 0 ? (
        <div className={`${styles.card} shadow rounded-lg p-6 text-center`}>
          <p className={`${styles.text}`}>No contracts pending review</p>
        </div>
      ) : (
        <div className={`${styles.card} shadow rounded-lg overflow-hidden`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${styles.tableHeader}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted On</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className={`${styles.tableRow}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/contracts/details/${contract.id}`} className={styles.buttonView}>
                      {contract.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.contractType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.createdBy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(contract.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleApprove(contract.id)}
                      className={styles.buttonApprove}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(contract.id)}
                      className={styles.buttonReject}
                    >
                      Reject
                    </button>
                    <Link
                      to={`/contracts/details/${contract.id}`}
                      className={styles.buttonView}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
