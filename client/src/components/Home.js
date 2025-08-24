import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import TypewriterEffect from './TypewriterEffect'; // Import the new component

const Home = () => {
  const { t } = useTranslation();
  const [candidateName, setCandidateName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/interview'); // Navigate to the interview page
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #2a004a 0%, #000000 100%)' }}>
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0"></h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 shadow-lg transition duration-300 ease-in-out transform hover:scale-105" onClick={handleStartInterview}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span className="hidden sm:inline">{t('create_interview')}</span>
            <span className="sm:hidden">{t('create')}</span>
          </button>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-purple-800 to-indigo-900 p-6 sm:p-8 rounded-lg overflow-hidden shadow-2xl">
          <div className="lg:w-1/2 z-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-purple-200">
              <TypewriterEffect text={t('master_your_next_interview')} typingDelay={100} deletingDelay={100} pauseDelay={2000} />
            </h2>
            <p className="text-purple-300 text-base sm:text-lg mb-8 opacity-90">
              {t('home_tagline')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-700 bg-opacity-50 p-4 rounded-lg flex items-center space-x-3 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="w-4 h-4 rounded-full bg-purple-400 animate-pulse"></div>
                <div>
                  <h3 className="font-bold text-purple-100">{t('ai_powered_feature')}</h3>
                  <p className="text-sm text-purple-200 opacity-80">{t('ai_powered_description')}</p>
                </div>
              </div>
              <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-lg flex items-center space-x-3 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse"></div>
                <div>
                  <h3 className="font-bold text-indigo-100">{t('voice_interview_feature')}</h3>
                  <p className="text-sm text-indigo-200 opacity-80">{t('voice_interview_description')}</p>
                </div>
              </div>
              <div className="bg-pink-700 bg-opacity-50 p-4 rounded-lg flex items-center space-x-3 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="w-4 h-4 rounded-full bg-pink-400 animate-pulse"></div>
                <div>
                  <h3 className="font-bold text-pink-100">{t('smart_feedback_feature')}</h3>
                  <p className="text-sm text-pink-200 opacity-80">{t('smart_feedback_description')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Robot Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0 relative">
            <img
              src="/images/robot.png"
              alt="Robot"
              className="object-contain w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl animate-float"
              style={{
                filter: 'drop-shadow(0px 0px 40px rgba(150, 0, 255, 0.8))',
                position: 'relative',
                zIndex: 1,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse-light"></div>
          </div>
        </div>

        <div className="mt-12 text-center text-purple-300 text-sm opacity-80">
          {t('ai_questions_note')}
        </div>
      </main>
    </div>
  );
};

export default Home;
