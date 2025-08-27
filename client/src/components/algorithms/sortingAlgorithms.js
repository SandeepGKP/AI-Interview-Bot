export const bubbleSort = (arr) => {
  const n = arr.length;
  const animations = [];

  let array = [...arr];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      animations.push({ type: 'compare', indices: [j, j + 1], array: [...array] });
      if (array[j].value > array[j + 1].value) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        animations.push({ type: 'swap', indices: [j, j + 1], array: [...array] });
      }
    }
  }
  return { sortedArray: array, animations: animations };
};

export const selectionSort = (arr) => {
  const n = arr.length;
  const animations = [];
  let array = [...arr];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push({ type: 'compare', indices: [minIdx, j], array: [...array] });
      if (array[j].value < array[minIdx].value) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      animations.push({ type: 'swap', indices: [i, minIdx], array: [...array] });
    }
  }
  return { sortedArray: array, animations: animations };
};

export const insertionSort = (arr) => {
  const n = arr.length;
  const animations = [];
  let array = [...arr]; // Use a copy to modify

  animations.push({ type: 'initial', array: [...array], sortedBoundary: 0, algorithm: 'Insertion Sort' });

  for (let i = 1; i < n; i++) {
    let currentElement = { ...array[i] }; // The element being inserted
    let j = i - 1;

    // Animation step: The element at index `i` is picked up.
    // The array now has a "gap" at index `i`.
    let arrayWithGap = [...array];
    arrayWithGap[i] = { id: `gap-${i}`, value: null, isGap: true }; // Mark as a gap
    animations.push({
      type: 'pickup',
      array: [...arrayWithGap], // Array with the gap
      movingElement: { ...currentElement, originalIndex: i }, // The element being moved
      emptyIndex: i, // The index where the gap is
      sortedBoundary: i - 1,
      algorithm: 'Insertion Sort'
    });

    while (j >= 0 && array[j].value > currentElement.value) {
      // Animation step: Compare array[j] and currentElement
      animations.push({
        type: 'compare',
        array: [...arrayWithGap], // Array with the current gap
        movingElement: { ...currentElement, originalIndex: i },
        emptyIndex: j + 1, // The element at j+1 is being compared with currentElement
        indices: [j, j + 1], // Indices involved in comparison
        sortedBoundary: i - 1,
        algorithm: 'Insertion Sort'
      });

      // Shift array[j] to array[j+1]
      arrayWithGap[j + 1] = array[j]; // Move the actual element from array[j] to arrayWithGap[j+1]
      arrayWithGap[j] = { id: `gap-${j}`, value: null, isGap: true }; // Create a new gap at j
      animations.push({
        type: 'shift',
        array: [...arrayWithGap], // Array with the new gap
        movingElement: { ...currentElement, originalIndex: i },
        emptyIndex: j, // The new empty index
        shiftedFrom: j,
        shiftedTo: j + 1,
        sortedBoundary: i - 1,
        algorithm: 'Insertion Sort'
      });
      j--;
    }

    // Animation step: Insert currentElement into its final position
    arrayWithGap[j + 1] = currentElement;
    array = [...arrayWithGap]; // Update the main array for the next iteration
    animations.push({
      type: 'insert',
      array: [...array], // Final array state for this insertion
      insertedIndex: j + 1, // Where it was inserted
      sortedBoundary: i, // The sorted boundary extends
      algorithm: 'Insertion Sort'
    });
  }
  animations.push({ type: 'final', array: [...array], sortedBoundary: n - 1, algorithm: 'Insertion Sort' });
  return { sortedArray: array, animations: animations };
};

export const mergeSort = (arr) => {
  const animations = [];
  const mainArray = [...arr]; // The array that will eventually be sorted
  const auxiliaryArray = [...arr]; // An auxiliary array for merging operations

  // Initial state of the array
  animations.push({ type: 'initial', array: JSON.parse(JSON.stringify(mainArray)), algorithm: 'Merge Sort' });

  mergeSortHelper(mainArray, 0, mainArray.length - 1, auxiliaryArray, animations, 0); // Start with depth 0

  // Final state of the array
  animations.push({ type: 'final', array: JSON.parse(JSON.stringify(mainArray)), algorithm: 'Merge Sort' });

  return { sortedArray: mainArray, animations: animations };
};

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations, depth) {
  if (startIdx === endIdx) {
    return;
  }

  const midIdx = Math.floor((startIdx + endIdx) / 2);

  // Animation for splitting the array segment
  animations.push({
    type: 'split',
    startIdx,
    endIdx,
    midIdx,
    depth, // Add depth for visualization levels
    array: JSON.parse(JSON.stringify(mainArray)),
    leftSegment: JSON.parse(JSON.stringify(mainArray.slice(startIdx, midIdx + 1))),
    rightSegment: JSON.parse(JSON.stringify(mainArray.slice(midIdx + 1, endIdx + 1))),
  });

  // Recursively sort the left half, copying data from auxiliary to main
  mergeSortHelper(auxiliaryArray, startIdx, midIdx, mainArray, animations, depth + 1);
  // Recursively sort the right half, copying data from auxiliary to main
  mergeSortHelper(auxiliaryArray, midIdx + 1, endIdx, mainArray, animations, depth + 1);

  // Merge the two sorted halves, copying data from main to auxiliary
  doMerge(mainArray, startIdx, midIdx, endIdx, auxiliaryArray, animations, depth); // Pass depth to doMerge as well
}

