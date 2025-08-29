import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// import TreeVisualization from './TreeVisualization';
import RenderVisualization from './RenderVisualizations';
// import MergeSortVisualizationComponent from './MergeSortVisualizationComponent'; // Import the new component

const ArrayVisualizationComponent = React.memo(({ data, output, animations, currentStep, algorithmType, speed, algorithm }) => {
  const svgRef = useRef(null);
  const [actualContainerWidth, setActualContainerWidth] = useState(0);
  const prevMidIndexRef = useRef(null); // Declare useRef unconditionally

  const currentAnimation = animations && animations[currentStep];

  // Calculate midIndex unconditionally
  const midIndex = (algorithmType === 'Searching' && algorithm === 'Binary Search' && currentAnimation && (currentAnimation.type === 'compare' || currentAnimation.type === 'found'))
    ? currentAnimation.index
    : null;

  useEffect(() => {
    if (svgRef.current) {
      setActualContainerWidth(svgRef.current.clientWidth);
    }
    // Update prevMidIndexRef unconditionally, but only if midIndex is valid
    if (midIndex !== null) {
      prevMidIndexRef.current = midIndex;
    }
  }, [data, animations, currentStep, algorithmType, speed, algorithm, midIndex]); // Added midIndex as a dependency

  if (!data || data.length === 0) {
    return <p>No data to visualize. Please input data and run an algorithm.</p>;
  }

  let arrayToVisualize = data;
  let movingElement = null;
  let emptyIndex = -1;

  if (currentAnimation && currentAnimation.array && (algorithmType === 'Sorting' || algorithmType === 'Array' || algorithmType === 'Searching')) {
    arrayToVisualize = currentAnimation.array;
    if (currentAnimation.movingElement) {
      movingElement = currentAnimation.movingElement;
      emptyIndex = currentAnimation.emptyIndex;
    }
  } else if (animations && currentStep >= animations.length && animations.length > 0) {
    arrayToVisualize = animations[animations.length - 1].array;
  }

  if (!arrayToVisualize || arrayToVisualize.length === 0) {
    return <p>No data to visualize. Please input data and run an algorithm.</p>;
  }

  const nodeRadius = 20;
  const containerHeight = 200;
  const numNodes = arrayToVisualize.length;
  const fixedGap = 20;

  let startY;

  if (algorithmType === 'Sorting' && algorithm === 'Insertion Sort') {
    startY = containerHeight - 2 * nodeRadius;
  }
  else {
    startY = containerHeight / 2
  }
  let cxPositions = [];

  if (numNodes > 0) {
    const minNodeDiameter = 2 * nodeRadius;
    const minTotalNodesWidth = numNodes * minNodeDiameter;
    const minTotalGapWidth = (numNodes - 1) * fixedGap;

    let calculatedGap = fixedGap;

    if (minTotalNodesWidth + minTotalGapWidth > actualContainerWidth) {
      calculatedGap = Math.max(0, (actualContainerWidth - minTotalNodesWidth) / (numNodes - 1));
      if (numNodes === 1) { // Handle single node case to avoid division by zero
        calculatedGap = 0;
      }
    }

    const effectiveNodeWidth = minNodeDiameter + calculatedGap;
    const totalOccupiedWidth = numNodes * effectiveNodeWidth - calculatedGap;

    let currentStartX = (actualContainerWidth - totalOccupiedWidth) / 2;

    if (currentStartX < 0) {
      currentStartX = 0;
    }

    for (let i = 0; i < numNodes; i++) {
      cxPositions.push(currentStartX + nodeRadius + i * effectiveNodeWidth);
    }
  }

  return (
    
    <svg ref={svgRef} height={containerHeight} className="bg-gray-700 p-2  rounded-md w-full relative">
      {arrayToVisualize.map((item, index) => {
        if (item.isGap) return null; // Do not render gap placeholders

        const value = item.value;
        const id = item.id;
        let fillColor = 'fill-blue-500';
        let opacity = 1; // Default opacity

        const isAnimationComplete = (animations && currentStep >= animations.length - 1);

        if (!isAnimationComplete && currentAnimation) {
          if (algorithmType === 'Sorting' && currentAnimation.algorithm === 'Insertion Sort') {
            const sortedBoundary = currentAnimation.sortedBoundary !== undefined ? currentAnimation.sortedBoundary : -1;
            if (index <= sortedBoundary) {
              fillColor = 'fill-green-500'; // Sorted part
            } else {
              fillColor = 'fill-blue-500'; // Unsorted part
            }

            if (currentAnimation.type === 'compare' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
              fillColor = 'fill-yellow-500'; // Elements being compared
            } else if (currentAnimation.type === 'shift' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
              fillColor = 'fill-orange-500'; // Elements being shifted
            } else if (currentAnimation.type === 'insert' && currentAnimation.insertedIndex === index) {
              fillColor = 'fill-red-500'; // Element being inserted
            }
          } else { // This 'else' block handles non-sorting algorithms, including searching
            if (algorithmType === 'Searching' && algorithm === 'Binary Search' && currentAnimation.type === 'window') {
              const [low, high] = currentAnimation.indices;
              if (index < low || index > high) {
                fillColor = 'fill-gray-700'; // Faded color for out-of-search-space nodes
                opacity = 0.4; // Reduced opacity
              } else {
                fillColor = 'fill-blue-500'; // Default color for in-search-space nodes
              }
            }

            // Apply specific animation colors on top of the base color, ensuring full opacity
            if (currentAnimation.type === 'compare') {
              if (currentAnimation.indices && currentAnimation.indices.includes(index)) {
                fillColor = 'fill-yellow-500';
                opacity = 1;
              } else if (currentAnimation.index === index) {
                fillColor = 'fill-yellow-500';
                opacity = 1;
              }
            } else if (currentAnimation.type === 'swap' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
              fillColor = 'fill-red-500';
              opacity = 1;
            } else if (currentAnimation.type === 'shift' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
              fillColor = 'fill-orange-500';
              opacity = 1;
            } else if (currentAnimation.type === 'insert' && currentAnimation.index === index) {
              fillColor = 'fill-green-500';
              opacity = 1;
            } else if (currentAnimation.type === 'merge' && currentAnimation.index === index) {
              fillColor = 'fill-purple-500';
              opacity = 1;
            } else if (currentAnimation.type === 'process' && currentAnimation.index === index) {
              fillColor = 'fill-indigo-500';
              opacity = 1;
            } else if (currentAnimation.type === 'found') {
              if (currentAnimation.indices && currentAnimation.indices.includes(index)) {
                fillColor = 'fill-green-500';
                opacity = 1;
              } else if (currentAnimation.index === index) {
                fillColor = 'fill-green-500';
                opacity = 1;
              }
            } else if (currentAnimation.type === 'window' && currentAnimation.indices && index >= currentAnimation.indices[0] && index <= currentAnimation.indices[1]) {
              fillColor = 'fill-teal-500'; // Active window color
              opacity = 1;
            }
          }
        }

        const cx = cxPositions[index];

        const showArrow = currentAnimation && (
          (currentAnimation.type === 'compare' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
          (currentAnimation.type === 'swap' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
          (currentAnimation.type === 'shift' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
          (currentAnimation.type === 'insert' && currentAnimation.insertedIndex === index) ||
          (currentAnimation.type === 'merge' && currentAnimation.index === index) ||
          (currentAnimation.type === 'process' && currentAnimation.index === index) ||
          (currentAnimation.type === 'found' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
          (currentAnimation.type === 'window' && currentAnimation.indices && index >= currentAnimation.indices[0] && index <= currentAnimation.indices[1])
        );

        return (
          <motion.g
            key={id}
            initial={{ x: cx, y: 0 }} // Initial y position
            animate={{
              x: cx,
              y: (currentAnimation && currentAnimation.type === 'found' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
                 (currentAnimation && currentAnimation.type === 'found' && currentAnimation.index === index)
                 ? [0, -10, 0, -5, 0] // Bounce animation for found element
                 : (isAnimationComplete && algorithmType === 'Sorting') // Bounce animation for all nodes after sorting is complete
                   ? [0, -10, 0, -5, 0]
                   : 0
            }}
            transition={{
              duration: (currentAnimation && currentAnimation.type === 'found' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
                        (currentAnimation && currentAnimation.type === 'found' && currentAnimation.index === index)
                        ? 0.8 // Bounce duration for found element
                        : (isAnimationComplete && algorithmType === 'Sorting')
                          ? 0.8 // Bounce duration for sorted elements
                          : speed / 1000,
              ease: "linear",
              repeat: (currentAnimation && currentAnimation.type === 'found' && currentAnimation.indices && currentAnimation.indices.includes(index)) ||
                      (currentAnimation && currentAnimation.type === 'found' && currentAnimation.index === index) ||
                      (isAnimationComplete && algorithmType === 'Sorting')
                      ? 1 // Repeat bounce 1 second for found or sorted elements
                      : 0
            }}
          >
            <circle
              cx={0}
              cy={startY}
              r={nodeRadius}
              className={`${fillColor} stroke-white stroke-1`}
              style={{ transition: `fill 0.1s linear`, opacity: opacity }} // Apply opacity here
            />
            <text
              x={0}
              y={startY + 5}
              textAnchor="middle"
              className="bg-gradient-text text-transparent bg-clip-text text-sm"
            >
              {value}
            </text>
            {showArrow && (
              <motion.text
                x={0}
                // y={startY - nodeRadius - 10}
                textAnchor="middle"
                className="text-white text-xl"
                initial={{ opacity: 1, y: startY - nodeRadius - 10 }}
                animate={{ opacity: 1, y: startY - nodeRadius - 10 }}
                transition={{ duration: 5.0, repeat: Infinity, repeatType: "reverse" }} 
                // {/* Increased duration for smoother arrow movement */}
              >
                &#x2193;
              </motion.text>
            )}
          </motion.g>
        );
      })}
      {movingElement && (
        <motion.g
          key={movingElement.id}
          initial={{ x: cxPositions[movingElement.originalIndex], y: startY }}
          animate={{ x: cxPositions[emptyIndex], y: startY - nodeRadius - 30 }} // Animate to a "picked up" position
          transition={{ duration: speed / 1000, ease: "linear" }}
        >
          <circle
            cx={0}
            cy={0}
            r={nodeRadius}
            className="fill-purple-500 stroke-white stroke-1" // Highlight the moving element
          />
          <text
            x={0}
            y={5}
            textAnchor="middle"
            className="bg-gradient-text text-transparent bg-clip-text text-sm"
          >
            {movingElement.value}
          </text>
          <motion.text
            x={0}
            // y={-25}
            textAnchor="middle"
            className="text-white text-xl"
            initial={{ opacity: 1, y: -40 }}
            animate={{ opacity: 1, y: -20 }}
            transition={{ duration: 5.0, repeat: Infinity, repeatType: "reverse", ease: "easeOut" }}
            //  {/* Increased duration for smoother arrow movement */}
          >
            &#x2193; {/* Downward arrow character */}
          </motion.text>
        </motion.g>
      )}
      
    </svg>
  );
});

const GraphVisualizationComponent = React.memo(({ data, output, animations, currentStep, algorithmType, speed, algorithm }) => {
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
  const svgWidth = 600; // Increased width for better spacing
  const svgHeight = 400; // Increased height
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const nodeRadius = 20; // Radius of the node circles

  // Calculate dynamic radius based on number of nodes to prevent overlap
  const minRadius = 100;
  const maxRadius = Math.min(centerX, centerY) - nodeRadius - 10; // Ensure nodes don't go out of bounds
  const calculatedRadius = Math.max(minRadius, Math.min(maxRadius, nodesArray.length * 20)); // Adjust 20 as needed

  nodesArray.forEach((node, i) => {
    const angle = (i / nodesArray.length) * 2 * Math.PI;
    nodePositions[node] = {
      x: centerX + calculatedRadius * Math.cos(angle),
      y: centerY + calculatedRadius * Math.sin(angle),
    };
  });

  const visitedNodes = new Set();
  const activeEdges = new Set();

  // Accumulate visited nodes and active edges up to the current step
  for (let i = 0; i <= currentStep && i < animations.length; i++) {
    const animation = animations[i];
    if (animation.type === 'visit' || animation.type === 'enqueue' || animation.type === 'update_distance') {
      visitedNodes.add(animation.node);
    } else if (animation.type === 'explore') {
      activeEdges.add(`${animation.from}-${animation.to}`);
      activeEdges.add(`${animation.to}-${animation.from}`);
    } else if (animation.type === 'add_to_mst' || animation.type === 'process_edge') {
      activeEdges.add(`${animation.edge.from}-${animation.edge.to}`);
      activeEdges.add(`${animation.edge.to}-${animation.edge.from}`);
    }
  }

  const currentAnimation = animations && animations[currentStep]; // Still need currentAnimation for specific step highlights

  return (
    <svg width={svgWidth} height={svgHeight} className="bg-gray-700 w-full rounded-md mx-auto">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7"
          refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7"
          refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="green" />
        </marker>
      </defs>
      {nodesArray.map(node =>
        data[node] ? Object.entries(data[node]).map(([neighbor, weight]) => {
          if (!nodePositions[node] || !nodePositions[neighbor]) return null;

          const x1 = nodePositions[node].x;
          const y1 = nodePositions[node].y;
          const x2 = nodePositions[neighbor].x;
          const y2 = nodePositions[neighbor].y;

          let strokeColor = 'stroke-gray-400';
          let strokeWidth = '2';
          let markerId = 'url(#arrowhead)';

          const edgeKey = `${node}-${neighbor}`;
          if (activeEdges.has(edgeKey)) {
            strokeColor = 'stroke-green-400';
            strokeWidth = '3';
            markerId = 'url(#arrowhead-active)';
          }

          // Adjust line end to not overlap with arrowhead
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const adjustedX2 = x2 - nodeRadius * Math.cos(angle);
          const adjustedY2 = y2 - nodeRadius * Math.sin(angle);
          const adjustedX1 = x1 + nodeRadius * Math.cos(angle);
          const adjustedY1 = y1 + nodeRadius * Math.sin(angle);


          return (
            <g key={`${node}-${neighbor}`}>
              <line x1={adjustedX1} y1={adjustedY1} x2={adjustedX2} y2={adjustedY2}
                className={`${strokeColor} stroke-${strokeWidth}`} markerEnd={markerId} />
              {weight !== undefined && (algorithmType === 'Dijkstra\'s Algorithm' || algorithmType === 'Prim\'s Algorithm' || algorithmType === 'Kruskal\'s Algorithm') && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-xs">
                  {weight}
                </text>
              )}
            </g>
          );
        }) : null
      )}
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
        // Highlight nodes involved in active edges
        if (currentAnimation && currentAnimation.type === 'explore' && (currentAnimation.from === node || currentAnimation.to === node)) {
          fillColor = 'fill-orange-500';
        } else if (currentAnimation && (currentAnimation.type === 'add_to_mst' || currentAnimation.type === 'process_edge') && (currentAnimation.edge.from === node || currentAnimation.edge.to === node)) {
          fillColor = 'fill-orange-500';
        }

        const showArrow = currentAnimation && (
          (currentAnimation.type === 'visit' && currentAnimation.node === node) ||
          (currentAnimation.type === 'enqueue' && currentAnimation.node === node)
        );
        return (
          <motion.g
            key={node}
            initial={{ x: x, y: y }}
            animate={{ x: x, y: y }}
            transition={{ duration: speed / 2000, ease: "linear" }}
          >
            <circle cx={0} cy={0} r={nodeRadius} className={`${fillColor} stroke-white stroke-1`} />
            <text x={0} y={5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-sm">{node}</text>
            {showArrow && (
              <motion.text
                x={0}
                y={-nodeRadius - 10} // Position arrow above the node
                textAnchor="middle"
                className="text-white text-xl"
                initial={{ opacity: 1, y: -nodeRadius - 10 }}
                animate={{ opacity: 1, y: -nodeRadius - 20 }} // Slight bounce for arrow
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                &#x2193;
              </motion.text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
});

const VisualizationArea = ({ data, output, animations, currentStep, algorithmType, speed, algorithm }) => {
  const renderArrayVisualization = () => {
    return (
      <ArrayVisualizationComponent
        data={data}
        output={output}
        animations={animations}
        currentStep={currentStep}
        algorithmType={algorithmType}
        speed={speed}
        algorithm={algorithm}
      />
    );
  };

  const renderGraphVisualization = () => {
    return (
      <GraphVisualizationComponent
        data={data}
        output={output}
        animations={animations}
        currentStep={currentStep}
        algorithmType={algorithmType}
        speed={speed}
        algorithm={algorithm}
      />
    );
  };

  // const renderMergeSortVisualization = () => {
  //   return (
  //     <MergeSortVisualizationComponent
  //       array={data}
  //       speed={speed}
  //     />
  //   );
  // };

  return (
    <div className="flex-col bg-gray-900 p-4 rounded-lg shadow-md ">
      <h2 className="text-2xl font-semibold mb-4 bg-gradient-text text-transparent bg-clip-text">Visualization Area</h2>
      <div className="mb-4 w-full h-auto">
        { (
          <RenderVisualization
            data={data}
            output={output}
            animations={animations}
            currentStep={currentStep}
            algorithmType={algorithmType}
            speed={speed}
            algorithm={algorithm}
            renderGraphVisualization={renderGraphVisualization}
            renderArrayVisualization={renderArrayVisualization}
          />
        )}
      </div>
      <div className="bg-gray-800 p-3 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Algorithm Output:</h3>
        <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

export default VisualizationArea;
