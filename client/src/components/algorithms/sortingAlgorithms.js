export const bubbleSort = (arr) => {
  const n = arr.length;
  const animations = []; // To store steps for visualization

  let array = [...arr]; // Create a copy to avoid modifying the original

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      animations.push({ type: 'compare', indices: [j, j + 1] }); // Mark for comparison
      if (array[j] > array[j + 1]) {
        animations.push({ type: 'swap', indices: [j, j + 1] }); // Mark for swap
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
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
      animations.push({ type: 'compare', indices: [minIdx, j] });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      animations.push({ type: 'swap', indices: [i, minIdx] });
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
    }
  }
  return { sortedArray: array, animations: animations };
};

export const insertionSort = (arr) => {
  const n = arr.length;
  const animations = [];
  let array = [...arr];

  for (let i = 1; i < n; i++) {
    let current = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > current) {
      animations.push({ type: 'compare', indices: [j, j + 1] });
      animations.push({ type: 'shift', indices: [j, j + 1] });
      array[j + 1] = array[j];
      j--;
    }
    animations.push({ type: 'insert', index: j + 1, value: current });
    array[j + 1] = current;
  }
  return { sortedArray: array, animations: animations };
};

export const mergeSort = (arr) => {
  const animations = [];
  let array = [...arr];

  const merge = (arr1, arr2) => {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] < arr2[j]) {
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
      animations.push({ type: 'merge', index: currentIdx + k, value: merged[k] });
    }

    return merged;
  };

  const sortedArray = mergeSortRecursive(array, 0, array.length - 1);
  return { sortedArray: sortedArray, animations: animations };
};

export const quickSort = (arr) => {
  const animations = [];
  let array = [...arr];

  const partition = (arrToPartition, low, high) => {
    let pivot = arrToPartition[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
      animations.push({ type: 'compare', indices: [j, high] }); // Compare with pivot
      if (arrToPartition[j] < pivot) {
        i++;
        animations.push({ type: 'swap', indices: [i, j] });
        [arrToPartition[i], arrToPartition[j]] = [arrToPartition[j], arrToPartition[i]];
      }
    }
    animations.push({ type: 'swap', indices: [i + 1, high] });
    [arrToPartition[i + 1], arrToPartition[high]] = [arrToPartition[high], arrToPartition[i + 1]];
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
