import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'; // Import MUI Dialog components

// Import the new components
import CodingAssessmentRound from './CodingAssessmentRound';
import TechnicalRound from './TechnicalRound';
import HRRound from './HRRound';

const fetchIntroduction = (t) => {
    return t('default_session_introduction');
  } 


const Interview = () => {
  const { t } = useTranslation();
  const { sessionId: paramSessionId } = useParams();
  const navigate = useNavigate();

  // State for interview setup form
  const [candidateName, setCandidateName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInterviewSetup, setShowInterviewSetup] = useState(true);

  // State for interview session
  const [session, setSession] = useState(null);
  const [currentStage, setCurrentStage] = useState('setup'); // 'setup', 'introduction', 'coding', 'technical', 'hr', 'report'
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(paramSessionId); // Use local state for sessionId

  // Fullscreen and violation states
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const MAX_VIOLATIONS = 1;
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [showViolationPrompt, setShowViolationPrompt] = useState(false);

  // Refs to hold the latest state values for the fullscreen event listener
  const currentStageRef = useRef(currentStage);
  const interviewCompletedRef = useRef(interviewCompleted);
  const violationCountRef = useRef(violationCount);
  const navigateRef = useRef(navigate);
  const tRef = useRef(t);

  useEffect(() => {
    currentStageRef.current = currentStage;
    interviewCompletedRef.current = interviewCompleted;
    violationCountRef.current = violationCount;
    navigateRef.current = navigate;
    tRef.current = t;
  }, [currentStage, interviewCompleted, violationCount, navigate, t]);

  // Sample roles for quick start
  const sampleRoles = [
    {
      title: 'Frontend Developer',
      description:
        'We are looking for a skilled Frontend Developer with experience in React, JavaScript, and modern web technologies. The candidate should have strong problem-solving skills and experience with responsive design.'
    },
    {
      title: 'Data Scientist',
      description:
        'Seeking a Data Scientist with expertise in Python, machine learning, and statistical analysis. Experience with TensorFlow, pandas, and data visualization tools is preferred.'
    },
    {
      title: 'Product Manager',
      description:
        'Looking for an experienced Product Manager to lead product strategy and development. Strong communication skills, experience with agile methodologies, and customer-focused mindset required.'
    }
  ];

  const fillSampleRole = (role) => {
    setRoleTitle(role.title);
    setRoleDescription(role.description);
  };

  // Handle starting a new interview session from the form
  const handleStartInterviewSession = async () => {
    if (!candidateName.trim() || !roleTitle.trim() || !roleDescription.trim()) {
      setError(t('please_fill_in_candidate_name,_role_title,_and_description'));
      return;
    }

    setLoading(true);
    setError('');
    setSessionId(null); // Clear previous session ID if any

    try {
      const response = await axios.post('https://ai-interview-bot-backend.onrender.com/api/generate-interview', {
        candidateName: candidateName.trim(),
        roleTitle: roleTitle.trim(),
        roleDescription: roleDescription.trim()
      });

      const { sessionId: newSessionId, introduction } = response.data;

      setSession({
        id: newSessionId,
        candidateName: candidateName.trim(),
        roleTitle: roleTitle.trim(),
        roleDescription: roleDescription.trim(),
        introduction: introduction,
      });
      setSessionId(newSessionId);
      navigate(`/interview/${newSessionId}`); // Update URL immediately
    } catch (err) {
      console.error('Error creating interview:', err);
      setError(err.response?.data?.error || t('failed_to_create_interview'));
    } finally {
      setLoading(false);
    }
  };

  // Load session data if sessionId is present in URL (for direct access or refresh)
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) return;

      try {
        const response = await axios.get(`https://ai-interview-bot-backend.onrender.com/api/session/${sessionId}`);
        const introduction = await fetchIntroduction(t);
        setSession({ ...response.data, introduction, candidateName: response.data.candidateName || 'Candidate' }); // Ensure candidateName is set
        setCurrentStage('introduction'); // If session loaded, go to introduction or first stage
      } catch (err) {
        console.error('Error loading session:', err);
        setError(t('interview_session_not_found'));
        setCurrentStage('setup'); // Show setup form if session not found
      }
    };

    loadSession();
  }, [sessionId, t]);

  // Effect to show fullscreen prompt after session is loaded and stage is introduction
  useEffect(() => {
    if (session && currentStage === 'introduction') {
      setShowFullscreenPrompt(true);
    }
  }, [session, currentStage]);

  // Speak introduction slowly
  useEffect(() => {
    if (session?.introduction && currentStage === 'introduction') {
      const utterance = new SpeechSynthesisUtterance(t('default_session_introduction'));
      utterance.rate = 0.85; // slow speech
      utterance.pitch = 1;
      utterance.lang = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [session, currentStage, i18n.language, t]);

  // Handlers for stage completion
  const handleIntroductionComplete = () => {
    setCurrentStage('coding');
  };

  const enterFullScreen = () => {
    console.log('Attempting to enter full-screen mode.');
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    console.log('Fullscreen change detected. Current fullscreenElement:', document.fullscreenElement);
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      console.log('Exited fullscreen mode.');
      // Exited fullscreen
      if (currentStageRef.current !== 'setup' && currentStageRef.current !== 'report' && !interviewCompletedRef.current) {
        console.log('Interview is active, tracking violation.');
        setViolationCount(prev => {
          const newCount = prev + 1;
          console.log(`Violation count: ${newCount}, Max violations: ${MAX_VIOLATIONS}`);
          if (newCount > MAX_VIOLATIONS) {
            toast.error(tRef.current('interview_terminated_fullscreen_violations'));
            console.log('Max violations exceeded. Terminating interview and navigating to home.');
            // Removed redundant exitFullScreen() call here as the document is already out of fullscreen
            navigateRef.current('/'); // Navigate to home page
            return prev; // Don't update count if terminating
          } else {
            setShowViolationPrompt(true); // Show violation prompt instead of toast
            // toast.warn(tRef.current('fullscreen_violation_warning', { count: newCount, remaining: MAX_VIOLATIONS - newCount }));
            console.log(`Fullscreen violation warning: ${newCount} of ${MAX_VIOLATIONS - newCount} remaining.`);
          }
          return newCount;
        });
      } else {
        console.log('Not tracking violation: currentStage is setup/report or interview completed.');
      }
    } else {
      console.log('Entered fullscreen mode.');
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      console.log('Removing fullscreen change event listeners.');
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []); // Empty dependency array to ensure this effect runs only once on mount and cleanup on unmount

  const [codingVideo, setCodingVideo] = useState(null);
  const [technicalVideo, setTechnicalVideo] = useState(null);
  const [hrVideo, setHrVideo] = useState(null);

  const handleCodingComplete = async ({ code, video, submitted }) => {
    console.log('Coding Round Completed with answers:', code);
    console.log('Coding Video:', video);
    setCodingVideo(video);
    try {
      await axios.post(`https://ai-interview-bot-backend.onrender.com/api/session/${sessionId}/complete-round`, { roundType: 'coding', submitted });
      console.log('Coding round marked as completed on backend.');
    } catch (error) {
      console.error('Error marking coding round complete:', error);
      toast.error(t('failed_to_mark_coding_round_complete'));
    }
    setCurrentStage('technical');
  };

  const handleTechnicalComplete = async ({ answers, video, submitted }) => {
    console.log('Technical Round Completed with answers:', answers);
    console.log('Technical Video:', video);
    setTechnicalVideo(video);
    try {
      await axios.post(`https://ai-interview-bot-backend.onrender.com/api/session/${sessionId}/complete-round`, { roundType: 'technical', submitted });
      console.log('Technical round marked as completed on backend.');
    } catch (error) {
      console.error('Error marking technical round complete:', error);
      toast.error(t('failed_to_mark_technical_round_complete'));
    }
    setCurrentStage('hr');
  };

  const handleHRComplete = async ({ answers, video, submitted }) => {
    console.log('HR Round Completed with answers:', answers);
    console.log('HR Video:', video);
    setHrVideo(video);
    try {
      await axios.post(`https://ai-interview-bot-backend.onrender.com/api/session/${sessionId}/complete-round`, { roundType: 'hr', submitted });
      console.log('HR round marked as completed on backend.');
    } catch (error) {
      console.error('Error marking HR round complete:', error);
      toast.error(t('failed_to_mark_hr_round_complete'));
    }
    setInterviewCompleted(true); // Mark interview as completed
    if (document.fullscreenElement) { // Only exit if currently in fullscreen
      exitFullScreen(); // Exit fullscreen gracefully after completion
    }
    navigate("/"); // Navigate to report after all rounds, passing video data and candidate name
  };

  const renderStage = () => {
    const stageVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    if (!session && currentStage !== 'setup') {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <h2 className="text-2xl">{t('loading_interview')}</h2>
          {error && (
            <div className="bg-red-700 text-white p-3 rounded-md mt-4">
              {t(error)}
            </div>
          )}
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          variants={stageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          {(() => {
            switch (currentStage) {
              case 'setup':
                return (
                  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                    <ToastContainer />
                    <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg max-w-2xl w-full">
                      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t('create_new_interview')}</h2>
                      {error && (
                        <div className="bg-red-700 text-white p-3 rounded-md mb-4">
                          {t(error)}
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500"
                          placeholder={t('candidate_name_label')}
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          disabled={loading}
                        />
                        <input
                          type="text"
                          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500"
                          placeholder={t('job_title_label')}
                          value={roleTitle}
                          onChange={(e) => setRoleTitle(e.target.value)}
                          disabled={loading}
                        />
                        <textarea
                          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 h-32 resize-none"
                          placeholder={t('role_description_label')}
                          value={roleDescription}
                          onChange={(e) => setRoleDescription(e.target.value)}
                          disabled={loading}
                        ></textarea>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-bold flex items-center justify-center space-x-2 w-full"
                          onClick={handleStartInterviewSession}
                          disabled={
                            loading ||
                            !candidateName.trim() ||
                            !roleTitle.trim() ||
                            !roleDescription.trim()
                          }
                        >
                          {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.122a1 1 0 010 1.756l-4.695 2.683A1 1 0 019 14.683V9.317a1 1 0 011.057-.879l4.695 2.683z"></path></svg>
                          )}
                          <span>{loading ? t('generating_interview') : t('start_ai_interview')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Start Examples */}
                    <div className="mt-8 p-8 bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full">
                      <h3 className="text-2xl font-bold mb-4">{t('quick_start')}</h3>
                      <p className="text-gray-400 mb-6">
                        {t('try_sample_roles')}
                      </p>

                      {sampleRoles.map((role, index) => (
                        <div key={index} className="mb-4">
                          <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full font-bold cursor-pointer"
                            onClick={() => fillSampleRole(role)}
                          >
                            {t(role.title.toLowerCase().replace(/\s/g, '_'))}
                          </button>
                          <p className="text-gray-400 mt-2">
                            {t(`${role.title.toLowerCase().replace(/\s/g, '_')}_description`)}
                          </p>
                          {index < sampleRoles.length - 1 && <hr className="my-4 border-gray-700" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'introduction':
                return (
                  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-3xl w-full text-center">
                      <h2 className="text-4xl font-bold text-yellow-500 mb-4">
                        {t('welcome_to_your_interview')}
                      </h2>
                      <h3 className="text-2xl text-gray-300 mb-6">
                        {t('position')}: {session.roleTitle}
                      </h3>

                      <div className="bg-gray-800 p-6 rounded-md mb-6 text-left">
                        <p className="text-gray-200 italic">
                        {t('default_session_introduction')}</p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <span className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {t('multi_stage_interview')}
                        </span>
                        <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {t('ai_powered_evaluation')}
                        </span>
                      </div>

                      <div className="bg-blue-800 text-white p-4 rounded-md mb-6 text-left">
                        <p className="font-bold mb-2">{t('before_we_begin')}:</p>
                        <ul className="list-disc list-inside text-sm">
                          <li>{t('ensure_quiet_environment')}</li>
                          <li>{t('check_camera_microphone')}</li>
                          <li>{t('take_time_responses')}</li>
                          <li>{t('re_record_any_answer')}</li>
                        </ul>
                      </div>

                      {error && (
                        <div className="bg-red-700 text-white p-3 rounded-md mb-4">
                          {t(error)}
                        </div>
                      )}

                      <div className="text-center">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-bold flex items-center justify-center space-x-2 mx-auto"
                          onClick={() => {
                            window.speechSynthesis.cancel();
                            handleIntroductionComplete();
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.122a1 1 0 010 1.756l-4.695 2.683A1 1 0 019 14.683V9.317a1 1 0 011.057-.879l4.695 2.683z"></path></svg>
                          <span>{t('start_coding_round')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              case 'coding':
                return (
                  <>
                    {currentStage !== 'setup' && currentStage !== 'report' && !interviewCompleted && (
                      <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
                        {t('violations_detected')}: {violationCount} / {MAX_VIOLATIONS}
                      </div>
                    )}
                    <CodingAssessmentRound onComplete={handleCodingComplete} roleTitle={session.roleTitle} candidateName={session.candidateName} sessionId={sessionId} />
                  </>
                );
              case 'technical':
                return (
                  <>
                    {currentStage !== 'setup' && currentStage !== 'report' && !interviewCompleted && (
                      <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
                        {t('violations_detected')}: {violationCount} / {MAX_VIOLATIONS}
                      </div>
                    )}
                    <TechnicalRound onComplete={handleTechnicalComplete} roleTitle={session.roleTitle} candidateName={session.candidateName} sessionId={sessionId} />
                  </>
                );
              case 'hr':
                return (
                  <>
                    {currentStage !== 'setup' && currentStage !== 'report' && !interviewCompleted && (
                      <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
                        {t('violations_detected')}: {violationCount} / {MAX_VIOLATIONS}
                      </div>
                    )}
                    <HRRound onComplete={handleHRComplete} roleTitle={session.roleTitle} candidateName={session.candidateName} sessionId={sessionId} />
                  </>
                ); 
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer />
      {renderStage()}

      {/* Fullscreen Prompt Dialog */}
      <Dialog
        
        open={showFullscreenPrompt}
        aria-labelledby="fullscreen-dialog-title"
        aria-describedby="fullscreen-dialog-description"
      >
        <DialogTitle id="fullscreen-dialog-title">{t('enter_fullscreen_mode')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="fullscreen-dialog-description">
            {t('fullscreen_prompt_message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowFullscreenPrompt(false);
            // If user declines, they can still proceed, but violations will be tracked
            setCurrentStage('introduction');
          }} color="error">
            {t('decline')}
          </Button>
          <Button onClick={() => {
            enterFullScreen(); // Call enterFullScreen first
            setShowFullscreenPrompt(false);
            setCurrentStage('introduction');
          }} color="primary" autoFocus>
            {t('enter_fullscreen')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fullscreen Violation Dialog */}
      <Dialog
        open={showViolationPrompt}
        aria-labelledby="violation-dialog-title"
        aria-describedby="violation-dialog-description"
      >
        <DialogTitle id="violation-dialog-title">{t('fullscreen_violation_warning', { count: violationCount, remaining: MAX_VIOLATIONS - violationCount })}</DialogTitle>
        <DialogContent>
          <DialogContentText id="violation-dialog-description">
            {t('fullscreen_prompt_message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowViolationPrompt(false);
            // If user declines, they can still proceed, but violations will be tracked
          }} color="error">
            {t('decline')}
          </Button>
          <Button onClick={() => {
            enterFullScreen(); // Call enterFullScreen first
            setShowViolationPrompt(false);
          }} color="primary" autoFocus>
            {t('enter_fullscreen')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Interview;
