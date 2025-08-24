import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const HRRound = ({ onComplete, roleTitle, candidateName, sessionId }) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentRoleTitle = roleTitle || 'Software Engineer';

  // Video recording states and refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [stream, setStream] = useState(null);

  // Draggable video states
  const [videoPosition, setVideoPosition] = useState({ x: 20, y: 20 }); // Initial position
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (videoRef.current && videoRef.current.parentElement.contains(e.target)) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - videoPosition.x,
        y: e.clientY - videoPosition.y,
      });
    }
  }, [videoPosition]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      newX = Math.max(0, Math.min(newX, window.innerWidth - 320));
      newY = Math.max(0, Math.min(newY, window.innerHeight - 240));

      setVideoPosition({ x: newX, y: newY });
    }
  }, [isDragging, offset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const startRecording = async () => {
    setRecordedChunks([]);
    setVideoBlobUrl(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
      setStream(mediaStream);

      const options = { mimeType: 'video/webm; codecs=vp8,opus' };
      const mediaRecorder = new MediaRecorder(mediaStream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError(t('could_not_access_camera_microphone_hr'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const fetchHRQuestions = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://ai-interview-bot-backend.onrender.com/api/generate-hr-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleTitle: currentRoleTitle, existingSessionId: sessionId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setQuestions(data.questions);
      const initialAnswers = data.questions.reduce((acc, q, index) => {
        acc[`question${index}`] = '';
        return acc;
      }, {});
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Failed to fetch HR questions:", err);
      setError(err.name === 'AbortError' ? t('request_timed_out_please_try_again_hr') : t('failed_to_load_hr_questions'));
      setQuestions([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [currentRoleTitle, sessionId, t]);

  useEffect(() => {
    fetchHRQuestions();
  }, [fetchHRQuestions]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    setAnswers({ ...answers, [`question${index}`]: value });
  };

  const handleSubmit = useCallback(() => {
    const allQuestionsAnswered = questions.every((_, index) => answers[`question${index}`]?.trim() !== '');
    if (!allQuestionsAnswered && !videoBlobUrl) {
      setFeedback(t('please_answer_all_questions_or_record_a_video_before_submitting_hr'));
      return;
    }
    setFeedback(t('hr_interview_answers_and_or_video_submitted_successfully_moving_to_the_final_report'));
    if (onComplete) {
      onComplete({ answers, video: videoBlobUrl, submitted: true });
    }
  }, [questions, answers, onComplete, videoBlobUrl, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8"
    >
      <div className="pt-4 pb-4 px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-400">
            {t('hr_round_interview')}
          </h2>
        </div>
        {candidateName && <p className="text-lg text-gray-400 mb-4">{t('candidate')}: {candidateName}</p>}
      </div>

      {loading && <p className="text-center text-purple-400">{t('generating_questions')}</p>}
      {error && <p className="text-center text-red-400">{t(error)}</p>}

      <div className="max-w-4xl mx-auto">
        {!loading && !error && questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={index} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">{t('question')} {index + 1}:</h3>
              <p className="text-gray-300 bg-gray-700 p-4 rounded-md whitespace-pre-wrap">{q}</p>
              <textarea
                className="w-full p-4 mt-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-700 text-white"
                rows="5"
                name={`question${index}`}
                value={answers[`question${index}`] || ''}
                onChange={(e) => handleChange(e, index)}
                placeholder={t('your_answer_for_question', { index: index + 1 })}
              ></textarea>
            </div>
          ))
        ) : (
          !loading && !error && <p className="text-center text-gray-500">{t('please_click_refresh_button')}</p>
        )}
      </div>

      <div
        className="fixed bg-black rounded-lg overflow-hidden shadow-lg border-2 border-purple-500 p-2"
        style={{
          width: '320px',
          height: '240px',
          top: videoPosition.y,
          left: videoPosition.x,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 1000,
        }}
        onMouseDown={handleMouseDown}
      >
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover rounded-md"></video>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center gap-2">
          <button
            onClick={startRecording}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 ease-in-out disabled:opacity-50"
            disabled={isRecording || loading}
          >
            {isRecording ? t('recording') : t('start')}
          </button>
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 ease-in-out disabled:opacity-50"
            disabled={!isRecording || loading}
          >
            {t('stop')}
          </button>
        </div>
      </div>

      {videoBlobUrl && (
        <div className="fixed bottom-4 right-4 z-1000">
          <h4 className="text-lg font-semibold text-purple-200 mb-2">{t('recorded_video')}:</h4>
          <video src={videoBlobUrl} controls className="w-full max-w-md bg-gray-800 rounded-lg"></video>
        </div>
      )}

      {feedback && (
        <div className="fixed bottom-4 left-4 z-1000 p-4 bg-purple-800 text-purple-200 rounded-lg border border-purple-700">
          <p>{feedback}</p>
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-50 flex gap-4">
        <button
          onClick={() => fetchHRQuestions()}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50"
          disabled={loading}
        >
          {t('refresh')}
        </button>
        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50"
          disabled={loading || (questions.length > 0 && !questions.every((_, index) => answers[`question${index}`]?.trim() !== '') && !videoBlobUrl)}
        >
          {t('submit')}
        </button>
      </div>
    </motion.div>
  );
};

export default HRRound;