function doMerge(mainArray, startIdx, midIdx, endIdx, auxiliaryArray, animations, depth) {
  let k = startIdx; // Pointer for the mainArray (where merged elements are placed)
  let i = startIdx; // Pointer for the left half of the auxiliaryArray
  let j = midIdx + 1; // Pointer for the right half of the auxiliaryArray

  // Animation to show the two subarrays ready for merging
  animations.push({
    type: 'readyToMerge',
    startIdx,
    midIdx,
    endIdx,
    depth, // Add depth
    array: JSON.parse(JSON.stringify(auxiliaryArray)),
    leftSegment: JSON.parse(JSON.stringify(auxiliaryArray.slice(startIdx, midIdx + 1))),
    rightSegment: JSON.parse(JSON.stringify(auxiliaryArray.slice(midIdx + 1, endIdx + 1))),
  });

  // Animation for starting the merge process
  animations.push({
    type: 'startMerge',
    startIdx,
    midIdx,
    endIdx,
    depth, // Add depth
    array: JSON.parse(JSON.stringify(auxiliaryArray)),
  });

  while (i <= midIdx && j <= endIdx) {
    // Animation for comparing two elements
    animations.push({
      type: 'compare',
      indices: [i, j], // Indices in the auxiliary array being compared
      depth, // Add depth
      array: JSON.parse(JSON.stringify(auxiliaryArray)),
      mainArrayIndex: k, // The index in the main array where the element will be placed
    });

    if (auxiliaryArray[i].value <= auxiliaryArray[j].value) {
      // Animation for placing an element from the left half into the main array
      animations.push({
        type: 'place',
        index: k, // Index in the main array
        value: auxiliaryArray[i].value,
        sourceIndex: i, // Index in the auxiliary array
        depth, // Add depth
        array: JSON.parse(JSON.stringify(mainArray)), // State of main array before this placement
        auxArray: JSON.parse(JSON.stringify(auxiliaryArray)), // State of auxiliary array
      });
      mainArray[k] = auxiliaryArray[i];
      i++;
    } else {
      // Animation for placing an element from the right half into the main array
      animations.push({
        type: 'place',
        index: k,
        value: auxiliaryArray[j].value,
        sourceIndex: j,
        depth, // Add depth
        array: JSON.parse(JSON.stringify(mainArray)),
        auxArray: JSON.parse(JSON.stringify(auxiliaryArray)),
      });
      mainArray[k] = auxiliaryArray[j];
      j++;
    }
    k++;
  }

  // Copy remaining elements from the left half, if any
  while (i <= midIdx) {
    animations.push({
      type: 'place',
      index: k,
      value: auxiliaryArray[i].value,
      sourceIndex: i,
      depth, // Add depth
      array: JSON.parse(JSON.stringify(mainArray)),
      auxArray: JSON.parse(JSON.stringify(auxiliaryArray)),
    });
    mainArray[k] = auxiliaryArray[i];
    i++;
    k++;
  }

  // Copy remaining elements from the right half, if any
  while (j <= endIdx) {
    animations.push({
      type: 'place',
      index: k,
      value: auxiliaryArray[j].value,
      sourceIndex: j,
      depth, // Add depth
      array: JSON.parse(JSON.stringify(mainArray)),
      auxArray: JSON.parse(JSON.stringify(auxiliaryArray)),
    });
    mainArray[k] = auxiliaryArray[j];
    j++;
    k++;
  }

  // Animation for the end of the merge operation, showing the merged segment in the main array
  animations.push({
    type: 'endMerge',
    startIdx,
    endIdx,
    depth, // Add depth
    array: JSON.parse(JSON.stringify(mainArray)),
  });
}

export const quickSort = (arr) => {
  const animations = [];
  let array = [...arr];

  const partition = (arrToPartition, low, high) => {
    let pivot = arrToPartition[high].value;
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
      animations.push({ type: 'compare', indices: [j, high], array: [...arrToPartition] });
      if (arrToPartition[j].value < pivot) {
        i++;
        [arrToPartition[i], arrToPartition[j]] = [arrToPartition[j], arrToPartition[i]];
        animations.push({ type: 'swap', indices: [i, j], array: [...arrToPartition] });
      }
    }
    [arrToPartition[i + 1], arrToPartition[high]] = [arrToPartition[high], arrToPartition[i + 1]];
    animations.push({ type: 'swap', indices: [i + 1, high], array: [...arrToPartition] });
    return i + 1;
  };

  const quickSortRecursive = (arrToSort, low, high) => {
    if (low < high) {
      let pi = partition(arrToSort, low, high);
      quickSortRecursive(arrToSort, low, pi - 1);
      quickSortRecursive(arrToSort, pi + 1, high);
    }
  };

  quickSortRecursive(array, 0, array.length - 1);
  return { sortedArray: array, animations: animations };
};
