import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <label htmlFor="inputData" className="block text-white text-sm font-bold mb-2">
        {t('input_data_label')}
      </label>
      <input
        type="text"
        id="inputData"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4"
        placeholder={t('input_data_placeholder')}
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
          />
        </>
      )}

      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {t('set_input')}
      </button>
    </form>
  );
};

export default InputForm;
