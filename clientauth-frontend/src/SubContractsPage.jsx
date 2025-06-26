import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const contractTypes = [
  'Hardware Contract',
  'Software Solution',
  'Service Agreement',
  'Consulting Contract',
  'Non-Disclosure Agreement',
];

const CreateContract = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    contractNumber: '',
    contractType: contractTypes[0],
    rep: '',
    effectiveDate: '',
    invoiceTiming: '',
    lastStatementDate: '',
    lastInvoicedDate: '',
    unusedAmount: '',
    overageAmount: '',
    contractTemplateId: '',
    description: '',
    subcontractIds: [],
  });

  const [templates, setTemplates] = useState([]);
  const [subcontracts, setSubcontracts] = useState([]);
  const [message, setMessage] = useState('');
  const [createdContractId, setCreatedContractId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const [templatesRes, subcontractRes] = await Promise.all([
          axios.get('http://localhost:8081/templates', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8081/subcontracts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setTemplates(templatesRes.data);
        setSubcontracts(subcontractRes.data);
      } catch (err) {
        console.error('Failed to fetch templates or subcontracts:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubcontractChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, subcontractIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post('http://localhost:8081/contracts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreatedContractId(response.data.id);
      setMessage('Contract saved successfully!');
    } catch (error) {
      console.error('Error creating contract:', error);
      setMessage('Error creating contract. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-700 border-b pb-4 mb-6">Create Contract</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6">
          {[
            ['Contract Title', 'title'],
            ['Customer', 'customer'],
            ['Contract Number', 'contractNumber'],
            ['Contract Type', 'contractType', 'select'],
            ['Rep', 'rep'],
            ['Effective Date', 'effectiveDate', 'date'],
            ['Invoice Timing', 'invoiceTiming'],
            ['Last Statement Date', 'lastStatementDate', 'date'],
            ['Last Invoiced Date', 'lastInvoicedDate', 'date'],
            ['Unused Amount', 'unusedAmount'],
            ['Overage Amount', 'overageAmount'],
          ].map(([label, name, type = 'text']) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
              {type === 'select' ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  {contractTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              )}
            </div>
          ))}

          {/* Template Selector */}
          <div className="col-span-2">
            <label htmlFor="contractTemplateId" className="block text-sm font-medium text-gray-600 mb-1">
              Select Contract Template
            </label>
            <select
              name="contractTemplateId"
              value={formData.contractTemplateId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="">-- Select a template --</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.templateName} (v{template.version})
                </option>
              ))}
            </select>

            {formData.contractTemplateId && (
              <a
                href={`http://localhost:8081/templates/${formData.contractTemplateId}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline mt-1 block"
              >
                View selected template
              </a>
            )}
          </div>

          {/* Subcontract Multi-Selector */}
          <div className="col-span-2">
            <label htmlFor="subcontractIds" className="block text-sm font-medium text-gray-600 mb-1">
              Link Subcontracts (optional)
            </label>
            <select
              multiple
              name="subcontractIds"
              value={formData.subcontractIds}
              onChange={handleSubcontractChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white h-32"
            >
              {subcontracts.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.title || `Subcontract #${sub.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-28 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#3ab6de] text-white font-medium px-6 py-2 rounded-md hover:bg-[#33a5cb] transition"
            >
              Save Contract
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default CreateContract;
