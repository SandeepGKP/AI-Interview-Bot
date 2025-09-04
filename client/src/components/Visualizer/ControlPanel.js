import React from 'react';
import { useTranslation } from 'react-i18next';


import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const ControlPanel = ({ algorithmType, onRunAlgorithm, onPlay, onPause, onStepForward, onStepBack, onSpeedChange, isPlaying, speed }) => {
  const { t } = useTranslation();

  const buttonClasses = "flex-1 sm:flex-none bg-white outline-red-300 hover:bg-gray-200 text-black font-serif py-2 px-2 sm:px-4 rounded-3xl focus:outline-none focus:shadow-outline text-sm sm:text-base";
  const playPauseButtonClasses = "flex-1 sm:flex-none text-black font-serif py-2 px-2 sm:px-4 rounded-3xl focus:outline-none focus:shadow-outline disabled:opacity-50 text-sm sm:text-base";
  const iconClasses = "text-lg sm:text-xl";

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex flex-wrap justify-center items-center gap-2 sm:gap-4">

      {(algorithmType === "Stack" || algorithmType === "Queue") ? (
        <button
          onClick={onRunAlgorithm}
          className={buttonClasses}
        >
          <PlayCircleFilledWhiteIcon className={iconClasses} />
          <span className="ml-1 hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
         bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
            {/* {t('run_operation')} */}
          </span>
          <span className="ml-1 sm:hidden font-bold opacity-200 leading-tight text-transparent bg-clip-text 
         bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
            Run
          </span>
        </button>
      ) : (
        <>
          <button
            onClick={onRunAlgorithm}
            className={buttonClasses}
          >
            <PlayCircleFilledWhiteIcon className={iconClasses} />
            <span className="ml-1 hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              {/* {t('initiate_algorithm')} */}
            </span>
            <span className="ml-1 sm:hidden font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              Init
            </span>
          </button>

          <button
          onClick={onPlay}
          disabled={isPlaying}
          className={`${playPauseButtonClasses} bg-white hover:bg-gray-200`}
        >
            <PlayArrowIcon className={iconClasses} />
            <span className="ml-1 hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              {/* {t('play')} */}
            </span>
            <span className="ml-1 sm:hidden font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              Play
            </span>
          </button>

          <button
          onClick={onPause}
          disabled={!isPlaying}
          className={`${playPauseButtonClasses} bg-white hover:bg-gray-200`}
        >
            <PauseIcon className={iconClasses} />
            <span className="ml-1 hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              {/* {t('pause')} */}
            </span>
            <span className="ml-1 sm:hidden font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              Pause
            </span>
          </button>

          <button
            onClick={onStepBack}
            className={buttonClasses}
          >
            <FastRewindIcon className={iconClasses} />
            <span className="ml-1 hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              {/* {t('step_back')} */}
            </span>
            <span className="ml-1 sm:hidden font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              Back
            </span>
          </button>

          <button
            onClick={onStepForward}
            className={buttonClasses}
          >
            <FastForwardIcon className={iconClasses} />
            <span className="ml-1 hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              {/* {t('step_forward')} */}
            </span>
            <span className="ml-1 sm:hidden font-bold opacity-200 leading-tight text-transparent bg-clip-text 
           bg-[radial-gradient(circle_at_center,_#B71C1C,_#E65100,_#880E4F,_#BF360C,_#4A148C)]">
              Fwd
            </span>
          </button>
        </>
      )}

      <div className="flex items-center space-x-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center">
        <label htmlFor="speed" className="text-white font-serif text-sm sm:text-base">{t('speed')}:</label>
        <input
          type="range"
          id="speed"
          min="100"
          max="2500"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="slider w-24 sm:w-32"
        />
        <span className="text-white font-serif text-sm sm:text-base">{speed}ms</span>
      </div>
    </div>
  );
};

export default ControlPanel;
