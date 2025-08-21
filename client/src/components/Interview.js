import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

// Import the new components
import CodingAssessmentRound from './CodingAssessmentRound';
import TechnicalRound from './TechnicalRound';
import HRRound from './HRRound';

const fetchIntroduction = async (roleTitle, roleDescription, t) => {
  try {
    const response = await axios.post('https://ai-interview-bot-backend.onrender.com/api/generate-groq-introduction', {
      roleTitle,
      roleDescription,
    });
    return response.data.introduction;
  } catch (error) {
    console.error('Error fetching introduction:', error);
    return t('default_interview_introduction_fallback');
  }
};

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
      setError('Please fill in candidate name, role title, and description');
      return;
    }

    setLoading(true);
    setError('');
    setSessionId(null); // Clear previous session ID if any

    try {
      // This initial call can just generate the session ID and basic info
      // The actual questions for each round will be fetched by their respective components
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
        // We don't need to store questions here, as each round fetches its own
      });
      setSessionId(newSessionId);
      setCurrentStage('introduction'); // Move to introduction stage
      navigate(`/interview/${newSessionId}`); // Update URL
    } catch (err) {
      console.error('Error creating interview:', err);
      setError(err.response?.data?.error || 'Failed to create interview. Please try again.');
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
        const introduction = await fetchIntroduction(response.data.roleTitle, response.data.roleDescription, t);
        setSession({ ...response.data, introduction });
        setCurrentStage('introduction'); // If session loaded, go to introduction or first stage
      } catch (err) {
        console.error('Error loading session:', err);
        setError('Interview session not found. Please check your link.');
        setCurrentStage('setup'); // Show setup form if session not found
      }
    };

    loadSession();
  }, [sessionId, t]);

  // Speak introduction slowly
  useEffect(() => {
    if (session?.introduction && currentStage === 'introduction') {
      const utterance = new SpeechSynthesisUtterance(session.introduction);
      utterance.rate = 0.85; // slow speech
      utterance.pitch = 1;
      utterance.lang = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [session, currentStage, i18n.language]);

  // Handlers for stage completion
  const handleIntroductionComplete = () => {
    setCurrentStage('coding');
  };

  const handleCodingComplete = (answers) => {
    console.log('Coding Round Completed with answers:', answers);
    // Here you might save coding answers to the session or backend
    setCurrentStage('technical');
  };

  const handleTechnicalComplete = (answers) => {
    console.log('Technical Round Completed with answers:', answers);
    // Here you might save technical answers to the session or backend
    setCurrentStage('hr');
  };

  const handleHRComplete = (answers) => {
    console.log('HR Round Completed with answers:', answers);
    // Here you might save HR answers to the session or backend
    navigate(`/report/${sessionId}`); // Navigate to report after all rounds
  };

  const renderStage = () => {
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

    switch (currentStage) {
      case 'setup':
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <ToastContainer />
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-2xl w-full">
              <h2 className="text-3xl font-bold text-center mb-6">Create New Interview</h2>
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
              <h3 className="text-2xl font-bold mb-4">Quick Start</h3>
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
                  {session.introduction}
                </p>
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
          <CodingAssessmentRound onComplete={handleCodingComplete} roleTitle={session.roleTitle} />
        );
      case 'technical':
        return (
          <TechnicalRound onComplete={handleTechnicalComplete} roleTitle={session.roleTitle} />
        );
      case 'hr':
        return (
          <HRRound onComplete={handleHRComplete} roleTitle={session.roleTitle} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer />
      {renderStage()}
    </div>
  );
};

export default Interview;
