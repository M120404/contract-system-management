import React, { useEffect, useState } from 'react';

const AuditLogTable = ({ contractId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contracts/${contractId}/audit-logs`)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching audit logs:', err);
        setLoading(false);
      });
  }, [contractId]);

  if (loading) return <p>Loading audit logs...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Audit Log</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Time</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{new Date(log.performedAt).toLocaleString()}</td>
              <td className="p-2 border">{log.performedBy?.email || 'Unknown'}</td>
              <td className="p-2 border">
                {log.action}: {log.fieldName ? (
                  <>
                    <strong>{log.fieldName}</strong> changed from <em>{log.oldValue}</em> to <em>{log.newValue}</em>
                  </>
                ) : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
