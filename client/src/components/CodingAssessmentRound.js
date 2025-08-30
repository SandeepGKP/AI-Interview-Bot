import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Resizable } from 're-resizable'; // Import Resizable component
import { motion } from 'framer-motion';

const CodingAssessmentRound = ({ onComplete, roleTitle, candidateName, sessionId, violationCount, maxViolations }) => {
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
  const [submissionResult, setSubmissionResult] = useState(null); // New state for judge API results
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const currentRoleTitle = roleTitle || 'Software Engineer'; // Use prop or default
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript'); // Default coding language
  const [refreshKey, setRefreshKey] = useState(0); // New state to trigger question refresh

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
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Initial width percentage for left panel

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

      // Keep video within screen bounds (simple boundary check)
      newX = Math.max(0, Math.min(newX, window.innerWidth - 320)); // Assuming video width is 320px
      newY = Math.max(0, Math.min(newY, window.innerHeight - 240)); // Assuming video height is 240px

      setVideoPosition({ x: newX, y: newY });
    }
  }, [isDragging, offset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleDividerMouseMove);
    document.addEventListener('mouseup', handleDividerMouseUp);
  }, []);

  const handleDividerMouseMove = useCallback((e) => {
    const container = e.currentTarget.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const newWidthPx = e.clientX - containerRect.left;
      const newWidthPercent = (newWidthPx / containerRect.width) * 100;
      setLeftPanelWidth(Math.max(20, Math.min(80, newWidthPercent))); // Constrain between 20% and 80%
    }
  }, []);

  const handleDividerMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleDividerMouseMove);
    document.removeEventListener('mouseup', handleDividerMouseUp);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (question.function_signature && question.function_signature.language === selectedLanguage) {
      setCode(question.function_signature.signature + "\n    "); // signature + indent
    } else {
      // If the fetched signature doesn't match the selected language, set a generic placeholder
      setCode(`// Write your ${selectedLanguage} code here\n`);
    }
  }, [question, selectedLanguage]);

  const startRecording = async () => {
    setRecordedChunks([]); // Clear previous chunks
    setVideoBlobUrl(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
      setStream(mediaStream);

      const options = { mimeType: 'video/webm; codecs=vp8,opus' };
      const mediaRecorder = new MediaRecorder(mediaStream, options);
      mediaRecorderRef.current = mediaRecorder;

      let localRecordedChunks = []; // Use a local array to accumulate chunks

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          localRecordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(localRecordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
        setRecordedChunks(localRecordedChunks); // Update state with all chunks after recording stops
        // Stop all tracks in the stream directly
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
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

  const fetchCodingQuestion = useCallback(async (languageToFetch) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout
    
    setVideoBlobUrl(null);
    setRecordedChunks([]);
    setIsRecording(false);

    try {
      setLoading(true);
      setError(null);
      setQuestion({
        title: '', description: '', input: '', output: '',
        constraints: [], examples: [], function_signature: {}, test_cases: [], hints: [], evaluation_criteria: {}
      });

      const response = await fetch(
        'https://ai-interview-bot-backend.onrender.com/api/generate-coding-assessment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleTitle: currentRoleTitle, difficulty: 'medium', sessionId, language: languageToFetch }), // Use languageToFetch
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const fetchedQuestion = data.problem || {};

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

    } catch (err) {
      console.error('Failed to fetch coding question:', err);
      setError(err.name === 'AbortError' ? t('request_timed_out_please_try_again') : t('failed_to_load_coding_question'));
      setQuestion({ title: t('could_not_load_question'), description: '', input: '', output: '', constraints: [], examples: [], function_signature: {}, test_cases: [], hints: [], evaluation_criteria: {} });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [currentRoleTitle, sessionId, t]); // Removed selectedLanguage from dependencies

  useEffect(() => {
    fetchCodingQuestion(selectedLanguage); // Pass selectedLanguage for initial fetch
  }, [fetchCodingQuestion, refreshKey]); // Trigger fetch only on refreshKey change or initial mount

  const handleSubmit = async () => {
    if (code.trim() === '') {
      setFeedback(t('please_write_some_code_before_submitting'));
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null); // Clear previous results
    setFeedback(''); // Clear previous feedback

    try {
      const response = await fetch('https://ai-interview-bot-backend.onrender.com/api/submit-code-for-judging', { // Placeholder URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          questionId: question.title, // Using title as a placeholder ID
          testCases: question.test_cases,
          functionSignature: question.function_signature,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubmissionResult(result);
      setFeedback(t('code_submitted_for_assessment'));

      // Optionally, if the assessment is complete and you want to move to the next round
      // if (onComplete && result.status === 'completed') {
      //   onComplete({ code, video: videoBlobUrl, submitted: true, assessmentResult: result });
      // }

    } catch (err) {
      console.error('Failed to submit code:', err);
      setFeedback(t('failed_to_submit_code_for_assessment'));
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden"
    >
      {/* Left Panel: Question */}
      <Resizable
        defaultSize={{ width: '50%', height: '100%' }}
        minWidth="20%"
        maxWidth="80%"
        enable={{ right: true }}
        handleClasses={{ right: 'w-2 bg-gray-700 cursor-ew-resize' }}
      >
        <div className="p-8 bg-gray-800 flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-gray-800 pt-4 pb-4 -mt-8 -mx-8 px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-400">
                {t('coding_assessment_round')}
              </h2>
            </div>
            {candidateName && <p className="text-lg text-gray-400 mb-4">{t('candidate')}: {candidateName}</p>}
            {(violationCount !== undefined && maxViolations !== undefined) && (
              <p className="text-md text-red-400 mb-2">
                {t('fullscreen_violations_detected')}: {violationCount} / {maxViolations} ({t('remaining')}: {maxViolations - violationCount})
              </p>
            )}
          </div>

          {loading && <p className="text-center text-purple-400">{t('generating_question')}</p>}
          {error && <p className="text-center text-red-400">{t(error)}</p>}

          {!loading && !error && (
            <div className="flex-grow overflow-y-auto pr-4">
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">{question.title}</h3>
                <p className="text-gray-300 mb-4">{question.description}</p>

                {question.input && <p><strong>{t('input')}:</strong> {String(question.input)}</p>}
                {question.output && <p><strong>{t('output')}:</strong> {String(question.output)}</p>}

                {question.constraints && question.constraints.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-purple-200">{t('constraints')}:</h4>
                    <ul className="list-disc list-inside pl-4 text-gray-300">
                      {question.constraints.map((c, i) => <li key={i}>{String(c)}</li>)}
                    </ul>
                  </div>
                )}

                {question.examples && question.examples.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-purple-200">{t('examples')}:</h4>
                    {question.examples.map((ex, i) => (
                      <div key={i} className="bg-gray-600 p-3 rounded-md mt-2">
                        <p><strong>Input:</strong> {JSON.stringify(ex.input)}</p>
                        <p><strong>Output:</strong> {JSON.stringify(ex.output)}</p>
                        {ex.explanation && <p><strong>Explanation:</strong> {String(ex.explanation)}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Resizable>

      {/* Right Panel: Code Editor and Video */}
      <div className="p-8 bg-gray-900 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-purple-300">{t('your_solution')}</h3>
          <select
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={loading}
          >
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
          </select>
        </div>
        <textarea
          className="flex-grow w-full p-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-base bg-gray-800 text-white resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('write_your_code_here')}
          disabled={loading}
        ></textarea>

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
              onClick={(e) => { e.preventDefault(); startRecording(); }}
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
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-purple-200 mb-2">{t('recorded_video')}:</h4>
            <video src={videoBlobUrl} controls className="w-full max-w-md bg-gray-800 rounded-lg"></video>
          </div>
        )}

        {isSubmitting && (
          <div className="mt-6 p-4 bg-blue-800 text-blue-200 rounded-lg border border-blue-700">
            <p>{t('submitting_code_and_running_tests')}</p>
          </div>
        )}

        {submissionResult && (
          <div className="mt-6 p-4 bg-green-800 text-green-200 rounded-lg border border-green-700">
            <h4 className="text-lg font-semibold text-green-100 mb-2">{t('assessment_results')}:</h4>
            <p><strong>{t('status')}:</strong> {submissionResult.status}</p>
            {submissionResult.message && <p><strong>{t('message')}:</strong> {submissionResult.message}</p>}
            {submissionResult.executionTime && <p><strong>{t('execution_time')}:</strong> {submissionResult.executionTime} ms</p>}
            {submissionResult.memoryUsage && <p><strong>{t('memory_usage')}:</strong> {submissionResult.memoryUsage} KB</p>}
            {submissionResult.testResults && (
              <div className="mt-2">
                <h5 className="font-semibold text-green-100">{t('test_cases')}:</h5>
                <ul className="list-disc list-inside pl-4">
                  {submissionResult.testResults.map((test, index) => (
                    <li key={index} className={test.passed ? 'text-green-300' : 'text-red-300'}>
                      {t('test')} {index + 1}: {test.passed ? t('passed') : t('failed')} - {test.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {feedback && (
          <div className="mt-6 p-4 bg-purple-800 text-purple-200 rounded-lg border border-purple-700">
            <p>{feedback}</p>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex gap-4">
        <button
          onClick={() => setRefreshKey(prevKey => prevKey + 1)} // Increment refreshKey to trigger fetch
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50"
          disabled={loading}
        >
          {t('refresh')}
        </button>
        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50"
          disabled={loading || isSubmitting || code.trim() === ''}
        >
          {isSubmitting ? t('submitting') : t('submit_code')}
        </button>
      </div>
    </motion.div>
  );
};

export default CodingAssessmentRound;
