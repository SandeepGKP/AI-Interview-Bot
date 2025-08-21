import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <img src="/images/dsatrek-logo.png" alt="DSATrek Logo" className="h-8" />
          <a href="#" className="text-gray-400 hover:text-white">Problems</a>
          <a href="#" className="text-white border-b-2 border-yellow-500 pb-1">Interview</a>
          <a href="#" className="text-gray-400 hover:text-white">Community</a>
          <a href="#" className="text-gray-400 hover:text-white">Contest</a>
          <a href="#" className="text-gray-400 hover:text-white">Visualizer</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold">PREMIUM</button>
          <span className="text-gray-400">🔥 0</span>
          <span className="text-gray-400">⏰</span>
          <img src="/images/user-avatar.png" alt="User Avatar" className="h-8 w-8 rounded-full" />
        </div>
      </nav> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold"></h1>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 " onClick={handleStartInterview}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Create Interview</span>
          </button>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between bg-black p-8 rounded-lg overflow-hidden">
          <div className="lg:w-1/2 z-10">
            <h2 className="text-5xl font-bold mb-4">Master Your Next Interview</h2>
            <p className="text-gray-400 text-lg mb-8">
              Practice with AI-powered mock interviews tailored to your role. Get real-time feedback and boost your confidence
              with our advanced interview system.
            </p>
            <div className="flex gap-4 mb-8">
              <div className="bg-blue-700 p-4 rounded-lg flex items-center space-x-3 w-64">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <div>
                  <h3 className="font-bold">AI-Powered</h3>
                  <p className="text-sm text-gray-300">Personalized questions based on job description</p>
                </div>
              </div>
              <div className="bg-green-700 p-4 rounded-lg flex items-center space-x-3 w-64">
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
                <div>
                  <h3 className="font-bold">Voice Interview</h3>
                  <p className="text-sm text-gray-300">Real-time voice interact on with AI interviewer</p>
                </div>
              </div>
              <div className="bg-purple-700 p-4 rounded-lg flex items-center space-x-3 w-64">
                <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                <div>
                  <h3 className="font-bold">Smart Feedback</h3>
                  <p className="text-sm text-gray-300">Detailed analysis and improvement suggestions</p>
                </div>
              </div>
            </div>
            {/* <button className="bg-gray-800 text-white px-6 py-3 rounded-md flex items-center space-x-2" onClick={handleStartInterview}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.122a1 1 0 010 1.756l-4.695 2.683A1 1 0 019 14.683V9.317a1 1 0 011.057-.879l4.695 2.683z"></path></svg>
              <span>Start Your First Interview</span>
            </button> */}
          </div>

          {/* Robot Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0 height-full ">
            <img
              src="/images/image.png"
              alt="Robot"
              className="object-contain"
              style={{
                position: 'absolute',
                right: '20px',        // flush with right edge
                bottom: '0',       // sits on bottom
                width: '600px',    // big, like in your screenshot
                height: '400px',    // keep aspect ratio
                background: 'transparent',
                filter: 'drop-shadow(0px 0px 30px rgba(0,0,0,0.6))'
              }}
            />
          </div>


        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          {t('ai_questions_note')}
        </div>
      </main>
    </div>
  );
};

export default Home;
