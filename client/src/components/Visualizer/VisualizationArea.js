import React from 'react';

const VisualizationArea = ({ data, output, animations, currentStep, algorithmType,speed }) => {
  // Render logic for different types of visualizations (e.g., bars for sorting, nodes/edges for graphs)
  // This is a basic example for array visualization.
  const renderArrayVisualization = () => {
    if (!data || data.length === 0) {
      return <p>No data to visualize. Please input data and run an algorithm.</p>;
    }

    // Apply animation effects based on currentStep and animations
    const currentAnimation = animations && animations[currentStep];

    // Determine the array to visualize: either the animated state or the initial data
    const arrayToVisualize = (currentAnimation && currentAnimation.array && (algorithmType === 'Sorting' || algorithmType === 'Array' || algorithmType === 'Searching'))
      ? currentAnimation.array
      : data;

    if (!arrayToVisualize || arrayToVisualize.length === 0) {
      return <p>No data to visualize. Please input data and run an algorithm.</p>;
    }

    // Calculate max value for scaling, considering only numbers
    const maxVal = Math.max(...arrayToVisualize.filter(item => typeof item.value === 'number' && !isNaN(item.value)).map(item => item.value));

    return (
      <div className="h-80 bg-gray-700 p-2 rounded-md relative"> {/* Removed flex items-end */}
        {arrayToVisualize.map((item, index) => {
          const value = item.value;
          const id = item.id;
          let bgColor = 'bg-gradient-bar'; // Default color for all bars, reset each render

          if (currentAnimation) {
            // Apply highlight colors based on the current animation step
            if (currentAnimation.type === 'compare') {
              if (currentAnimation.indices && currentAnimation.indices.includes(index)) {
                bgColor = 'bg-yellow-500'; // Highlight elements being compared
              } else if (currentAnimation.index === index) {
                bgColor = 'bg-yellow-500'; // Highlight element being compared
              }
            } else if (currentAnimation.type === 'swap' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
              bgColor = 'bg-red-500'; // Highlight elements being swapped
            } else if (currentAnimation.type === 'shift' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
              bgColor = 'bg-orange-500'; // Highlight elements being shifted
            } else if (currentAnimation.type === 'insert' && currentAnimation.index === index) {
              bgColor = 'bg-green-500'; // Highlight element being inserted
            } else if (currentAnimation.type === 'merge' && currentAnimation.index === index) {
              bgColor = 'bg-purple-500'; // Highlight elements during merge
            } else if (currentAnimation.type === 'process' && currentAnimation.index === index) {
              bgColor = 'bg-indigo-500'; // Highlight elements being processed (e.g., Kadane's)
            } else if (currentAnimation.type === 'found') {
              if (currentAnimation.indices && currentAnimation.indices.includes(index)) {
                bgColor = 'bg-green-500'; // Highlight found elements (e.g., Two Pointers)
              } else if (currentAnimation.index === index) {
                bgColor = 'bg-green-500'; // Highlight found element (e.g., Linear Search, Binary Search)
              }
            } else if (currentAnimation.type === 'window' && currentAnimation.indices && index >= currentAnimation.indices[0] && index <= currentAnimation.indices[1]) {
              bgColor = 'bg-teal-500'; // Highlight sliding window
            }
          }

          const height = (typeof value === 'number' && !isNaN(value) && maxVal > 0) ? (value / maxVal) * 100 : 20; // Scale height based on max value, default to 20% for non-numbers or if maxVal is 0
          const gapPercentage = 0.5; // 0.5% gap between bars
          const totalBarWidth = 50 / arrayToVisualize.length;
          const barWidth = totalBarWidth - gapPercentage; // Adjust bar width to account for gap
          const leftPosition = index * totalBarWidth + (gapPercentage / 2); // Calculate left position with gap

          let textColor = 'bg-gradient-text text-transparent bg-clip-text';
          if (currentAnimation && currentAnimation.type === 'found') {
            if ((currentAnimation.indices && currentAnimation.indices.includes(index)) || currentAnimation.index === index) {
              textColor = 'text-black'; // Change text color for found element
            }
          }

          return (
            <div
              key={id} // Use unique ID as key
              className={`${bgColor} flex items-center rounded-t-xl justify-center ml-72 absolute bottom-0`}
              style={{
                height: `${height}%`,
                width: `${barWidth}%`,
                left: `${leftPosition}%`,
                transition: `left ${speed / 1000}s linear, background-color 0.1s linear` // Use speed from props for transition duration
              }}
            >
              <span className={`text-xs ${textColor} absolute bottom-0 left-1/2 transform -translate-x-1/2`}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGraphVisualization = () => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="bg-gradient-text text-transparent bg-clip-text">No graph data to visualize. Please input data in adjacency list format (e.g., {"{A: ['B', 'C'], B: ['A'], C: ['A']}"}) and run an algorithm.</p>;
    }

    const allNodes = new Set();
    Object.keys(data).forEach(node => {
      allNodes.add(node);
      Object.keys(data[node]).forEach(neighbor => allNodes.add(neighbor));
    });
    const nodesArray = Array.from(allNodes);

    const nodePositions = {};
    const radius = 150; // Increased radius for better spacing
    const centerX = 200;
    const centerY = 200;

    nodesArray.forEach((node, i) => {
      const angle = (i / nodesArray.length) * 2 * Math.PI;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    const currentAnimation = animations && animations[currentStep];
    const visitedNodes = new Set();
    const activeEdges = new Set(); // For edges being explored or part of MST

    if (currentAnimation) {
      if (currentAnimation.type === 'visit' || currentAnimation.type === 'enqueue') {
        visitedNodes.add(currentAnimation.node);
      } else if (currentAnimation.type === 'explore') {
        activeEdges.add(`${currentAnimation.from}-${currentAnimation.to}`);
        activeEdges.add(`${currentAnimation.to}-${currentAnimation.from}`); // Bidirectional
      } else if (currentAnimation.type === 'add_to_mst' || currentAnimation.type === 'process_edge') {
        activeEdges.add(`${currentAnimation.edge.from}-${currentAnimation.edge.to}`);
        activeEdges.add(`${currentAnimation.edge.to}-${currentAnimation.edge.from}`);
      }
    }

    return (
      <svg width="400" height="400" className="bg-gray-700 rounded-md">
        {/* Render Edges */}
        {/* Render Edges */}
        {nodesArray.map(node =>
          data[node] ? Object.entries(data[node]).map(([neighbor, weight]) => {
            // Ensure both node and neighbor have positions before drawing edge
            if (!nodePositions[node] || !nodePositions[neighbor]) return null;

            const x1 = nodePositions[node].x;
            const y1 = nodePositions[node].y;
            const x2 = nodePositions[neighbor].x;
            const y2 = nodePositions[neighbor].y;

            let strokeColor = 'stroke-gray-400';
            let strokeWidth = '2';

            const edgeKey = `${node}-${neighbor}`;
            if (activeEdges.has(edgeKey)) {
              strokeColor = 'stroke-green-400';
              strokeWidth = '3';
            }

            return (
              <g key={`${node}-${neighbor}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                      className={`${strokeColor} stroke-${strokeWidth}`} />
                {/* Render weight if available */}
                {weight !== undefined && (algorithmType === 'Dijkstra\'s Algorithm' || algorithmType === 'Prim\'s Algorithm' || algorithmType === 'Kruskal\'s Algorithm') && (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-xs">
                    {weight}
                  </text>
                )}
              </g>
            );
          }) : null
        )}
        {/* Render Nodes */}
        {nodesArray.map(node => {
          const { x, y } = nodePositions[node];
          let fillColor = 'fill-blue-500';
          if (visitedNodes.has(node)) {
            fillColor = 'fill-yellow-500';
          } else if (currentAnimation && currentAnimation.type === 'visit' && currentAnimation.node === node) {
            fillColor = 'fill-yellow-500';
          } else if (currentAnimation && currentAnimation.type === 'enqueue' && currentAnimation.node === node) {
            fillColor = 'fill-purple-500';
          }
          return (
            <g key={node}>
              <circle cx={x} cy={y} r="15" className={`${fillColor} stroke-white stroke-1`} />
              <text x={x} y={y + 5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-sm">{node}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderTreeVisualization = () => {
    if (!data || !data.value) { // Assuming data is the root TreeNode
      return <p className="bg-gradient-text text-transparent bg-clip-text">No tree data to visualize. Please input data in a specific format (e.g., {"{value: 1, left: {value: 2}, right: {value: 3}}"}).</p>;
    }

    const nodePositions = {};
    const nodeRadius = 15;
    const levelHeight = 60;
    const horizontalSpacing = 40;

    // A more robust way to calculate positions to avoid overlaps, especially for binary trees.
    // This is a simplified version, a real layout algorithm would be more complex.
    const layoutTree = (node, x, y, level, siblingOffset) => {
      if (!node) return null;

      const leftChildPos = layoutTree(node.left, x - siblingOffset, y + levelHeight, level + 1, siblingOffset / 2);
      const rightChildPos = layoutTree(node.right, x + siblingOffset, y + levelHeight, level + 1, siblingOffset / 2);

      nodePositions[node.value] = { x, y, level, nodeRef: node };

      return { x, y, nodeRef: node };
    };

    // Initial call for layoutTree
    layoutTree(data, 200, 30, 0, 100); // Start root at (200, 30), initial sibling offset

    const currentAnimation = animations && animations[currentStep];
    const visitedNodes = new Set();
    const enqueuedNodes = new Set();

    if (currentAnimation) {
      if (currentAnimation.type === 'visit') {
        visitedNodes.add(currentAnimation.node);
      } else if (currentAnimation.type === 'enqueue') {
        enqueuedNodes.add(currentAnimation.node);
      }
    }

    return (
      <svg width="400" height="400" className="bg-gray-700 rounded-md">
        {/* Render Edges */}
        {Object.values(nodePositions).map(({ x, y, nodeRef }) => {
          const edges = [];
          if (nodeRef.left && nodePositions[nodeRef.left.value]) {
            const childPos = nodePositions[nodeRef.left.value];
            edges.push(
              <line key={`${nodeRef.value}-${nodeRef.left.value}`} x1={x} y1={y + nodeRadius} x2={childPos.x} y2={childPos.y - nodeRadius}
                    className="stroke-gray-400 stroke-2" />
            );
          }
          if (nodeRef.right && nodePositions[nodeRef.right.value]) {
            const childPos = nodePositions[nodeRef.right.value];
            edges.push(
              <line key={`${nodeRef.value}-${nodeRef.right.value}`} x1={x} y1={y + nodeRadius} x2={childPos.x} y2={childPos.y - nodeRadius}
                    className="stroke-gray-400 stroke-2" />
            );
          }
          return edges;
        })}

        {/* Render Nodes */}
        {Object.entries(nodePositions).map(([value, { x, y }]) => {
          let fillColor = 'fill-blue-500';
          if (visitedNodes.has(Number(value))) {
            fillColor = 'fill-yellow-500';
          } else if (enqueuedNodes.has(Number(value))) {
            fillColor = 'fill-purple-500';
          }
          return (
            <g key={value}>
              <circle cx={x} cy={y} r={nodeRadius} className={`${fillColor} stroke-white stroke-1`} />
              <text x={x} y={y + 5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-sm">{value}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderVisualization = () => {
    if (algorithmType === 'Sorting' || algorithmType === 'Array' || algorithmType === 'Searching') {
      return renderArrayVisualization();
    } else if (algorithmType === 'Graph') {
      return renderGraphVisualization();
    } else if (algorithmType === 'Tree') {
      return renderTreeVisualization();
    }
    return <p className="bg-gradient-text text-transparent bg-clip-text">Select an algorithm to see its visualization.</p>;
  };

  return (
    <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 bg-gradient-text text-transparent bg-clip-text">Visualization Area</h2>
      <div className="mb-4">
        {renderVisualization()}
      </div>
      <div className="bg-gray-800 p-3 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Algorithm Output:</h3>
        <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

export default VisualizationArea;
