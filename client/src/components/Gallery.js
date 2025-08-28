import React, { useState } from 'react';

const algorithms = {
  searching: [
    {
      name: 'Linear Search',
      description: `⚙ Linear Search is a straightforward algorithm for finding a target value within a list.
      Steps:
      1. Start from the first element of the list.
      2. Compare the current element with the target value.
      3. If the current element matches the target, the search is successful, and its position is returned.
      4. If they don't match, move to the next element in the list.
      5. Repeat steps 2-4 until the target is found or the end of the list is reached.
      6. If the end of the list is reached and the target is not found, the search is unsuccessful.`,
      complexity: 'O(n)',
      code: {
        javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
        python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
        cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`
      }
    },
    {
      name: 'Binary Search',
      description: `⚙ Binary Search is an efficient algorithm for finding a target value within a sorted array.
      Steps:
      1. Initialize two pointers, 'low' to the first element's index (0) and 'high' to the last element's index (length - 1).
      2. While 'low' is less than or equal to 'high', repeat the following:
         a. Calculate the middle index: 'mid' = floor(('low' + 'high') / 2).
         b. Compare the element at 'mid' with the target value:
            i. If array[mid] equals the target, the search is successful, and 'mid' is returned.
            ii. If array[mid] is less than the target, the target must be in the right half. Update 'low' to 'mid' + 1.
            iii. If array[mid] is greater than the target, the target must be in the left half. Update 'high' to 'mid' - 1.
      3. If the loop finishes and the target is not found, the search is unsuccessful.`,
      complexity: 'O(log n)',
      code: {
        javascript: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
        python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        cpp: `int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`
      }
    },
  ],
  sorting: [
    {
      name: 'Bubble Sort',
      description: `⚙ Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
      Steps:
      1. Start at the beginning of the list.
      2. Compare the first two elements. If the first is greater than the second, swap them.
      3. Move to the next pair of elements and repeat step 2.
      4. Continue this process until the end of the list is reached. After the first pass, the largest element will be at the end of the list.
      5. Repeat steps 1-4 for the remaining unsorted portion of the list. Each pass places the next largest element in its correct position.
      6. The algorithm terminates when a pass completes without any swaps, indicating the list is sorted.`,
      complexity: 'O(n^2)',
      code: {
        javascript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
      }
    },
    {
      name: 'Quick Sort',
      description: `⚙ Quick Sort is an efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy.
      Steps:
      1. Choose a Pivot: Select an element from the array, called the pivot. This can be the first, last, middle, or a random element.
      2. Partition: Rearrange the array such that all elements less than the pivot come before it, and all elements greater than the pivot come after it. Elements equal to the pivot can go on either side. After this step, the pivot is in its final sorted position.
      3. Recursively Sort: Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.
      4. The base case for the recursion is when an array has zero or one element, as it is already sorted.`,
      complexity: 'O(n log n)',
      code: {
        javascript: `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = (low - 1);
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return (i + 1);
}`,
        python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = (low - 1)
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return (i + 1)`,
        cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
      }
    },
    {
      name: 'Selection Sort',
      description: `⚙ Selection Sort is a simple sorting algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.
      Steps:
      1. Initialize the first element as the minimum.
      2. Iterate through the unsorted portion of the list to find the smallest element.
      3. If a smaller element is found, update the minimum.
      4. After iterating through the entire unsorted portion, swap the found minimum element with the first element of the unsorted portion.
      5. Move the boundary of the sorted portion one element to the right.
      6. Repeat steps 1-5 until the entire list is sorted.`,
      complexity: 'O(n^2)',
      code: {
        javascript: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`,
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }
}`
      }
    },
    {
      name: 'Insertion Sort',
      description: `⚙ Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time.
      Steps:
      1. Start with the second element of the array. Consider the first element as already sorted.
      2. Compare the current element with the elements in the sorted portion of the array, moving from right to left.
      3. If an element in the sorted portion is greater than the current element, shift it one position to the right.
      4. Continue shifting until a smaller or equal element is found, or the beginning of the array is reached.
      5. Insert the current element into the correct position in the sorted portion.
      6. Move to the next unsorted element and repeat steps 2-5 until the entire array is sorted.`,
      complexity: 'O(n^2)',
      code: {
        javascript: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}`,
        python: `def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        current = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > current:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = current
    return arr`,
        cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
      }
    },
  ],
  graph: [
    {
      name: 'Breadth-First Search (BFS)',
      description: `⚙ Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. It explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.
      Steps:
      1. Start by putting any one of the graph's vertices at the back of a queue.
      2. Take the front item of the queue and add it to the visited list.
      3. Create a list of that vertex's adjacent nodes. Add the ones which are not in the visited list to the back of the queue.
      4. Keep repeating steps 2 and 3 until the queue is empty.`,
      complexity: 'O(V + E)',
      code: {
        javascript: `function bfs(graph, startNode) {
  let visited = new Set();
  let queue = [startNode];
  visited.add(startNode);
  let result = [];

  while (queue.length > 0) {
    let node = queue.shift();
    result.push(node);
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`,
        python: `from collections import deque

def bfs(graph, start_node):
    visited = set()
    queue = deque([start_node])
    visited.add(start_node)
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result`,
        cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <set>

void bfs(const vector<vector<int>>& graph, int startNode) {
    set<int> visited;
    queue<int> q;

    q.push(startNode);
    visited.insert(startNode);

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";

        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    cout << endl;
}`
      }
    },
    {
      name: 'Depth-First Search (DFS)',
      description: `⚙ Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. It explores as far as possible along each branch before backtracking.
      Steps:
      1. Start by putting any one of the graph's vertices on top of a stack.
      2. Take the top item of the stack and add it to the visited list.
      3. Create a list of that vertex's adjacent nodes. Add the ones which are not in the visited list to the top of the stack.
      4. Keep repeating steps 2 and 3 until the stack is empty.`,
      complexity: 'O(V + E)',
      code: {
        javascript: `function dfs(graph, startNode) {
  let visited = new Set();
  let result = [];

  function traverse(node) {
    visited.add(node);
    result.push(node);
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        traverse(neighbor);
      }
    }
  }
  traverse(startNode);
  return result;
}`,
        python: `def dfs(graph, start_node):
    visited = set()
    result = []

    def traverse(node):
        visited.add(node)
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                traverse(neighbor)
    traverse(start_node)
    return result`,
        cpp: `#include <iostream>
#include <vector>
#include <set>

void dfs(const vector<vector<int>>& graph, int startNode, set<int>& visited, vector<int>& result) {
    visited.insert(startNode);
    result.push_back(startNode);
    for (int neighbor : graph[startNode]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(graph, neighbor, visited, result);
        }
    }
}`
      }
    },
    {
      name: 'Dijkstra\'s Algorithm',
      description: `⚙ Dijkstra's algorithm finds the shortest paths between nodes in a graph, which may represent, for example, road networks.
      Steps:
      1. Initialize distances: Set the distance to the starting node as 0 and all other nodes as infinity.
      2. Create a set of unvisited nodes, initially containing all nodes.
      3. While the set of unvisited nodes is not empty:
         a. Select the unvisited node with the smallest distance.
         b. Mark the selected node as visited.
         c. For each neighbor of the current node:
            i. Calculate the distance to the neighbor through the current node.
            ii. If this new distance is smaller than the current recorded distance to the neighbor, update the neighbor's distance.
      4. Repeat until all nodes are visited or the smallest distance among unvisited nodes is infinity.`,
      complexity: 'O(E log V) or O(E + V log V)',
      code: {
        javascript: `function dijkstra(graph, startNode) {
  let distances = {};
  let visited = new Set();
  let pq = new PriorityQueue(); // Assuming a PriorityQueue implementation

  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    let { element: currentNode, priority: currentDistance } = pq.dequeue();
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    for (let neighbor in graph[currentNode]) {
      let distance = graph[currentNode][neighbor];
      let newDistance = currentDistance + distance;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        pq.enqueue(neighbor, newDistance);
      }
    }
  }
  return distances;
}
// Note: A PriorityQueue implementation is required for this code to run.`,
        python: `import heapq

def dijkstra(graph, start_node):
    distances = {node: float('infinity') for node in graph}
    distances[start_node] = 0
    priority_queue = [(0, start_node)] # (distance, node)

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))
    return distances`,
        cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <limits>

// Assuming graph is an adjacency list: map<int, vector<pair<int, int>>>
// where pair is {neighbor, weight}
map<int, int> dijkstra(const map<int, vector<pair<int, int>>>& graph, int startNode) {
    map<int, int> distances;
    for (auto const& [node, neighbors] : graph) {
        distances[node] = numeric_limits<int>::max();
    }
    distances[startNode] = 0;

    // Priority queue stores pairs of {distance, node}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, startNode});

    while (!pq.empty()) {
        int currentDistance = pq.top().first;
        int currentNode = pq.top().second;
        pq.pop();

        if (currentDistance > distances[currentNode]) {
            continue;
        }

        if (graph.count(currentNode)) { // Check if currentNode exists in graph
            for (auto const& edge : graph.at(currentNode)) {
                int neighbor = edge.first;
                int weight = edge.second;
                int newDistance = currentDistance + weight;

                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    pq.push({newDistance, neighbor});
                }
            }
        }
    }
    return distances;
}`
      }
    },
    {
      name: 'Kruskal\'s Algorithm',
      description: `⚙ Kruskal's algorithm finds a minimum spanning tree for a connected, undirected graph.
      Steps:
      1. Create a list of all edges in the graph and sort them in non-decreasing order of their weights.
      2. Initialize a forest where each vertex is a separate tree.
      3. Iterate through the sorted edges:
         a. For each edge (u, v) with weight w:
            i. If u and v are not already in the same tree (i.e., adding this edge does not form a cycle), add the edge to the minimum spanning tree and merge the trees containing u and v.
      4. Repeat until V-1 edges have been added to the minimum spanning tree, where V is the number of vertices.`,
      complexity: 'O(E log E) or O(E log V)',
      code: {
        javascript: `// Note: A Disjoint Set Union (DSU) data structure is required for this code to run.
function kruskal(graph) {
  let edges = [];
  for (let u in graph) {
    for (let v in graph[u]) {
      edges.push({ u, v, weight: graph[u][v] });
    }
  }
  edges.sort((a, b) => a.weight - b.weight);

  let dsu = new DSU(Object.keys(graph)); // Assuming DSU implementation
  let mst = [];
  let totalWeight = 0;

  for (let edge of edges) {
    if (dsu.find(edge.u) !== dsu.find(edge.v)) {
      dsu.union(edge.u, edge.v);
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }
  return { mst, totalWeight };
}`,
        python: `def kruskal(graph):
    edges = []
    for u in graph:
        for v, weight in graph[u].items():
            edges.append((weight, u, v))
    edges.sort()

    parent = {node: node for node in graph}
    rank = {node: 0 for node in graph}

    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]

    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            if rank[root_i] < rank[root_j]:
                parent[root_i] = root_j
            elif rank[root_i] > rank[root_j]:
                parent[root_j] = root_i
                rank[root_i] += 1
            return True
        return False

    mst = []
    total_weight = 0
    for weight, u, v in edges:
        if union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
    return mst, total_weight`,
        cpp: `#include <vector>
#include <algorithm>
#include <numeric>

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

struct DSU {
    vector<int> parent;
    DSU(int n) {
        parent.resize(n + 1);
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int i) {
        if (parent[i] == i)
            return i;
        return parent[i] = find(parent[i]);
    }

    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            parent[root_i] = root_j;
        }
    }
};

vector<Edge> kruskal(int numVertices, vector<Edge>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(numVertices);
    vector<Edge> mst;

    for (const auto& edge : edges) {
        if (dsu.find(edge.u) != dsu.find(edge.v)) {
            dsu.unite(edge.u, edge.v);
            mst.push_back(edge);
        }
    }
    return mst;
}`
      }
    },
    {
      name: 'Prim\'s Algorithm',
      description: `⚙ Prim's algorithm finds a minimum spanning tree for a weighted undirected graph.
      Steps:
      1. Start with an arbitrary vertex as the initial tree.
      2. Grow the minimum spanning tree by adding the cheapest edge that connects a vertex in the tree to a vertex outside the tree.
      3. Repeat step 2 until all vertices are included in the tree.`,
      complexity: 'O(E log V) or O(V^2)',
      code: {
        javascript: `// Note: A PriorityQueue implementation is required for this code to run.
function prim(graph) {
  let startNode = Object.keys(graph)[0];
  let mst = [];
  let visited = new Set();
  let pq = new PriorityQueue(); // Assuming a PriorityQueue implementation

  visited.add(startNode);
  for (let neighbor in graph[startNode]) {
    pq.enqueue({ u: startNode, v: neighbor, weight: graph[startNode][neighbor] }, graph[startNode][neighbor]);
  }

  while (!pq.isEmpty()) {
    let { element: { u, v, weight } } = pq.dequeue();
    if (visited.has(v)) continue;

    visited.add(v);
    mst.push({ u, v, weight });

    for (let neighbor in graph[v]) {
      if (!visited.has(neighbor)) {
        pq.enqueue({ u: v, v: neighbor, weight: graph[v][neighbor] }, graph[v][neighbor]);
      }
    }
  }
  return mst;
}`,
        python: `import heapq

def prim(graph):
    start_node = list(graph.keys())[0]
    mst = []
    visited = {start_node}
    min_heap = []

    for neighbor, weight in graph[start_node].items():
        heapq.heappush(min_heap, (weight, start_node, neighbor))

    while min_heap:
        weight, u, v = heapq.heappop(min_heap)

        if v not in visited:
            visited.add(v)
            mst.append((u, v, weight))

            for next_neighbor, next_weight in graph[v].items():
                if next_neighbor not in visited:
                    heapq.heappush(min_heap, (next_weight, v, next_neighbor))
    return mst`,
        cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <set>
#include <limits>

// Assuming graph is an adjacency list: map<int, vector<pair<int, int>>>
// where pair is {neighbor, weight}
vector<tuple<int, int, int>> prim(const map<int, vector<pair<int, int>>>& graph) {
    if (graph.empty()) return {};

    int startNode = graph.begin()->first;
    vector<tuple<int, int, int>> mst;
    set<int> visited;
    // Priority queue stores tuples of {weight, u, v}
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<tuple<int, int, int>>> pq;

    visited.insert(startNode);

    if (graph.count(startNode)) {
        for (auto const& edge : graph.at(startNode)) {
            pq.push({edge.second, startNode, edge.first});
        }
    }

    while (!pq.empty()) {
        auto [weight, u, v] = pq.top();
        pq.pop();

        if (visited.find(v) != visited.end()) {
            continue;
        }

        visited.insert(v);
        mst.emplace_back(u, v, weight);

        if (graph.count(v)) {
            for (auto const& edge : graph.at(v)) {
                int nextNeighbor = edge.first;
                int nextWeight = edge.second;
                if (visited.find(nextNeighbor) == visited.end()) {
                    pq.push({nextWeight, v, nextNeighbor});
                }
            }
        }
    }
    return mst;
}`
      }
    },
  ],
  tree: [
    {
      name: 'Preorder Traversal',
      description: `⚙ Preorder traversal visits the root node first, then recursively traverses the left subtree, and finally recursively traverses the right subtree.
      Steps:
      1. Visit the root node.
      2. Traverse the left subtree in Preorder.
      3. Traverse the right subtree in Preorder.`,
      complexity: 'O(N)',
      code: {
        javascript: `function preorderTraversal(node) {
  if (!node) return [];
  let result = [];
  result.push(node.value);
  result = result.concat(preorderTraversal(node.left));
  result = result.concat(preorderTraversal(node.right));
  return result;
}
// Note: This assumes a TreeNode structure like { value, left, right }`,
        python: `def preorder_traversal(node):
    if not node:
        return []
    result = []
    result.append(node.value)
    result.extend(preorder_traversal(node.left))
    result.extend(preorder_traversal(node.right))
    return result
# Note: This assumes a TreeNode structure like { value, left, right }`,
        cpp: `#include <vector>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void preorderTraversal(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorderTraversal(root->left, result);
    preorderTraversal(root->right, result);
}`
      }
    },
    {
      name: 'Inorder Traversal',
      description: `⚙ Inorder traversal recursively traverses the left subtree, then visits the root node, and finally recursively traverses the right subtree.
      Steps:
      1. Traverse the left subtree in Inorder.
      2. Visit the root node.
      3. Traverse the right subtree in Inorder.`,
      complexity: 'O(N)',
      code: {
        javascript: `function inorderTraversal(node) {
  if (!node) return [];
  let result = [];
  result = result.concat(inorderTraversal(node.left));
  result.push(node.value);
  result = result.concat(inorderTraversal(node.right));
  return result;
}
// Note: This assumes a TreeNode structure like { value, left, right }`,
        python: `def inorder_traversal(node):
    if not node:
        return []
    result = []
    result.extend(inorder_traversal(node.left))
    result.append(node.value)
    result.extend(inorder_traversal(node.right))
    return result
# Note: This assumes a TreeNode structure like { value, left, right }`,
        cpp: `#include <vector>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void inorderTraversal(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorderTraversal(root->left, result);
    result.push_back(root->val);
    inorderTraversal(root->right, result);
}`
      }
    },
    {
      name: 'Postorder Traversal',
      description: `⚙ Postorder traversal recursively traverses the left subtree, then recursively traverses the right subtree, and finally visits the root node.
      Steps:
      1. Traverse the left subtree in Postorder.
      2. Traverse the right subtree in Postorder.
      3. Visit the root node.`,
      complexity: 'O(N)',
      code: {
        javascript: `function postorderTraversal(node) {
  if (!node) return [];
  let result = [];
  result = result.concat(postorderTraversal(node.left));
  result = result.concat(postorderTraversal(node.right));
  result.push(node.value);
  return result;
}
// Note: This assumes a TreeNode structure like { value, left, right }`,
        python: `def postorder_traversal(node):
    if not node:
        return []
    result = []
    result.extend(postorder_traversal(node.left))
    result.extend(postorder_traversal(node.right))
    result.append(node.value)
    return result
# Note: This assumes a TreeNode structure like { value, left, right }`,
        cpp: `#include <vector>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void postorderTraversal(TreeNode* root, vector<int>& result) {
    if (!root) return;
    postorderTraversal(root->left, result);
    postorderTraversal(root->right, result);
    result.push_back(root->val);
}`
      }
    },
    {
      name: 'Level Order Traversal',
      description: `⚙ Level order traversal (or breadth-first traversal) visits nodes level by level, from left to right.
      Steps:
      1. Create a queue and add the root node to it.
      2. While the queue is not empty:
         a. Dequeue a node.
         b. Visit the dequeued node.
         c. Enqueue its left child (if it exists).
         d. Enqueue its right child (if it exists).`,
      complexity: 'O(N)',
      code: {
        javascript: `function levelOrderTraversal(root) {
  if (!root) return [];
  let result = [];
  let queue = [root];

  while (queue.length > 0) {
    let node = queue.shift();
    result.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}
// Note: This assumes a TreeNode structure like { value, left, right }`,
        python: `from collections import deque

def level_order_traversal(root):
    if not root:
        return []
    result = []
    queue = deque([root])

    while queue:
        node = queue.popleft()
        result.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result
# Note: This assumes a TreeNode structure like { value, left, right }`,
        cpp: `#include <vector>
#include <queue>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void levelOrderTraversal(TreeNode* root, vector<int>& result) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        result.push_back(node->val);

        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`
      }
    },
  ]
};

