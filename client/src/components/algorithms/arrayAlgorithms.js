export const kadanesAlgorithm = (arr) => {
  let maxSoFar = arr[0];
  let currentMax = arr[0];
  const animations = []; // For visualization, though Kadane's is less visual

  for (let i = 1; i < arr.length; i++) {
    animations.push({ type: 'process', index: i, value: arr[i] });
    currentMax = Math.max(arr[i], currentMax + arr[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return { result: maxSoFar, animations: animations };
};

export const twoPointers = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  const animations = [];

  let sortedArr = [...arr].sort((a, b) => a - b); // Two pointers usually works on sorted arrays

  while (left < right) {
    animations.push({ type: 'compare', indices: [left, right] });
    let sum = sortedArr[left] + sortedArr[right];
    if (sum === target) {
      animations.push({ type: 'found', indices: [left, right] });
      return { result: [sortedArr[left], sortedArr[right]], animations: animations };
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

  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  animations.push({ type: 'window', indices: [0, k - 1], sum: windowSum });

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
    animations.push({ type: 'window', indices: [i - k + 1, i], sum: windowSum });
  }
  return { result: maxSum, animations: animations };
};
