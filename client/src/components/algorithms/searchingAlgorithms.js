export const linearSearch = (arr, target) => {
  const animations = [];
  let foundIndex = -1;
  let array = [...arr]; // Create a copy to track state

  for (let i = 0; i < array.length; i++) {
    animations.push({ type: 'compare', index: i, array: [...array] });
    if (array[i].value === target) {
      animations.push({ type: 'found', index: i, array: [...array] });
      foundIndex = i;
      break;
    }
  }
  return { foundIndex: foundIndex, animations: animations };
};

export const binarySearch = (arr, target) => {
  const animations = [];
  let foundIndex = -1;
  let low = 0;

  // Binary search requires a sorted array. We need to keep track of original IDs.
  const sortedArr = [...arr].sort((a, b) => {
    if (typeof a.value === 'string' && typeof b.value === 'string') {
      return a.value.localeCompare(b.value);
    }
    return a.value - b.value;
  });
  let high = sortedArr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    animations.push({ type: 'compare', indices: [low, mid, high], array: [...sortedArr] });

    if (sortedArr[mid].value === target) {
      foundIndex = sortedArr[mid].id; // Return the ID of the found element
      animations.push({ type: 'found', index: mid, array: [...sortedArr] });
      break;
    } else if (sortedArr[mid].value < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return { foundIndex: foundIndex, animations: animations, sortedArray: sortedArr };
};
