export const bfs = (graph, startNode) => {
  const animations = [];
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    animations.push({ type: 'visit', node: currentNode });

    for (const neighbor of Object.keys(graph[currentNode])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        animations.push({ type: 'enqueue', node: neighbor, from: currentNode });
      }
    }
  }
  return { visitedNodes: Array.from(visited), animations: animations };
};

export const dfs = (graph, startNode) => {
  const animations = [];
  const visited = new Set();

  const dfsRecursive = (node) => {
    visited.add(node);
    animations.push({ type: 'visit', node: node });

    for (const neighbor of Object.keys(graph[node])) {
      if (!visited.has(neighbor)) {
        animations.push({ type: 'explore', from: node, to: neighbor });
        dfsRecursive(neighbor);
      }
    }
  };

  dfsRecursive(startNode);
  return { visitedNodes: Array.from(visited), animations: animations };
};

export const dijkstrasAlgorithm = (graph, startNode) => {
  const animations = [];
  const distances = {};
  const previous = {};
  const pq = new PriorityQueue(); // Min-priority queue

  // Initialize distances
  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    let { element: smallestNode, priority: smallestDistance } = pq.dequeue();

    if (smallestDistance > distances[smallestNode]) continue;

    animations.push({ type: 'visit', node: smallestNode, distance: smallestDistance });

    for (let neighbor in graph[smallestNode]) {
      let distance = graph[smallestNode][neighbor];
      let newDistance = distances[smallestNode] + distance;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = smallestNode;
        pq.enqueue(neighbor, newDistance);
        animations.push({ type: 'update_distance', node: neighbor, newDistance: newDistance, from: smallestNode });
      }
    }
  }
  return { distances: distances, previous: previous, animations: animations };
};

// Helper for Dijkstra's: Priority Queue
class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(element, priority) {
    this.values.push({ element, priority });
    this.sort();
  }
  dequeue() {
    return this.values.shift();
  }
  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
  isEmpty() {
    return this.values.length === 0;
  }
}

export const primsAlgorithm = (graph) => {
  const animations = [];
  const mst = [];
  const visited = new Set();
  const edges = new PriorityQueue(); // Min-priority queue for edges

  // Assuming graph is an adjacency list where graph[node] = [{neighbor, weight}]
  // Start with an arbitrary node, e.g., the first one in the graph
  const startNode = Object.keys(graph)[0];
  visited.add(startNode);
  animations.push({ type: 'visit_node', node: startNode });

  // Add all edges connected to the startNode to the priority queue
  for (const neighbor in graph[startNode]) {
    const weight = graph[startNode][neighbor];
    edges.enqueue({ from: startNode, to: neighbor, weight: weight }, weight);
    animations.push({ type: 'add_edge_to_pq', edge: { from: startNode, to: neighbor, weight: weight } });
  }

  while (!edges.isEmpty()) {
    let { element: { from, to, weight } } = edges.dequeue();

    if (visited.has(to)) continue;

    visited.add(to);
    mst.push({ from, to, weight });
    animations.push({ type: 'add_to_mst', edge: { from, to, weight } });

    // Add all edges connected to the newly visited node 'to' to the priority queue
    for (const neighbor in graph[to]) {
      const edgeWeight = graph[to][neighbor];
      if (!visited.has(neighbor)) {
        edges.enqueue({ from: to, to: neighbor, weight: edgeWeight }, edgeWeight);
        animations.push({ type: 'add_edge_to_pq', edge: { from: to, to: neighbor, weight: edgeWeight } });
      }
    }
  }
  return { mst: mst, animations: animations };
};

export const kruskalsAlgorithm = (graph) => {
  const animations = [];
  const mst = [];
  const edges = [];
  const parent = {}; // For Union-Find

  // Initialize parent for Union-Find
  for (let node in graph) {
    parent[node] = node;
  }

  // Extract all edges from the graph
  for (let node in graph) {
    for (let neighbor in graph[node]) {
      edges.push({ from: node, to: neighbor, weight: graph[node][neighbor] });
    }
  }

  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);

  // Union-Find helper functions
  const find = (i) => {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootJ] = rootI;
      return true;
    }
    return false;
  };

  for (const edge of edges) {
    animations.push({ type: 'process_edge', edge: edge });
    if (union(edge.from, edge.to)) {
      mst.push(edge);
      animations.push({ type: 'add_to_mst', edge: edge });
    }
  }
  return { mst: mst, animations: animations };
};
