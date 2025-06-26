const token = await firebase.auth().currentUser.getIdToken();

axios.get('/subcontracts/my', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

import React, { useEffect, useState } from 'react';
import {
  fetchSubContracts,
  createSubContract,
  deleteSubContract
} from '../api/subcontracts';

const SubContracts = () => {
  const [subContracts, setSubContracts] = useState([]);
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchSubContracts().then(res => setSubContracts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSubContract(form);
    fetchSubContracts().then(res => setSubContracts(res.data));
    setForm({ title: '', startDate: '', endDate: '' });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">SubContracts</h2>
      
      <form onSubmit={handleSubmit} className="my-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="border p-2 mr-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">Create</button>
      </form>

      <ul>
        {subContracts.map(sc => (
          <li key={sc.id} className="mb-2">
            {sc.title} ({sc.startDate} to {sc.endDate})
            <button
              onClick={() => deleteSubContract(sc.id).then(() =>
                fetchSubContracts().then(res => setSubContracts(res.data))
              )}
              className="ml-2 text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubContracts;
