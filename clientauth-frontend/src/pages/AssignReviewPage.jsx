import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AssignReviewPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [contractId, setContractId] = useState('');
  const [message, setMessage] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  const { theme } = useTheme();

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      input: 'border-gray-300',
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      input: 'border-gray-600',
    },
  };

  const styles = themeStyles[theme];

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("contractId");
    if (id) setContractId(id);
  }, [location]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/users')
      .then(res => {
        setUsers(res.data);
        setLoadingUsers(false);
      })
      .catch(err => {
        console.error("Failed to fetch users:", err);
        setLoadingUsers(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractId || !selectedUserId) return;

    try {
      await axios.post(`/api/contracts/${contractId}/assign-review`, {
        reviewerId: selectedUserId
      });
      setMessage('Contract assigned for review successfully.');
    } catch (err) {
      console.error('Assignment failed:', err);
      setMessage('Failed to assign contract for review.');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${styles.background} ${styles.text}`}>
      <div className={`max-w-lg mx-auto p-6 rounded shadow ${styles.card}`}>
        <h2 className="text-2xl font-bold mb-6 text-[#3ab6de]">Assign Contract for Review</h2>

        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Contract ID</label>
              <input
                type="text"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                className={`w-full p-2 border rounded ${styles.input} ${styles.text} bg-transparent`}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Select Reviewer</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className={`w-full p-2 border rounded ${styles.input} ${styles.text} bg-transparent`}
                required
              >
                <option value="">-- Select --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.username}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#3ab6de] hover:bg-[#33a5cb] text-white px-4 py-2 rounded w-full"
            >
              Assign
            </button>

            {message && (
              <p className="mt-2 text-center font-medium text-green-500">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignReviewPage;
