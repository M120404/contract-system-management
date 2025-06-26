import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const { contractId } = useParams(); // ✅ Get contractId from URL
  const { theme } = useTheme();

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-300',
      tableHeader: 'bg-gray-100',
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      border: 'border-gray-600',
      tableHeader: 'bg-gray-700',
    },
  };

  const styles = themeStyles[theme];

  useEffect(() => {
    fetch(`http://localhost:8080/api/audit-logs/contract/${contractId}`)
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Failed to fetch audit logs:", err));
  }, [contractId]);

  return (
    <div className={`min-h-screen p-6 ${styles.background} ${styles.text}`}>
      <div className={`max-w-6xl mx-auto p-6 rounded shadow ${styles.card}`}>
        <h1 className="text-2xl font-bold mb-6 text-[#3ab6de]">
          Audit Logs for Contract #{contractId}
        </h1>

        <div className="overflow-x-auto">
          <table className={`table w-full border ${styles.border}`}>
            <thead>
              <tr className={`${styles.tableHeader}`}>
                <th className={`px-4 py-2 border ${styles.border}`}>Action</th>
                <th className={`px-4 py-2 border ${styles.border}`}>Field</th>
                <th className={`px-4 py-2 border ${styles.border}`}>Old Value</th>
                <th className={`px-4 py-2 border ${styles.border}`}>New Value</th>
                <th className={`px-4 py-2 border ${styles.border}`}>Performed By</th>
                <th className={`px-4 py-2 border ${styles.border}`}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className={`px-4 py-2 border ${styles.border}`}>{log.action}</td>
                  <td className={`px-4 py-2 border ${styles.border}`}>{log.fieldName}</td>
                  <td className={`px-4 py-2 border ${styles.border}`}>{log.oldValue}</td>
                  <td className={`px-4 py-2 border ${styles.border}`}>{log.newValue}</td>
                  <td className={`px-4 py-2 border ${styles.border}`}>{log.performedBy}</td>
                  <td className={`px-4 py-2 border ${styles.border}`}>{new Date(log.performedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No audit logs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
