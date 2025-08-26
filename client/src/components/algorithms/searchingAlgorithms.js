export const linearSearch = (arr, target) => {
  const animations = [];
  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    animations.push({ type: 'compare', index: i });
    if (arr[i] === target) {
      animations.push({ type: 'found', index: i });
      foundIndex = i;
      break;
    }
  }
  return { foundIndex: foundIndex, animations: animations };
};

export const binarySearch = (arr, target) => {
  arr.sort();
  const animations = [];
  let foundIndex = -1;
  let low = 0;
  let high = arr.length - 1;

  // Binary search requires a sorted array. We need to keep track of original indices.
  const indexedArr = arr.map((value, originalIndex) => ({ value, originalIndex }));
  const sortedIndexedArr = [...indexedArr].sort((a, b) => {
    if (typeof a.value === 'string' && typeof b.value === 'string') {
      return a.value.localeCompare(b.value);
    }
    return a.value - b.value;
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    // For visualization, we can show the range being considered in the original array's context
    // This might be complex, for now, let's show the indices in the sorted array context.
    // The visualization area will need to map this back to the original if it's displaying the original.
    animations.push({ type: 'compare', indices: [low, mid, high], originalIndices: [sortedIndexedArr[low]?.originalIndex, sortedIndexedArr[mid]?.originalIndex, sortedIndexedArr[high]?.originalIndex].filter(i => i !== undefined) });

    if (sortedIndexedArr[mid].value === target) {
      foundIndex = sortedIndexedArr[mid].originalIndex;
      animations.push({ type: 'found', index: foundIndex }); // Use original index for found animation
      break;
    } else if (sortedIndexedArr[mid].value < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return { foundIndex: foundIndex, animations: animations };
};
