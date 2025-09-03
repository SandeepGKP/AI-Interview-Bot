// client/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import i18n from './i18n'; // Import i18n
import { useTranslation } from 'react-i18next'; // Import useTranslation
// Components
import Home from './components/Home';
import Interview from './components/Interview';
import RecruiterDashboard from './components/RecruiterDashboard';
import Report from './components/Report';
import Header from './components/Header';
import CandidateDetails from './components/CandidateDetails';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Visualizer from './components/Visualizer/Visualizer';
import Gallery from './components/Gallery';
import About from './components/About'; // Import the new About component
import Footer from './components/Footer'; // Prepare to import the Footer component

function App() {
  const { i18n } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    // You can set the language based on user preferences or browser settings
    // For now, let's keep it simple and use 'en' as default or detect from browser
    // i18n.changeLanguage('en');
  }, []);

  return (
    <Router>
      <AuthGuard />
      <ToastContainer />
      <Footer /> {/* Add the Footer component here */}
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const { t } = useTranslation(); // Initialize useTranslation for content translation

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
          <Route path="/login" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Login />
            </motion.div>
          } />
          <Route path="/register" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Register />
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

function AuthGuard() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  // If user is not authenticated and not on login/register page, redirect to login
  if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Login />;
  }

  // If user is authenticated and on login/register page, redirect to home
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <MainContent />;
  }

  // Show main content for authenticated users or allow login/register for unauthenticated users
  return <MainContent />;
}

export default App;
