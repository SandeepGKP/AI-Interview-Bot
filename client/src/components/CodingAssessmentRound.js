import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const CodingAssessmentRound = ({ onComplete, roleTitle }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState({
    title: '',
    description: '',
    input: '',
    output: '',
    constraints: [],
    examples: [],
    function_signature: { language: '', signature: '' },
    test_cases: [],
    hints: [],
    evaluation_criteria: {}
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentRoleTitle = roleTitle || 'Software Engineer'; // Use prop or default

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
    if (videoRef.current && videoRef.current.contains(e.target)) {
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

      // Keep video within screen bounds (simple boundary check)
      newX = Math.max(0, Math.min(newX, window.innerWidth - (videoRef.current?.offsetWidth || 320)));
      newY = Math.max(0, Math.min(newY, window.innerHeight - (videoRef.current?.offsetHeight || 240)));

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
        // Stop all tracks in the stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError(t('could_not_access_camera_microphone'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const fetchCodingQuestion = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    try {
      setLoading(true);
      setError(null);
      setQuestion({
        title: '', description: '', input: '', output: '',
        constraints: [], examples: [], function_signature: {}, test_cases: [], hints: [], evaluation_criteria: {}
      });

      const response = await fetch(
        'https://ai-interview-bot-backend.onrender.com/api/generate-coding-assessment-question',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleTitle: currentRoleTitle, difficulty: 'medium' }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedQuestion = data.question || {};

      setQuestion({
        title: fetchedQuestion.title || t('could_not_load_question'),
        description: fetchedQuestion.description || '',
        input: fetchedQuestion.input || '',
        output: fetchedQuestion.output || '',
        constraints: fetchedQuestion.constraints || [],
        examples: fetchedQuestion.examples || [],
        function_signature: fetchedQuestion.function_signature || { language: '', signature: '' },
        test_cases: fetchedQuestion.test_cases || [],
        hints: fetchedQuestion.hints || [],
        evaluation_criteria: fetchedQuestion.evaluation_criteria || {}
      });

      console.log('Fetched coding question:', fetchedQuestion);

    } catch (err) {
      console.error('Failed to fetch coding question:', err);
      if (err.name === 'AbortError') {
        setError(t('request_timed_out_please_try_again'));
      } else {
        setError(t('failed_to_load_coding_question'));
      }
      setQuestion({
        title: t('could_not_load_question'), description: '', input: '', output: '',
        constraints: [], examples: [], function_signature: {}, test_cases: [], hints: [], evaluation_criteria: {}
      });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [currentRoleTitle, t]);

  useEffect(() => {
    fetchCodingQuestion();
  }, [fetchCodingQuestion]);

  const handleSubmit = () => {
    if (code.trim() === '' && !videoBlobUrl) {
      setFeedback(t('please_write_some_code_or_record_a_video_before_submitting'));
      return;
    }
    setFeedback(t('code_and_or_video_submitted_successfully_moving_to_the_next_round'));
    console.log('Code submitted:', code);
    console.log('Video submitted:', videoBlobUrl);
    if (onComplete) {
      onComplete({ code, video: videoBlobUrl });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-800 text-white">
      {/* Left Panel: Question */}
      <div className="lg:w-1/2 p-6 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-500 text-center lg:text-left">
            {t('coding_assessment_round')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => fetchCodingQuestion()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {t('refresh')}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (!code.trim() && !videoBlobUrl)}
            >
              {t('submit')}
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-blue-400">{t('generating_question')}</p>}
        {error && <p className="text-center text-red-500">{t(error)}</p>}

        {!loading && !error && (
          <div className="flex-grow overflow-y-auto pr-4">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4">{t('coding_problem_json')}</h3>
            <pre className="bg-gray-700 p-4 rounded-md border border-gray-600 whitespace-pre-wrap text-gray-100 overflow-auto">
              <code>{JSON.stringify(question, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Right Panel: Code Editor and Video */}
      <div className="lg:w-1/2 p-6 bg-gray-800 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-200">{t('your_code')}:</h3>
        </div>

        <textarea
          className="flex-grow w-full p-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-700 text-white resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('write_your_code_here')}
          disabled={loading}
        ></textarea>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-3">{t('record_your_explanation')}:</h3>
          <div
            className="fixed bg-gray-700 rounded-md overflow-hidden shadow-lg"
            style={{
              width: '200px', // Fixed width for draggable video
              height: '200px', // Fixed height for draggable video
              top: videoPosition.y,
              left: videoPosition.x,
              cursor: isRecording ? 'grabbing' : 'grab',
              zIndex: 1000, // Ensure it's on top
              border: '4px solid white', // Make border thicker
            }}
            onMouseDown={handleMouseDown}
          >
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center gap-2">
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRecording || loading}
              >
                {isRecording ? t('recording') : t('start')}
              </button>
              <button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isRecording || loading}
              >
                {t('stop')}
              </button>
            </div>
          </div>
          {videoBlobUrl && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-200 mb-2">{t('recorded_video')}:</h4>
              <video src={videoBlobUrl} controls className="w-full h-64 bg-gray-700 rounded-md"></video>
            </div>
          )}
        </div>



        {feedback && (
          <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-md border border-blue-200">
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingAssessmentRound;
