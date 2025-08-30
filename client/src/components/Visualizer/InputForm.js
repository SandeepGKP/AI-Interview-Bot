import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';

const InputForm = ({ onSubmit, algorithmType }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [sortOrder, setSortOrder] = useState('increasing'); // Default to increasing
  const [operationType, setOperationType] = useState(''); // New state for Stack/Queue operation type
  const [operationValue, setOperationValue] = useState(''); // New state for value to push/enqueue


  const handleSubmit = (e) => {
    e.preventDefault();
    if (algorithmType === 'Searching') {
      onSubmit({ arrayInput: inputValue, target: targetValue });
    } else if (algorithmType === 'Sorting') {
      onSubmit({ arrayInput: inputValue, sortOrder: sortOrder });
    }
    else if (algorithmType === 'Graph' || algorithmType === 'Tree') {
      try {
        const parsedValue = JSON.parse(inputValue);
        onSubmit(parsedValue);
      } catch (error) {
        alert(t('invalid_json_input_for_algorithm', { algorithmType: algorithmType }));
        // Optionally, you can use a toast notification here if toast is enabled
        // toast.error('Invalid JSON input for ' + algorithmType + ' algorithm. Please check the format.');
      }
    } else if (algorithmType === 'Stack' || algorithmType === 'Queue') {
      try {
        const parsedInitialValue = inputValue
          ? inputValue.split(',').map((item, index) => ({ id: index, value: item.trim() }))
          : [];
        onSubmit({ initialData: parsedInitialValue, operationType, operationValue });
      } catch (error) {
        alert(t('invalid_input_for_initial_data'));
      }
    }
    else {
      onSubmit(inputValue);
    }
  };


  useEffect(() => {
    setInputValue("");
    setTargetValue("");
    setOperationType("");
    setOperationValue("");
    if (algorithmType === 'Sorting') {
      setSortOrder('increasing'); // Reset sort order when algorithm type changes to Sorting
    }
  }, [algorithmType]); 

  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 mt-5">
      {(algorithmType !== 'Stack' && algorithmType !== 'Queue') && (
        <>
          <label htmlFor="inputData" className="block text-white text-sm font-serif mb-2">
            {t('input_data_label')} (Initial State)
          </label>
          <input
            type="text"
            id="inputData"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4 [word-spacing:0.5rem]"
            placeholder="Enter comma-separated values (e.g., 1,2,3)"
          />
        </>
      )}

      {(algorithmType === 'Stack' || algorithmType === 'Queue') && (
        <>
          <p className="mb-5 text-purple-300  text-6xl sm:text-3xl  opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,#F87171,#FBBF24,#34D399,#3B82F6,#A78BFA)]">Remember that the size of the {algorithmType} should not exceed 12.</p>
          <label htmlFor="operationType" className="block text-white text-sm font-serif mb-2">
            Operation
          </label>
          <select
            id="operationType"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4"
            required
          >
            <option value="">Select Operation</option>
            {algorithmType === 'Stack' && (
              <>
                <option value="push">Push</option>
                <option value="pop">Pop</option>
                <option value="peek">Peek</option>
              </>
            )}
            {algorithmType === 'Queue' && (
              <>
                <option value="enqueue">Enqueue</option>
                <option value="dequeue">Dequeue</option>
                {/* <option value="peek">Peek</option> */}
              </>
            )}
          </select>

          {(operationType === 'push' || operationType === 'enqueue') && (
            <>
              <label htmlFor="operationValue" className="block text-white text-sm font-serif mb-2">
                Value to {operationType}
              </label>
              <input
                type="text"
                id="operationValue"
                value={operationValue}
                onChange={(e) => setOperationValue(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4"
                placeholder="Enter value"
                required
              />
            </>
          )}
        </>
      )}

      {algorithmType === 'Sorting' && (
        <>
          <label htmlFor="sortOrder" className="block text-white text-sm font-serif mb-2">
            {t('sort_order_label')}
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 mb-4"
          >
            <option value="increasing">{t('increasing_order')}</option>
            <option value="decreasing">{t('decreasing_order')}</option>
          </select>
        </>
      )}

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
          Example 1: `{"{ \"value\": 1, \"left\": {\"value\": 2}, \"right\": {\"value\": 3} }"}`
          <br />
          Example 2: (for multilevel tree):`{"{ \"value\": 1, \"left\": {\"value\": 2,\"left\": {\"value\": 4}, \"right\": {\"value\": 5}}, \"right\": {\"value\": 3} }"}`
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
