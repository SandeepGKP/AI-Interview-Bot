export const kadanesAlgorithm = (arr) => {
  const animations = [];
  let array = [...arr]; // Create a copy to track state

  let maxSoFar = array[0].value;
  let currentMax = array[0].value;

  animations.push({ type: 'process', index: 0, value: array[0].value, array: [...array] });

  for (let i = 1; i < array.length; i++) {
    currentMax = Math.max(array[i].value, currentMax + array[i].value);
    maxSoFar = Math.max(maxSoFar, currentMax);
    animations.push({ type: 'process', index: i, value: array[i].value, array: [...array] });
  }
  return { result: maxSoFar, animations: animations };
};

export const twoPointers = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  const animations = [];
  // Two pointers usually works on sorted arrays, sort by value
  let array = [...arr].sort((a, b) => a.value - b.value);

  while (left < right) {
    animations.push({ type: 'compare', indices: [left, right], array: [...array] });
    let sum = array[left].value + array[right].value;
    if (sum === target) {
      animations.push({ type: 'found', indices: [left, right], array: [...array] });
      return { result: [array[left].value, array[right].value], animations: animations };
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return { result: null, animations: animations }; // No pair found
};

export const slidingWindow = (arr, k) => {
  if (k > arr.length) return { result: null, animations: [] };

  let maxSum = 0;
  let windowSum = 0;
  const animations = [];
  let array = [...arr]; // Create a copy to track state

  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += array[i].value;
  }
  maxSum = windowSum;
  animations.push({ type: 'window', indices: [0, k - 1], sum: windowSum, array: [...array] });

  // Slide the window
  for (let i = k; i < array.length; i++) {
    windowSum = windowSum - array[i - k].value + array[i].value;
    maxSum = Math.max(maxSum, windowSum);
    animations.push({ type: 'window', indices: [i - k + 1, i], sum: windowSum, array: [...array] });
  }
  return { result: maxSum, animations: animations };
};
