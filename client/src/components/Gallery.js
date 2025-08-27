import React from 'react';

const algorithms = {
  searching: [
    {
      name: 'Linear Search',
      description: 'A simple search algorithm that finds the position of a target value within a list by checking every one of its elements, one at a time and in sequence, until the desired one is found.',
      complexity: 'O(n)',
    },
    {
      name: 'Binary Search',
      description: 'A search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array; if they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half, again taking the middle element to compare to the target value, and repeating this until the target value is found.',
      complexity: 'O(log n)',
    },
  ],
  sorting: [
    {
      name: 'Bubble Sort',
      description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
      complexity: 'O(n^2)',
    },
    {
      name: 'Merge Sort',
      description: 'An efficient, comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the implementation preserves the input order of equal elements in the sorted output. It is a divide and conquer algorithm.',
      complexity: 'O(n log n)',
    },
    {
      name: 'Quick Sort',
      description: 'An efficient sorting algorithm, serving as a systematic method for placing the elements of an array in order. When implemented well, it can be about two or three times faster than its main competitors, merge sort and heapsort.',
      complexity: 'O(n log n)',
    },
    {
      name: 'Selection Sort',
      description: 'A simple sorting algorithm that divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.',
      complexity: 'O(n^2)',
    },
    {
      name: 'Insertion Sort',
      description: 'A simple sorting algorithm that builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
      complexity: 'O(n^2)',
    },
  ],
  graph: [
    {
      name: 'Breadth-First Search (BFS)',
      description: 'An algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a ‘search key’), and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
      complexity: 'O(V + E)',
    },
    {
      name: 'Depth-First Search (DFS)',
      description: 'An algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
      complexity: 'O(V + E)',
    },
  ],
};

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-12">Algorithm Gallery</h1>
      <div className="space-y-12">
        {Object.keys(algorithms).map((category) => (
          <div key={category}>
            <h2 className="text-3xl font-semibold capitalize mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {algorithms[category].map((algo) => (
                <div key={algo.name} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold mb-2">{algo.name}</h3>
                  <p className="text-gray-400 mb-4">{algo.description}</p>
                  <p className="text-lg font-semibold">
                    Time Complexity: <span className="text-teal-400">{algo.complexity}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
