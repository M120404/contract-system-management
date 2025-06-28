import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { auth } from './firebase';

const contractTypes = [
  'Hardware Contract',
  'Software Solution',
  'Service Agreement',
  'Consulting Contract',
  'Non-Disclosure Agreement',
];

const CreateContract = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      heading: 'text-[#3ab6de]',
      button: 'bg-[#3ab6de] hover:bg-[#33a5cb] text-white',
      input: 'bg-white border-gray-300',
      label: 'text-gray-600',
      select: 'bg-white border-gray-300'
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      heading: 'text-[#33a5cb]',
      button: 'bg-[#33a5cb] hover:bg-[#3ab6de] text-white',
      input: 'bg-gray-700 border-gray-600',
      label: 'text-gray-300',
      select: 'bg-gray-700 border-gray-600'
    }
  };

  const currentTheme = themeStyles[theme];

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
    subcontractIds: []
  });

  const [templates, setTemplates] = useState([]);
  const [subcontracts, setSubcontracts] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const idToken = await user.getIdToken();
        const headers = { Authorization: `Bearer ${idToken}` };

        const [templatesRes, subcontractsRes] = await Promise.all([
          axios.get('/api/templates', { headers }),
          axios.get('/api/subcontracts', { headers })
        ]);

        setTemplates(templatesRes.data);
        setSubcontracts(subcontractsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubcontractChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({ ...formData, subcontractIds: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not logged in");

      const idToken = await user.getIdToken();
      const headers = { Authorization: `Bearer ${idToken}` };

      // Construct payload with proper types matching backend DTO
      const contractPayload = {
        title: formData.title,
        customer: formData.customer,
        contractNumber: formData.contractNumber,
        contractType: formData.contractType,
        rep: formData.rep,
        effectiveDate: formData.effectiveDate || null,
        invoiceTiming: formData.invoiceTiming,
        lastInvoicedDate: formData.lastInvoicedDate || null,
        lastStatementDate: formData.lastStatementDate || null,
        unusedAmount: formData.unusedAmount ? Number(formData.unusedAmount) : 0,
        overageAmount: formData.overageAmount ? Number(formData.overageAmount) : 0,
        contractTemplateId: formData.contractTemplateId ? Number(formData.contractTemplateId) : null,
        description: formData.description,
        subcontractIds: formData.subcontractIds.map(id => Number(id)),
        createdByEmail: user.email
      };

      console.log("Final payload:", contractPayload);

      // Create contract
      const response = await axios.post('http://localhost:8081/api/contracts', contractPayload, { headers });

      // Link subcontracts if any selected
      if (contractPayload.subcontractIds.length > 0) {
        await Promise.all(
          contractPayload.subcontractIds.map(subId =>
            axios.patch(`/api/subcontracts/${subId}`, {
              contract_id: response.data.id
            }, { headers })
          )
        );
      }

      setMessage('Contract created successfully!');
      setTimeout(() => navigate('/contracts'), 1500);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      setMessage(
        error.response?.data?.message ||
        error.message ||
        'Failed to create contract. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} py-10 px-4`}>
      <div className={`max-w-5xl mx-auto ${currentTheme.card} p-8 rounded-xl shadow-md border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <h2 className={`text-3xl font-semibold ${currentTheme.heading} border-b pb-4 mb-6`}>Create Contract</h2>

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
            ['Unused Amount', 'unusedAmount', 'number'],
            ['Overage Amount', 'overageAmount', 'number']
          ].map(([label, name, type = 'text']) => (
            <div key={name}>
              <label htmlFor={name} className={`block text-sm font-medium ${currentTheme.label} mb-1`}>{label}</label>
              {type === 'select' ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${currentTheme.select}`}
                  required
                >
                  {contractTypes.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${currentTheme.input}`}
                  required={type !== 'date' && type !== 'number'}
                />
              )}
            </div>
          ))}

          {/* Template Selection */}
          <div className="col-span-2">
            <label htmlFor="contractTemplateId" className={`block text-sm font-medium ${currentTheme.label} mb-1`}>
              Select Contract Template
            </label>
            <select
              name="contractTemplateId"
              value={formData.contractTemplateId}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${currentTheme.select}`}
            >
              <option value="">-- Select a template --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.templateName} (v{t.version})</option>
              ))}
            </select>
          </div>

          {/* Subcontracts */}
          <div className="col-span-2">
            <label htmlFor="subcontractIds" className={`block text-sm font-medium ${currentTheme.label} mb-1`}>
              Link Subcontracts (Hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              name="subcontractIds"
              value={formData.subcontractIds}
              onChange={handleSubcontractChange}
              className={`w-full border rounded-md px-3 py-2 h-32 ${currentTheme.select}`}
            >
              {subcontracts.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.title}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className={`block text-sm font-medium ${currentTheme.label} mb-1`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 h-28 resize-none ${currentTheme.input}`}
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${currentTheme.button} font-medium px-6 py-2 rounded-md transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Saving...' : 'Save Contract'}
            </button>
          </div>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateContract;