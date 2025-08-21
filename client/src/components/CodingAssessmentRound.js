import React, { useState, useEffect, useCallback } from 'react';

const CodingAssessmentRound = ({ onComplete, roleTitle }) => {
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState({
    problem: '',
    input: '',
    output: ''
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentRoleTitle = roleTitle || 'Software Engineer'; // Use prop or default

  const fetchCodingQuestion = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    try {
      setLoading(true);
      setError(null);
      setQuestion({ problem: '', input: '', output: '' });

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
      let rawQuestion = data.question || '';

      // --- Improved Extraction with safe fallbacks ---
      const problemRegex = /Problem\s*Statement:([\s\S]*?)(?=Input:|Output:|Constraints:|Examples:|$)/i;
      const inputRegex = /Input:([\s\S]*?)(?=Output:|Constraints:|Examples:|$)/i;
      const outputRegex = /Output:([\s\S]*?)(?=Constraints:|Examples:|$)/i;

      const extracted = {
        problem: (rawQuestion.match(problemRegex)?.[1] || '').trim(),
        input: (rawQuestion.match(inputRegex)?.[1] || '').trim(),
        output: (rawQuestion.match(outputRegex)?.[1] || '').trim(),
      };

      // ✅ If regex fails, fallback to raw text completely
      if (!extracted.problem && !extracted.input && !extracted.output) {
        setQuestion({ problem: rawQuestion.trim(), input: '', output: '' });
      } else {
        setQuestion(extracted);
      }

      console.log('Fetched coding question:', extracted);

    } catch (err) {
      console.error('Failed to fetch coding question:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to load coding question. Please try again later.');
      }
      setQuestion({ problem: 'Could not load question.', input: '', output: '' });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [currentRoleTitle]);

  useEffect(() => {
    fetchCodingQuestion();
  }, [fetchCodingQuestion]);

  const handleSubmit = () => {
    if (code.trim() === '') {
      setFeedback('Please write some code before submitting.');
      return;
    }
    setFeedback('Code submitted successfully! Moving to the next round.');
    console.log('Code submitted:', code);
    if (onComplete) {
      onComplete({ code });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-800 text-white">
      {/* Left Panel: Question */}
      <div className="lg:w-1/2 p-6 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-500 text-center lg:text-left">
            Coding Assessment Round
          </h2>
          <button
            onClick={() => fetchCodingQuestion()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-center text-blue-400">Generating question...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="flex-grow overflow-y-auto pr-4">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Problem:</h3>
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600 whitespace-pre-wrap text-gray-100">
              {question.problem || 'N/A'}
            </div>

            {question.input && (
              <>
                <h3 className="text-xl font-semibold text-gray-200 mt-4 mb-2">Input:</h3>
                <div className="bg-gray-700 p-4 rounded-md border border-gray-600 whitespace-pre-wrap text-gray-100">
                  {question.input}
                </div>
              </>
            )}

            {question.output && (
              <>
                <h3 className="text-xl font-semibold text-gray-200 mt-4 mb-2">Output:</h3>
                <div className="bg-gray-700 p-4 rounded-md border border-gray-600 whitespace-pre-wrap text-gray-100">
                  {question.output}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Panel: Code Editor */}
      <div className="lg:w-1/2 p-6 bg-gray-800 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-200 mb-3">Your Code:</h3>
        <textarea
          className="flex-grow w-full p-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-700 text-white resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          disabled={loading}
        ></textarea>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          Submit Code
        </button>

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
