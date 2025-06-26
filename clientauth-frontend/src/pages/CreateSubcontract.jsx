import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Adjust path as needed
import { getAuth } from 'firebase/auth';

const contractTypes = [
  'Hardware Contract',
  'Software Solution',
  'Service Agreement',
  'Consulting Contract',
  'Non-Disclosure Agreement',
];

const CreateSubcontract = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-blue-50';
  const cardColor = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const labelColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 text-white' : 'bg-white text-black';
  const inputBorder = isDark ? 'border-gray-600' : 'border-gray-300';

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
  });

  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState('');
  const [createdContractId, setCreatedContractId] = useState(null);

  useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No user is logged in.");
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await axios.get('http://localhost:8081/templates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTemplates(res.data);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  fetchTemplates();
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setMessage('You are not authenticated. Please log in again.');
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await axios.post(
        'http://localhost:8081/subcontracts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCreatedContractId(response.data.id);
      setMessage('Subcontract saved successfully!');
    } catch (error) {
      console.error('Error creating subcontract:', error);
      setMessage('Error creating subcontract. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} py-10 px-4 transition-colors`}>
      <div className={`max-w-5xl mx-auto ${cardColor} p-8 rounded-xl shadow-md border transition-colors`}>
        <h2 className="text-3xl font-semibold text-[#3ab6de] border-b pb-4 mb-6">Create Subcontract</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6">
          {[ 
            ['Contract Title', 'title'], ['Customer', 'customer'], ['Contract Number', 'contractNumber'],
            ['Contract Type', 'contractType', 'select'], ['Rep', 'rep'],
            ['Effective Date', 'effectiveDate', 'date'], ['Invoice Timing', 'invoiceTiming'],
            ['Last Statement Date', 'lastStatementDate', 'date'],
            ['Last Invoiced Date', 'lastInvoicedDate', 'date'],
            ['Unused Amount', 'unusedAmount'], ['Overage Amount', 'overageAmount'],
          ].map(([label, name, type = 'text']) => (
            <div key={name}>
              <label htmlFor={name} className={`block text-sm font-medium mb-1 ${labelColor}`}>{label}</label>
              {type === 'select' ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full ${inputBg} ${inputBorder} border rounded-md px-3 py-2`}
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
                  className={`w-full ${inputBg} ${inputBorder} border rounded-md px-3 py-2`}
                />
              )}
            </div>
          ))}

          {/* Template Dropdown */}
          <div className="col-span-2">
            <label htmlFor="contractTemplateId" className={`block text-sm font-medium mb-1 ${labelColor}`}>
              Select Contract Template
            </label>
            <select
              name="contractTemplateId"
              value={formData.contractTemplateId}
              onChange={handleChange}
              className={`w-full ${inputBg} ${inputBorder} border rounded-md px-3 py-2`}
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
                className="text-blue-500 text-sm underline mt-1 block"
              >
                View selected template
              </a>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className={`block text-sm font-medium mb-1 ${labelColor}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full ${inputBg} ${inputBorder} border rounded-md px-3 py-2 h-28 resize-none`}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#3ab6de] text-white font-medium px-6 py-2 rounded-md hover:bg-[#33a5cb] transition"
            >
              Save Subcontract
            </button>
          </div>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateSubcontract;
