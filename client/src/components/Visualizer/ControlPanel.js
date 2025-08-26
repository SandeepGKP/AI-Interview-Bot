import React from 'react';
import { useTranslation } from 'react-i18next';


const ControlPanel = ({ onRunAlgorithm, onPlay, onPause, onStepForward, onStepBack, onSpeedChange, isPlaying, speed }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex items-center space-x-4">
      
      <button
        onClick={onRunAlgorithm}
        className="bg-blue-100 outline-red-300 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
      >
       <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]" > {t('run_algorithm')}</span>
      </button>

      <button
        onClick={onPlay}
        disabled={isPlaying}
        className="bg-green-200 hover:bg-green-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]" > {t('play')}</span>
      </button>

      <button
        onClick={onPause}
        disabled={!isPlaying}
        className="bg-yellow-200 hover:bg-yellow-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]" > {t('pause')}</span>
      </button>

      <button
        onClick={onStepBack}
        className="bg-purple-200 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
      >
        <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]" > {t('step_back')}</span>
      </button>

      <button
        onClick={onStepForward}
        className="bg-purple-200 hover:hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
      >
        <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]" > {t('step_forward')}</span>
      </button>

      <div className="flex items-center space-x-2">
        <label htmlFor="speed" className="text-white">Speed:</label>
        <input
          type="range"
          id="speed"
          min="100"
          max="2500"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="slider"
        />
        <span className="text-white">{speed}ms</span>
      </div>
    </div>
  );
};

export default ControlPanel;
