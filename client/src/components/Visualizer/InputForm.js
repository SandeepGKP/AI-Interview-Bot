import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';

const InputForm = ({ onSubmit, algorithmType }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [targetValue, setTargetValue] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    if (algorithmType === 'Searching') {
      onSubmit({ arrayInput: inputValue, target: targetValue });
    } else {
      onSubmit(inputValue);
    }
  };


  useEffect(() => {
    setInputValue(""); 
  }, [algorithmType]); 

  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 mt-5">
      <label htmlFor="inputData" className="block text-white text-sm font-serif mb-2">
        {t('input_data_label')}
      </label>
      <input
        type="text"
        id="inputData"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4"
        placeholder={t('input_data_placeholder')}
        required
      />

      {algorithmType === 'Searching' && (
        <>
          <label htmlFor="targetData" className="block text-white text-sm font-bold mb-2">
            {t('target_value_label')}
          </label>
          <input
            type="text"
            id="targetData"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4"
            placeholder={t('target_value_placeholder')}
            required
          />
        </>
      )}

      {algorithmType === 'Graph' && (
        <p className="text-gray-400 text-sm mb-4">
          Expected input format for Graph algorithms: JSON string representing an adjacency list.
          <br />
          Example: `{"{ \"A\": [\"B\", \"C\"], \"B\": [\"A\"], \"C\": [\"A\"] }"}` (unweighted)
          <br />
          Example: `{"{ \"A\": {\"B\": 1, \"C\": 5}, \"B\": {\"A\": 1}, \"C\": {\"A\": 5} }"}` (weighted)
        </p>
      )}

      {algorithmType === 'Tree' && (
        <p className="text-gray-400 text-sm mb-4 font-serif">
          Expected input format for Tree algorithms: JSON string representing a tree structure.
          <br />
          Example: `{"{ \"value\": 1, \"left\": {\"value\": 2}, \"right\": {\"value\": 3} }"}`
        </p>
      )}
      <button
        type="submit"
        className="bg-blue-100 outline-red-300 hover:bg-blue-300 text-white font-serif py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
      >
       <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]" > {t('set_input')}</span>
      </button>
    </form>
  );
};

export default InputForm;
