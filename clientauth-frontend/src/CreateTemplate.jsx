import { useState } from 'react';
import axios from 'axios';
import { useTheme } from './context/ThemeContext';

const CreateTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('');
  const [version, setVersion] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      heading: 'text-[#3ab6de]',
      button: 'bg-[#3ab6de] hover:bg-[#33a5cb] text-white',
      input: 'bg-white border-gray-300 text-gray-900',
      label: 'text-gray-600',
      border: 'border-gray-200'
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      heading: 'text-[#33a5cb]',
      button: 'bg-[#33a5cb] hover:bg-[#3ab6de] text-white',
      input: 'bg-gray-700 border-gray-600 text-white',
      label: 'text-gray-300',
      border: 'border-gray-700'
    }
  };

  const currentTheme = themeStyles[theme];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!templateName || !category || !version || !effectiveDate || !file) {
      setMessage('Please fill out all fields and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('templateName', templateName);
    formData.append('category', category);
    formData.append('version', version);
    formData.append('effectiveDate', effectiveDate);
    formData.append('templateFile', file);

    try {
      await axios.post('http://localhost:8081/templates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Template uploaded successfully!');
      setTemplateName('');
      setCategory('');
      setVersion('');
      setEffectiveDate('');
      setFile(null);
    } catch (error) {
      setMessage('Failed to upload template.');
      console.error(error);
    }
  };

  return (
    <div className={`min-h-screen py-10 px-4 ${currentTheme.background}`}>
      <div className={`max-w-3xl mx-auto p-8 rounded-xl shadow-md border ${currentTheme.card} ${currentTheme.border}`}>
        <h2 className={`text-2xl font-semibold border-b pb-4 mb-6 ${currentTheme.heading}`}>Create Contract Template</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className={`w-full rounded-md px-3 py-2 border ${currentTheme.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full rounded-md px-3 py-2 border ${currentTheme.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className={`w-full rounded-md px-3 py-2 border ${currentTheme.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className={`w-full rounded-md px-3 py-2 border ${currentTheme.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>Upload Template File (PDF or Word)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={`w-full file-input file-input-bordered ${theme === 'dark' ? 'file-input-neutral' : 'file-input-primary'}`}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md transition ${currentTheme.button}`}
            >
              Save Template
            </button>
          </div>
        </form>

        {message && <p className={`mt-4 text-sm ${currentTheme.text}`}>{message}</p>}
      </div>
    </div>
  );
};

export default CreateTemplate;
