import React from 'react';

const ControlPanel = ({ onRunAlgorithm, onPlay, onPause, onStepForward, onStepBack, onSpeedChange, isPlaying, speed }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex items-center space-x-4">
      <button
        onClick={onRunAlgorithm}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Run Algorithm
      </button>

      <button
        onClick={onPlay}
        disabled={isPlaying}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Play
      </button>

      <button
        onClick={onPause}
        disabled={!isPlaying}
        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Pause
      </button>

      <button
        onClick={onStepBack}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Step Back
      </button>

      <button
        onClick={onStepForward}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Step Forward
      </button>

      <div className="flex items-center space-x-2">
        <label htmlFor="speed" className="text-white">Speed:</label>
        <input
          type="range"
          id="speed"
          min="100"
          max="2000"
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
