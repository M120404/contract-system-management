// src/App.js
import React, { useEffect } from 'react'; // ✅ import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import ContractDashboard from './ContractDashboard';
import ViewContracts from './ViewContracts';
import CreateContract from './CreateContract';
import ContractDetail from './ContractDetail';
import ReviewQueue from './ReviewQueue';
import CreateTemplate from './CreateTemplate';
import SubContractsPage from './pages/CreateSubcontract';
import AssignReviewPage from './pages/AssignReviewPage';
import AuditLogPage from './pages/AuditLogPage';
import CreateSubcontract from './pages/CreateSubcontract';
import { ThemeProvider } from './context/ThemeContext';
import ContractAuditLogs from './ContractAuditLogs';

function App() {
  useEffect(() => {
    document.title = "Contract Manager"; 
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/" element={<LoginPage />} />

          {/* All Contract-related Routes under dashboard */}
          <Route path="/contracts" element={<ContractDashboard />}>
            <Route index element={<ViewContracts />} />
            <Route path="view" element={<ViewContracts />} />
            <Route path="create" element={<CreateContract />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="details/:id" element={<ContractDetail />} />
            <Route path="edit/:id" element={<CreateContract />} />
            <Route path="subcontracts" element={<SubContractsPage />} />
            <Route path="subcontracts/create" element={<CreateSubcontract />} />
            <Route path="audit-logs" element={<AuditLogPage />} />
            <Route path="assign-review" element={<AssignReviewPage />} />
            <Route path="audit-logs/:contractId" element={<AuditLogPage />} />
          </Route>

          <Route path="/create-template" element={<CreateTemplate />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
