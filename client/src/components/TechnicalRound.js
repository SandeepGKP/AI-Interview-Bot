import React, { useState, useEffect } from 'react';

const TechnicalRound = ({ onComplete, roleTitle }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicalQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/generate-interview', { // Reusing existing interview question generation
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleTitle: roleTitle || 'Software Engineer', roleDescription: 'Technical interview questions' }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data.questions);
        const initialAnswers = data.questions.reduce((acc, q, index) => {
          acc[`question${index}`] = '';
          return acc;
        }, {});
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Failed to fetch technical questions:", err);
        setError('Failed to load technical questions. Please try again later.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalQuestions();
  }, [roleTitle]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    setAnswers({ ...answers, [`question${index}`]: value });
  };

  const handleSubmit = () => {
    const allAnswered = questions.every((_, index) => answers[`question${index}`]?.trim() !== '');
    if (allAnswered) {
      setFeedback('Technical interview answers submitted successfully! Moving to the next round.');
      if (onComplete) {
        onComplete(answers); // Pass answers to parent component
      }
    } else {
      setFeedback('Please answer all questions before submitting.');
    }
    console.log('Technical answers submitted:', answers);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Technical Round Interview</h2>
      
      {loading && <p className="text-center text-blue-500">Generating technical questions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && questions.length > 0 ? (
        questions.map((q, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Question {index + 1}:</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">{q}</p>
            <textarea
              className="w-full p-4 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              rows="5"
              name={`question${index}`}
              value={answers[`question${index}`] || ''}
              onChange={(e) => handleChange(e, index)}
              placeholder={`Your answer for question ${index + 1} here...`}
            ></textarea>
          </div>
        ))
      ) : (
        !loading && !error && <p className="text-center text-gray-600">No technical questions available.</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || questions.length === 0}
      >
        Submit Technical Interview
      </button>

      {feedback && (
        <div className="mt-6 p-4 bg-purple-100 text-purple-800 rounded-md border border-purple-200">
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default TechnicalRound;
