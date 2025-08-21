// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Home from './components/Home';
import Interview from './components/Interview';
import RecruiterDashboard from './components/RecruiterDashboard';
import Report from './components/Report';
import Header from './components/Header';
import CandidateDetails from './components/CandidateDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white"> {/* Apply global dark background */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview/:sessionId" element={<Interview />} />
          <Route path="/report/:sessionId" element={<Report />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/candidate/:candidateId" element={<CandidateDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
