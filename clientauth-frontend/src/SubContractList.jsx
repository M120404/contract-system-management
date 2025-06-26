import React, { useEffect, useState } from 'react';
import { getAllSubContracts } from './api/subcontractApi';

const SubContractList = () => {
  const [subContracts, setSubContracts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllSubContracts();
      setSubContracts(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Subcontracts</h2>
      <ul className="space-y-2">
        {subContracts.map((sc) => (
          <li key={sc.id} className="p-3 border rounded">
            <strong>{sc.title}</strong> - Status: {sc.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubContractList;
