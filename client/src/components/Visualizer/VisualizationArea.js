import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import TreeVisualization from './TreeVisualization';
import RenderVisualization from './RenderVisualization';

const VisualizationArea = ({ data, output, animations, currentStep, algorithmType, speed, algorithm }) => {

  const renderArrayVisualization = () => {
    if (!data || data.length === 0) {
      return <p>No data to visualize. Please input data and run an algorithm.</p>;
    }

    const currentAnimation = animations && animations[currentStep];

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

    const svgRef = useRef(null);
    const [actualContainerWidth, setActualContainerWidth] = useState(0);

    useEffect(() => {
      if (svgRef.current) {
        setActualContainerWidth(svgRef.current.clientWidth);
      }
    }, [arrayToVisualize, speed]);

    let startY;

    if (algorithmType === 'Sorting' && algorithm === 'Insertion Sort') {
      startY = containerHeight - 2 * nodeRadius;
    }
    else {
      startY = containerHeight / 2
    }
    let cxPositions = [];

    if (numNodes > 0) {
      const totalNodesDiameter = numNodes * (2 * nodeRadius);
      const totalGapWidth = (numNodes - 1) * fixedGap;
      const totalOccupiedWidth = totalNodesDiameter + totalGapWidth;

      let currentStartX = (actualContainerWidth - totalOccupiedWidth) / 2;

      if (currentStartX < 0) {
        currentStartX = 0;
      }

      for (let i = 0; i < numNodes; i++) {
        cxPositions.push(currentStartX + nodeRadius + i * (2 * nodeRadius + fixedGap));
      }
    }

    return (
      <svg ref={svgRef} width="100%" height={containerHeight} className="bg-gray-700 p-2 rounded-md relative">
        {arrayToVisualize.map((item, index) => {
          if (item.isGap) return null; // Do not render gap placeholders

          const value = item.value;
          const id = item.id;
          let fillColor = 'fill-blue-500';

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
            } else {
              if (currentAnimation.type === 'compare') {
                if (currentAnimation.indices && currentAnimation.indices.includes(index)) {
                  fillColor = 'fill-yellow-500';
                } else if (currentAnimation.index === index) {
                  fillColor = 'fill-yellow-500';
                }
              } else if (currentAnimation.type === 'swap' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
                fillColor = 'fill-red-500';
              } else if (currentAnimation.type === 'shift' && currentAnimation.indices && currentAnimation.indices.includes(index)) {
                fillColor = 'fill-orange-500';
              } else if (currentAnimation.type === 'insert' && currentAnimation.index === index) {
                fillColor = 'fill-green-500';
              } else if (currentAnimation.type === 'merge' && currentAnimation.index === index) {
                fillColor = 'fill-purple-500';
              } else if (currentAnimation.type === 'process' && currentAnimation.index === index) {
                fillColor = 'fill-indigo-500';
              } else if (currentAnimation.type === 'found') {
                if (currentAnimation.indices && currentAnimation.indices.includes(index)) {
                  fillColor = 'fill-green-500';
                } else if (currentAnimation.index === index) {
                  fillColor = 'fill-green-500';
                }
              } else if (currentAnimation.type === 'window' && currentAnimation.indices && index >= currentAnimation.indices[0] && index <= currentAnimation.indices[1]) {
                fillColor = 'fill-teal-500';
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
              initial={{ x: cx }}
              animate={{ x: cx }}
              transition={{ duration: speed / 1000, ease: "linear" }}
            >
              <circle
                cx={0}
                cy={startY}
                r={nodeRadius}
                className={`${fillColor} stroke-white stroke-1`}
                style={{ transition: `fill 0.1s linear` }}
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
                  initial={{ opacity: 0, y: startY - nodeRadius - 10 }}
                  animate={{ opacity: 1, y: startY - nodeRadius - 10 }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
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
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: -20 }}
              transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeOut" }}
            >
              &#x2193; {/* Downward arrow character */}
            </motion.text>
          </motion.g>
        )}
      </svg>
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
    const radius = 150;
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
    const activeEdges = new Set();

    if (currentAnimation) {
      if (currentAnimation.type === 'visit' || currentAnimation.type === 'enqueue') {
        visitedNodes.add(currentAnimation.node);
      } else if (currentAnimation.type === 'explore') {
        activeEdges.add(`${currentAnimation.from}-${currentAnimation.to}`);
        activeEdges.add(`${currentAnimation.to}-${currentAnimation.from}`);
      } else if (currentAnimation.type === 'add_to_mst' || currentAnimation.type === 'process_edge') {
        activeEdges.add(`${currentAnimation.edge.from}-${currentAnimation.edge.to}`);
        activeEdges.add(`${currentAnimation.edge.to}-${currentAnimation.edge.from}`);
      }
    }

    return (
      <svg width="400" height="400" className="bg-gray-700 w-full rounded-md mx-auto">
        {nodesArray.map(node =>
          data[node] ? Object.entries(data[node]).map(([neighbor, weight]) => {
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
          const showArrow = currentAnimation && (
            (currentAnimation.type === 'visit' && currentAnimation.node === node) ||
            (currentAnimation.type === 'enqueue' && currentAnimation.node === node)
          );
          return (
            <motion.g
              key={node}
              initial={{ x: x, y: y }}
              animate={{ x: x, y: y }}
              transition={{ duration: speed / 1000, ease: "linear" }}
            >
              <circle cx={0} cy={0} r="15" className={`${fillColor} stroke-white stroke-1`} />
              <text x={0} y={5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-sm">{node}</text>
              {showArrow && (
                <motion.text
                  x={0}
                  y={-25}
                  textAnchor="middle"
                  className="text-white text-xl"
                  initial={{ opacity: 0, y: -35 }}
                  animate={{ opacity: 1, y: -25 }}
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
  };
  <TreeVisualization
    data={data}
    output={output}
    animations={animations}
    currentStep={currentStep}
    algorithmType={algorithmType}
    speed={speed}
    algorithm={algorithm}
  />


  return (
    <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 bg-gradient-text text-transparent bg-clip-text">Visualization Area</h2>
      <div className="mb-4">
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


      </div>
      <div className="bg-gray-800 p-3 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Algorithm Output:</h3>
        <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

export default VisualizationArea;
