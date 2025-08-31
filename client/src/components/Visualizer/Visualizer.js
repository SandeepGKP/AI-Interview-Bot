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
import * as dataStructures from '../algorithms/dataStructures'; // New: Import dataStructures

// Helper class for Tree Node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Helper function to build a tree from a plain object
const buildTree = (obj) => {
  if (!obj || typeof obj !== 'object' || obj.value === undefined) {
    return null;
  }
  const node = new TreeNode(obj.value);
  if (obj.left) {
    node.left = buildTree(obj.left);
  }
  if (obj.right) {
    node.right = buildTree(obj.right);
  }
  return node;
};

const Visualizer = () => {

  const { t } = useTranslation();
  const location = useLocation(); // Use useLocation hook
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(location.state?.selectedAlgorithm || null);
  const [inputData, setInputData] = useState('');
  const [targetValue, setTargetValue] = useState(''); // New state for target value
  const [sortOrder, setSortOrder] = useState('increasing'); // New state for sort order
  const [operationType, setOperationType] = useState(''); // New state for Stack/Queue operation type
  const [operationValue, setOperationValue] = useState(''); // New state for value to push/enqueue
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
    setTargetValue('');
    setSortOrder('increasing');
    setOperationType('');
    setOperationValue('');
    setVisualizationData([]);
    setAlgorithmOutput('');
    setAnimations([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputSubmit = (data) => {
    const algorithmCategory = getAlgorithmCategory(selectedAlgorithm);

    if (algorithmCategory === 'Searching') {
      setInputData(data.arrayInput);
      setTargetValue(data.target);
      data.target ? toast.success(t('input_data_saved')) : toast.success(t('please_give_input_data_to_proceed'));
    } else if (algorithmCategory === 'Sorting') {
      setInputData(data.arrayInput);
      setSortOrder(data.sortOrder);
      data.arrayInput ? toast.success(t('input_data_saved')) : toast.success(t('please_give_input_data_to_proceed'));
    }
    else if (algorithmCategory === 'Graph' || algorithmCategory === 'Tree') {
      setInputData(data); // data is already a parsed object
      data ? toast.success(t('input_data_saved')) : toast.success(t('please_give_input_data_to_proceed'));
    } else if (algorithmCategory === 'Stack' || algorithmCategory === 'Queue') {
      // For Stack and Queue, initialData might be empty now, as per user request
      setInputData(data.initialData || []); // Ensure it's an empty array if no initial input
      setOperationType(data.operationType);
      setOperationValue(data.operationValue);
      data.operationType ? toast.success(t('operation_saved')) : toast.success(t('please_select_operation_to_proceed'));
    }
    else {
      setInputData(data);
      data ? toast.success(t('input_data_saved')) : toast.success(t('please_give_input_data_to_proceed'));
    }
  };

  const getAlgorithmCategory = (algName) => {
    const searchingAlgs = ['Linear Search', 'Binary Search'];
    const sortingAlgs = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'];
    const arrayAlgs = ['Kadane\'s Algorithm', 'Two Pointers', 'Sliding Window'];
    const graphAlgs = ['BFS', 'DFS', 'Dijkstra\'s Algorithm', 'Prim\'s Algorithm', 'Kruskal\'s Algorithm'];
    const treeAlgs = ['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level Order Traversal'];
    const stackAlgs = ['Stack (LIFO)']; // New: Stack algorithms
    const queueAlgs = ['Queue (FIFO)']; // New: Queue algorithms

    if (searchingAlgs.includes(algName)) return 'Searching';
    if (sortingAlgs.includes(algName)) return 'Sorting';
    if (arrayAlgs.includes(algName)) return 'Array';
    if (graphAlgs.includes(algName)) return 'Graph';
    if (treeAlgs.includes(algName)) return 'Tree';
    if (stackAlgs.includes(algName)) return 'Stack'; // New: Return 'Stack' category
    if (queueAlgs.includes(algName)) return 'Queue'; // New: Return 'Queue' category
    return 'Unknown';
  };

  const handleRunAlgorithm = () => {
    if (!selectedAlgorithm || (!inputData && !operationType)) { // Ensure either initial data or an operation is provided
      setAlgorithmOutput(t('select_algorithm_and_provide_data_or_operation'));
      return;
    } else if ((operationType === 'push' || operationType === 'enqueue') && !operationValue) {
      setAlgorithmOutput(t('provide_value_for_operation', { operationType: operationType }));
      return;
    }
    else {
      if (selectedAlgorithm === "Stack (LIFO)" || selectedAlgorithm === "Queue (FIFO)"){
          (selectedAlgorithm==="Stack (LIFO)") ?  toast.success(t('operation_successful_stack', { operationType: operationType })) : toast.success(t('operation_successful_queue', { operationType: operationType }));
      }
      else {
        toast.success(t('algorithm_initiated_to_play', { algorithm: selectedAlgorithm }));
      }
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
        // inputData is already a parsed object
        processedData = inputData;
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
        // inputData is already a parsed object, convert it to a TreeNode structure
        processedData = buildTree(inputData);
        if (!processedData) {
          setAlgorithmOutput('Error: Invalid tree input structure. Please ensure it has a "value" property at the root.');
          setVisualizationData([]);
          setAnimations([]);
          setCurrentStep(0);
          setIsPlaying(false);
          return;
        }
      } else if (algorithmCategory === 'Searching') {
        // Searching algorithms typically work on arrays of numbers or strings
        if (/[a-zA-Z]/.test(inputData)) {
          processedData = inputData.split(',').map((item, id) => ({ id, value: item.trim() })); // Treat as string array with unique IDs
        } else {
          processedData = inputData.split(',').map((item, id) => ({ id, value: Number(item) })); // Treat as number array with unique IDs
        }
      } else if (algorithmCategory === 'Stack' || algorithmCategory === 'Queue') {
        // For Stack and Queue, the initial state is `inputData` (which might be empty), and we apply the single operation.
        // The `visualizationData` holds the current state of the structure.
        let currentStructure = [...(visualizationData.length > 0 ? visualizationData : inputData)];
        let operationResult;

        if (algorithmCategory === 'Stack') {
          operationResult = dataStructures.stackOperations(t, currentStructure, operationType, operationValue);
          result = operationResult.finalStack;
        } else { // Queue
          operationResult = dataStructures.queueOperations(t, currentStructure, operationType, operationValue);
          result = operationResult.finalQueue;
        }
        generatedAnimations = operationResult.animations;
        processedData = currentStructure; // Keep processedData as the state *before* the current operation for initial visualization
      }
      else {
        setAlgorithmOutput(t('unknown_algorithm_category', { algorithmCategory: algorithmCategory }));
        setVisualizationData([]);
        setAnimations([]);
        setCurrentStep(0);
        setIsPlaying(false);
        return;
      }
    } catch (e) {
      setAlgorithmOutput(t('error_parsing_input_data', { errorMessage: e.message, algorithmCategory: algorithmCategory }));
      setVisualizationData([]);
      setAnimations([]);
      setCurrentStep(0);
      setIsPlaying(false);
      return;
    }

    // If it's a Stack or Queue operation, we need to append animations and update visualizationData
    if (algorithmCategory === 'Stack' || algorithmCategory === 'Queue') {
      // Filter out the 'initial' animation if it's not the very first operation
      const animationsToAppend = animations.length === 0 ? generatedAnimations : generatedAnimations.filter(anim => anim.type !== 'initial');
      setAnimations((prevAnimations) => [...prevAnimations, ...animationsToAppend]);
      setVisualizationData(result); // Update visualizationData to the new state after the operation
      setCurrentStep(0); // Reset step to play new animations from start
      setIsPlaying(false); // Pause initially
    } else {
      // Existing logic for other algorithms
      switch (selectedAlgorithm) {
        case 'Bubble Sort':
          ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.bubbleSort(processedData, sortOrder));
          break;
        case 'Selection Sort':
          ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.selectionSort(processedData, sortOrder));
          break;
        case 'Insertion Sort':
          ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.insertionSort(processedData, sortOrder));
          break;
        case 'Merge Sort':
          ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.mergeSort(processedData, sortOrder));
          break;
        case 'Quick Sort':
          ({ sortedArray: result, animations: generatedAnimations } = sortingAlgorithms.quickSort(processedData, sortOrder));
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
          setAlgorithmOutput(t('provide_target_value_linear_search'));
          return;
          }
          const processedTargetLinear = typeof processedData[0].value === 'number' ? Number(targetValue) : targetValue;
          ({ foundIndex: result, animations: generatedAnimations } = searchingAlgorithms.linearSearch(processedData, processedTargetLinear));
          break;
        case 'Binary Search':
          if (!targetValue) {
            setAlgorithmOutput(t('provide_target_value_binary_search'));
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
        case 'Stack (LIFO)':
        case 'Queue (FIFO)':
          // These cases are handled in the if (algorithmCategory === 'Stack' || algorithmCategory === 'Queue') block above
          break;
        default:
          setAlgorithmOutput(t('unknown_algorithm', { algorithm: selectedAlgorithm }));
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

      setAlgorithmOutput(formattedOutput);
      if (selectedAlgorithm === 'Binary Search') {
        setVisualizationData(processedData); // processedData is already mapped for Binary Search
      } else if (algorithmCategory === 'Sorting' || algorithmCategory === 'Array' || algorithmCategory === 'Searching' || algorithmCategory === 'Stack' || algorithmCategory === 'Queue') { // Added Stack and Queue
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
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    toast.success(t('algorithm_is_running'));
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast.success(t('algorithm_stopped'));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false); // Pause playback when stepping forward manually
    toast.success(t('algorithm_moved_forward'));
    setCurrentStep((prevStep) => Math.min(prevStep + 1, animations.length));
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    toast.success(t('algorithm_moved_backward'));
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar onSelectAlgorithm={handleAlgorithmSelect} />
      <div className="flex-1 flex h-full flex-col p-4 overflow-y-scroll">
        {/* <h1 className="text-3xl font-bold mb-4">
          <span className="hidden sm:inline font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#93C5FD,_#A5B4FC,_#C084FC,_#F472B6,_#1F2937)]" > {t('algorithm_visualizer')}</span></h1> */}
        {selectedAlgorithm ? (
          <div>
            <p className="text-3xl sm:inline font-serif opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#93C5FD,_#A5B4FC,_#C084FC,_#F472B6,_#1F2937)]">{t('selected_algorithm')}: {selectedAlgorithm}</p>
            <InputForm onSubmit={handleInputSubmit} algorithmType={getAlgorithmCategory(selectedAlgorithm)} />
            <ControlPanel
              algorithmType={getAlgorithmCategory(selectedAlgorithm)}
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
          <p className="text-xl">{t('select_algorithm_from_sidebar')}</p>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