const Gallery = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-5xl font-serif text-center mb-5">Algorithm Gallery</h1>
      <div className="flex justify-center mb-8">
      </div>
      <div className="space-y-12">
        {Object.keys(algorithms).map((category) => (
          <div key={category}>
            <h2 className="text-3xl font-serif capitalize mb-6">{category.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <div className="grid grid-cols-2 gap-8 ">
              {algorithms[category].map((algo) => (
                <div
                  key={algo.name}
                  className={`relative bg-gray-800 rounded-xl p-6 shadow-xl transition-all duration-300 ease-in-out
                    transform hover:-translate-y-2 hover:shadow-2xl
                    ${algo.name === 'Brainstorming Layout' ? 'bg-gradient-to-br from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border-2 border-purple-400' : 'hover:bg-gray-700'}
                  `}
                >
                  <h3 className="text-2xl font-serif mb-2 text-white">{algo.name}</h3>
                  <p className="bg-gray-900 text-gray-300 mb-4 text-sm whitespace-pre-line max-h-40  font-serif  overflow-y-auto pr-2 rounded-md p-4 [word-spacing:0.1rem]">{algo.description}</p>

                  <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-200">
                      {algo.complexity !== 'N/A' && (
                        <>
                          Time Complexity: <span className="text-teal-400">{algo.complexity}</span>
                        </>

                      )}
                    </p>

                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="bg-slate-300 text-slate-500 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 mt-2 "

                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                    </select>
                    {algo.code && algo.code[selectedLanguage] && (

                      <pre className="bg-gray-900 p-4 rounded-md text-xs overflow-x-auto mt-2 max-h-40">
                        <code>{algo.code[selectedLanguage]}</code>
                      </pre>
                    )}
                  </div>
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
