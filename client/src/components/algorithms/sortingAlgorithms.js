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
  let array = [...arr];

  for (let i = 1; i < n; i++) {
    let current = array[i];
    let j = i - 1;
    while (j >= 0 && array[j].value > current.value) {
      animations.push({ type: 'compare', indices: [j, j + 1], array: [...array] });
      array[j + 1] = array[j];
      animations.push({ type: 'shift', indices: [j, j + 1], array: [...array] });
      j--;
    }
    array[j + 1] = current;
    animations.push({ type: 'insert', index: j + 1, value: current.value, array: [...array] });
  }
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
