
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppointmentPage from './pages/AppointmentPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './pages/ProtectedRoute';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';


import PdcPmsLogin from './pages/PdcPmsLogin';
import PdcPmsDashboard from './pages/PdcPmsDashboard';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<AppointmentPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
            <Route path="/pdc_pms" element={<PdcPmsLogin />} />
            <Route path="/pdc_pms/dashboard" element={<PdcPmsDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
