// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Home from './components/Home';
import Interview from './components/Interview';
import RecruiterDashboard from './components/RecruiterDashboard';
import Report from './components/Report';
import Header from './components/Header';
import CandidateDetails from './components/CandidateDetails';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: '#e0f7fa' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/interview/:sessionId" element={<Interview />} />
            <Route path="/report/:sessionId" element={<Report />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/candidate/:candidateId" element={<CandidateDetails />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
