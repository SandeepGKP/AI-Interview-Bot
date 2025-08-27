import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import TreeVisualization from "./TreeVisualization";
import RenderVisualization from "./RenderVisualization";

// ✅ Make this a real component (capitalized)
const ArrayVisualization = ({ data, animations, currentStep, algorithmType, speed, algorithm }) => {
  if (!data || data.length === 0) {
    return <p>No data to visualize. Please input data and run an algorithm.</p>;
  }

  const currentAnimation = animations && animations[currentStep];
  let arrayToVisualize = data;
  let movingElement = null;
  let emptyIndex = -1;

  if (
    currentAnimation &&
    currentAnimation.array &&
    (algorithmType === "Sorting" || algorithmType === "Array" || algorithmType === "Searching")
  ) {
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

  let startY = algorithmType === "Sorting" && algorithm === "Insertion Sort"
    ? containerHeight - 2 * nodeRadius
    : containerHeight / 2;

  let cxPositions = [];
  if (numNodes > 0) {
    const totalNodesDiameter = numNodes * (2 * nodeRadius);
    const totalGapWidth = (numNodes - 1) * fixedGap;
    const totalOccupiedWidth = totalNodesDiameter + totalGapWidth;

    let currentStartX = (actualContainerWidth - totalOccupiedWidth) / 2;
    if (currentStartX < 0) currentStartX = 0;

    for (let i = 0; i < numNodes; i++) {
      cxPositions.push(currentStartX + nodeRadius + i * (2 * nodeRadius + fixedGap));
    }
  }

  return (
    <svg ref={svgRef} width="100%" height={containerHeight} className="bg-gray-700 p-2 rounded-md relative">
      {arrayToVisualize.map((item, index) => {
        if (item.isGap) return null;

        // ... keep your circle rendering logic here ...
      })}

      {movingElement && (
        <motion.g
          key={movingElement.id}
          initial={{ x: cxPositions[movingElement.originalIndex], y: startY }}
          animate={{ x: cxPositions[emptyIndex], y: startY - nodeRadius - 30 }}
          transition={{ duration: speed / 1000, ease: "linear" }}
        >
          <circle cx={0} cy={0} r={nodeRadius} className="fill-purple-500 stroke-white stroke-1" />
          <text x={0} y={5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-sm">
            {movingElement.value}
          </text>
        </motion.g>
      )}
    </svg>
  );
};

// ✅ Main component
const VisualizationArea = ({ data, output, animations, currentStep, algorithmType, speed, algorithm }) => {
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
          renderArrayVisualization={() => (
            <ArrayVisualization
              data={data}
              animations={animations}
              currentStep={currentStep}
              algorithmType={algorithmType}
              speed={speed}
              algorithm={algorithm}
            />
          )}
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




