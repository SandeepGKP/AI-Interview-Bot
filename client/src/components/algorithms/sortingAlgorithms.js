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
  let array = [...arr]; // This array will be modified in place to reflect merges

  const merge = (arr1, arr2) => {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
      if (arr1[i].value < arr2[j].value) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }
    while (i < arr1.length) {
      result.push(arr1[i]);
      i++;
    }
    while (j < arr2.length) {
      result.push(arr2[j]);
      j++;
    }
    return result;
  };

  const mergeSortRecursive = (arrToSort, startIdx, endIdx) => {
    if (arrToSort.length <= 1) return arrToSort;

    const mid = Math.floor(arrToSort.length / 2);
    const left = arrToSort.slice(0, mid);
    const right = arrToSort.slice(mid);

    const sortedLeft = mergeSortRecursive(left, startIdx, startIdx + left.length - 1);
    const sortedRight = mergeSortRecursive(right, startIdx + left.length, endIdx);

    const merged = merge(sortedLeft, sortedRight);

    // Simulate the merge step for visualization
    let currentIdx = startIdx;
    for (let k = 0; k < merged.length; k++) {
      array[currentIdx + k] = merged[k]; // Update the global array
      animations.push({ type: 'merge', index: currentIdx + k, value: merged[k].value, array: [...array] });
    }

    return merged;
  };

  const sortedArray = mergeSortRecursive(array, 0, array.length - 1);
  return { sortedArray: array, animations: animations };
};

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
