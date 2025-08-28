// client/src/App.js
import React from 'react';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// Components
import Home from './components/Home';
import Interview from './components/Interview';
import RecruiterDashboard from './components/RecruiterDashboard';
import Report from './components/Report';
import Header from './components/Header';
import CandidateDetails from './components/CandidateDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Visualizer from './components/Visualizer/Visualizer';
import Gallery from './components/Gallery';
import About from './components/About'; // Import the new About component
import Footer from './components/Footer'; // Prepare to import the Footer component

function App() {
  return (
    <Router>
      <MainContent />
      <ToastContainer />
      <Footer /> {/* Add the Footer component here */}
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw"
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: "100vw"
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-black text-white"> {/* Apply global dark background */}
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Home />
            </motion.div>
          } />
          <Route path="/interview/:sessionId?" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Interview />
            </motion.div>
          } />
          <Route path="/report/:sessionId" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Report />
            </motion.div>
          } />
          <Route path="/recruiter" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <RecruiterDashboard />
            </motion.div>
          } />
          <Route path="/candidate/:candidateId" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <CandidateDetails />
            </motion.div>
          } />
          <Route path="/visualizer" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Visualizer />
            </motion.div>
          } />
          <Route path="/gallery" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Gallery />
            </motion.div>
          } />
          <Route path="/about" element={ /* Add the new About route */
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <About />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
