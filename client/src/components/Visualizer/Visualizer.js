import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Sidebar from './Sidebar';
import InputForm from './InputForm';
import ControlPanel from './ControlPanel';
import VisualizationArea from './VisualizationArea';
import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';

// Import algorithms
import * as sortingAlgorithms from '../algorithms/sortingAlgorithms';
import * as arrayAlgorithms from '../algorithms/arrayAlgorithms';
import * as graphAlgorithms from '../algorithms/graphAlgorithms';
import * as treeAlgorithms from '../algorithms/treeAlgorithms';
import * as searchingAlgorithms from '../algorithms/searchingAlgorithms';

const Visualizer = () => {
  
  const {t}=useTranslation();
  const location = useLocation(); // Use useLocation hook
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(location.state?.selectedAlgorithm || null);
  const [inputData, setInputData] = useState('');
  const [targetValue, setTargetValue] = useState(''); // New state for target value
  const [visualizationData, setVisualizationData] = useState([]);
  const [algorithmOutput, setAlgorithmOutput] = useState('');
  const [animations, setAnimations] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // milliseconds
  const [finalSortedData, setFinalSortedData] = useState([]); // New state to store the final sorted array
  const timeoutRef = useRef(null);


  useEffect(() => {
    if (location.state?.selectedAlgorithm) {
      setSelectedAlgorithm(location.state.selectedAlgorithm);
    }
  }, [location.state?.selectedAlgorithm]);

  useEffect(() => {
    if (isPlaying && currentStep < animations.length) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
      }, speed);
    } else if (currentStep >= animations.length) {
      setIsPlaying(false);
      // When animation finishes, update visualizationData to the final sorted array for sorting algorithms
      if (getAlgorithmCategory(selectedAlgorithm) === 'Sorting') {
        setVisualizationData(finalSortedData);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentStep, animations, speed, selectedAlgorithm, finalSortedData]);

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    // Reset input and visualization when a new algorithm is selected
    setInputData('');
    setVisualizationData([]);
    setAlgorithmOutput('');
    setAnimations([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputSubmit = (data) => {
    // If data is an object (from searching input form), store both arrayInput and target
    if (typeof data === 'object' && data !== null && 'arrayInput' in data && 'target' in data) {
      setInputData(data.arrayInput);
      // Store target separately or combine with inputData in a way that handleRunAlgorithm can use it
      // For now, let's just update inputData and handle target extraction in handleRunAlgorithm
      // This might need refinement if other algorithms also need multiple inputs
      setTargetValue(data.target); // Assuming a new state for targetValue in Visualizer
      {data.target ? toast.success('Input data saved') : toast.success('Please give input data to proceed');}
    } else {
      setInputData(data);
      {data ? toast.success('Input data saved') : toast.success('Please give input data to proceed');}
    }
  };

  const getAlgorithmCategory = (algName) => {
    const searchingAlgs = ['Linear Search', 'Binary Search'];
    const sortingAlgs = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'];
    const arrayAlgs = ['Kadane\'s Algorithm', 'Two Pointers', 'Sliding Window'];
    const graphAlgs = ['BFS', 'DFS', 'Dijkstra\'s Algorithm', 'Prim\'s Algorithm', 'Kruskal\'s Algorithm'];
    const treeAlgs = ['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level Order Traversal'];

    if (searchingAlgs.includes(algName)) return 'Searching';
    if (sortingAlgs.includes(algName)) return 'Sorting';
    if (arrayAlgs.includes(algName)) return 'Array';
    if (graphAlgs.includes(algName)) return 'Graph';
    if (treeAlgs.includes(algName)) return 'Tree';
    return 'Unknown';
  };

  const handleRunAlgorithm = () => {
    if (!selectedAlgorithm || !inputData) {
      setAlgorithmOutput('Please select an algorithm and provide input data.');
      return;
    }else{
      toast.success(`${selectedAlgorithm}`+' initiated to play');
    }

    let result = null;
    let generatedAnimations = [];
    let processedData = null;
    let algorithmCategory = getAlgorithmCategory(selectedAlgorithm);

    try {
      if (algorithmCategory === 'Sorting' || algorithmCategory === 'Array') {
        // Check if input contains non-numeric characters
        if (/[a-zA-Z]/.test(inputData)) {
          processedData = inputData.split(',').map((item, id) => ({ id, value: item.trim() })); // Treat as string array with unique IDs
        } else {
          processedData = inputData.split(',').map((item, id) => ({ id, value: Number(item) })); // Treat as number array with unique IDs
        }
      } else if (algorithmCategory === 'Graph') {
        // Assuming graph input is a JSON string representing an adjacency list
        processedData = JSON.parse(inputData);
        // Normalize graph input: ensure all neighbors are objects with a 'weight' property (even if undefined)
        for (const node in processedData) {
          if (Array.isArray(processedData[node])) { // If it's an array of neighbors (unweighted style)
            const newNeighbors = {};
            processedData[node].forEach(neighbor => {
              newNeighbors[neighbor] = undefined; // No weight for unweighted graphs
            });
            processedData[node] = newNeighbors;
          } else if (typeof processedData[node] === 'object' && processedData[node] !== null) {
            // If it's already an object {neighbor: weight}, ensure all weights are numbers or undefined
            for (const neighbor in processedData[node]) {
              if (typeof processedData[node][neighbor] !== 'number') {
                processedData[node][neighbor] = undefined; // Ensure weight is number or undefined
              }
            }
          }
        }
      } else if (algorithmCategory === 'Tree') {
        // Assuming tree input is a JSON string representing a tree structure
        processedData = JSON.parse(inputData);
      } else if (algorithmCategory === 'Searching') {
        // Searching algorithms typically work on arrays of numbers or strings
        if (/[a-zA-Z]/.test(inputData)) {
          processedData = inputData.split(',').map((item, id) => ({ id, value: item.trim() })); // Treat as string array with unique IDs
        } else {
          processedData = inputData.split(',').map((item, id) => ({ id, value: Number(item) })); // Treat as number array with unique IDs
        }
      }
      else {
        setAlgorithmOutput(`Unknown algorithm category: ${algorithmCategory}`);
        setVisualizationData([]);
        setAnimations([]);
        setCurrentStep(0);
        setIsPlaying(false);
        return;
      }
    } catch (e) {
      setAlgorithmOutput(`Error parsing input data: ${e.message}. Please ensure the input format is correct for ${algorithmCategory} algorithms.`);
      setVisualizationData([]);
      setAnimations([]);
      setCurrentStep(0);
      setIsPlaying(false);
      return;
    }

    switch (selectedAlgorithm) {
      case 'Bubble Sort':
        ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.bubbleSort(processedData));

        break;
      case 'Selection Sort':
        ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.selectionSort(processedData));
        break;
      case 'Insertion Sort':
        ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.insertionSort(processedData));
        break;
      case 'Merge Sort':
        ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.mergeSort(processedData));
        break;
      case 'Quick Sort':
        ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.quickSort(processedData));
        break;
      case 'Kadane\'s Algorithm':
        ({ result, animations: generatedAnimations } = arrayAlgorithms.kadanesAlgorithm(processedData));
        break;
      case 'Two Pointers':
        const targetTwoPointers = processedData.length > 1 ? processedData[processedData.length - 1].value : 10;
        ({ result, animations: generatedAnimations } = arrayAlgorithms.twoPointers(processedData.slice(0, -1), targetTwoPointers));
        break;
      case 'Sliding Window':
        const kSlidingWindow = processedData.length > 1 ? processedData[processedData.length - 1].value : 3;
        ({ result, animations: generatedAnimations } = arrayAlgorithms.slidingWindow(processedData.slice(0, -1), kSlidingWindow));
        break;
      case 'Linear Search':
        if (!targetValue) {
          setAlgorithmOutput('Please provide a target value for Linear Search.');
          return;
        }
        const processedTargetLinear = typeof processedData[0].value === 'number' ? Number(targetValue) : targetValue;
        ({ foundIndex: result, animations: generatedAnimations } = searchingAlgorithms.linearSearch(processedData, processedTargetLinear));
        break;
      case 'Binary Search':
        if (!targetValue) {
          setAlgorithmOutput('Please provide a target value for Binary Search.');
          return;
        }
        const processedTargetBinary = typeof processedData[0].value === 'number' ? Number(targetValue) : targetValue;
        let binarySearchResult;
        ({ foundIndex: result, animations: generatedAnimations, sortedArray: binarySearchResult } = searchingAlgorithms.binarySearch(processedData, processedTargetBinary));
        processedData = binarySearchResult; // For binary search, processedData is already the sorted array with IDs
        break;
      case 'BFS':
        ({ visitedNodes: result, animations: generatedAnimations } = graphAlgorithms.bfs(processedData, Object.keys(processedData)[0]));
        break;
      case 'DFS':
        ({ visitedNodes: result, animations: generatedAnimations } = graphAlgorithms.dfs(processedData, Object.keys(processedData)[0]));
        break;
      case 'Dijkstra\'s Algorithm':
        ({ distances: result, animations: generatedAnimations } = graphAlgorithms.dijkstrasAlgorithm(processedData, Object.keys(processedData)[0]));
        break;
      case 'Prim\'s Algorithm':
        ({ mst: result, animations: generatedAnimations } = graphAlgorithms.primsAlgorithm(processedData));
        break;
      case 'Kruskal\'s Algorithm':
        ({ mst: result, animations: generatedAnimations } = graphAlgorithms.kruskalsAlgorithm(processedData));
        break;
      case 'Preorder Traversal':
        ({ traversal: result, animations: generatedAnimations } = treeAlgorithms.preorderTraversal(processedData));
        break;
      case 'Inorder Traversal':
        ({ traversal: result, animations: generatedAnimations } = treeAlgorithms.inorderTraversal(processedData));
        break;
      case 'Postorder Traversal':
        ({ traversal: result, animations: generatedAnimations } = treeAlgorithms.postorderTraversal(processedData));
        break;
      case 'Level Order Traversal':
        ({ traversal: result, animations: generatedAnimations } = treeAlgorithms.levelOrderTraversal(processedData));
        break;
      default:
        setAlgorithmOutput(`Unknown algorithm: ${selectedAlgorithm}`);
        setVisualizationData([]);
        setAnimations([]);
        setCurrentStep(0);
        setIsPlaying(false);
        return;
    }

    let formattedOutput;
    if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && result[0] !== null && 'value' in result[0]) {
      formattedOutput = result.map(item => item.value).join(', ');
    } else if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && result[0] !== null && 'node' in result[0]) {
      // For graph/tree traversals that return objects like { node: 'A', distance: 0 }
      formattedOutput = result.map(item => item.node || item.value).join(', ');
    }
    else {
      formattedOutput = JSON.stringify(result, null, 2);
    }

    setAlgorithmOutput(`Output for ${selectedAlgorithm}: ${formattedOutput}`);
    if (selectedAlgorithm === 'Binary Search') {
      setVisualizationData(processedData); // processedData is already mapped for Binary Search
    } else if (algorithmCategory === 'Sorting' || algorithmCategory === 'Array' || algorithmCategory === 'Searching') {
      setVisualizationData(processedData); // Initial state with IDs
    } else {
      setVisualizationData(processedData); // For graphs and trees, visualize the structure itself
    }
    setAnimations(generatedAnimations); // Animations now contain {id, value} objects
    setCurrentStep(0);
    setIsPlaying(false);

    if (algorithmCategory === 'Sorting') {
      setFinalSortedData(result); // result is already {id, value} objects
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    toast.success("Agorithm is running");
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast.success("Agorithm stopped");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false); // Pause playback when stepping forward manually
    toast.success("Agorithm moved one step Forward");
    setCurrentStep((prevStep) => Math.min(prevStep + 1, animations.length));
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    toast.success("Agorithm moved one step backward");
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar onSelectAlgorithm={handleAlgorithmSelect} />
      <div className="flex-1 flex h-full flex-col p-4 overflow-y-scroll">
        <h1 className="text-3xl font-bold mb-4">
          <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#93C5FD,_#A5B4FC,_#C084FC,_#F472B6,_#1F2937)]" > {t('algorithm_visualizer')}</span></h1>
        {selectedAlgorithm ? (
          <div>
            <p className="text-xl mb-4">Selected Algorithm: {selectedAlgorithm}</p>
            <InputForm onSubmit={handleInputSubmit} algorithmType={getAlgorithmCategory(selectedAlgorithm)} />
            <ControlPanel
              onRunAlgorithm={handleRunAlgorithm}
              onPlay={handlePlay}
              onPause={handlePause}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onSpeedChange={handleSpeedChange}
              isPlaying={isPlaying}
              speed={speed}
            />
            <VisualizationArea
              data={visualizationData}
              output={algorithmOutput}
              animations={animations}
              currentStep={currentStep}
              algorithmType={getAlgorithmCategory(selectedAlgorithm)}
              speed={speed}
              algorithm={selectedAlgorithm}
            />
          </div>
        ) : (
          <p className="text-xl">Please select an algorithm from the sidebar to begin.</p>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
