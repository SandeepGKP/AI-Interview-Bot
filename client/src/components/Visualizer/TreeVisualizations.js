import React ,{ useState ,useEffect,useRef, memo} from "react";

import { motion } from 'framer-motion';

const TreeVisualization = ({ data, output, animations, currentStep, algorithmType, speed, algorithm }) => {
  const treeSvgRef = useRef(null);
  const [treeContainerWidth, setTreeContainerWidth] = useState(0);

  useEffect(() => {
    if (treeSvgRef.current) {
      setTreeContainerWidth(treeSvgRef.current.clientWidth);
    }
  }, [data, speed]);

  if (!data || !data.value) {
    return <p className="bg-gradient-text text-transparent bg-clip-text">No tree data to visualize. Please input data in a specific format (e.g., {"{value: 1, left: {value: 2}, right: {value: 3}}"}).</p>;
  }

  const nodePositions = {};
  const nodeRadius = 15;
  const levelHeight = 80;
  const horizontalSpacing = 40;

  const layoutTree = (node, x, y, level, siblingOffset) => {
    if (!node) return null;

    const leftChildPos = layoutTree(node.left, x - siblingOffset, y + levelHeight, level + 1, siblingOffset / 2);
    const rightChildPos = layoutTree(node.right, x + siblingOffset, y + levelHeight, level + 1, siblingOffset / 2);

    nodePositions[node.value] = { x, y, level, nodeRef: node };

    return { x, y, nodeRef: node };
  };

  // Calculate initial centerX dynamically
  const initialCenterX = treeContainerWidth / 2;
  layoutTree(data, initialCenterX, 30, 0, 100);

  const currentAnimation = animations && animations[currentStep];
  const visitedNodes = new Set();
  const enqueuedNodes = new Set();

  if (currentAnimation) {
    // Ensure currentAnimation.node is a number when adding to sets
    const nodeToAnimate = Number(currentAnimation.node);
    if (currentAnimation.type === 'visit') {
      visitedNodes.add(nodeToAnimate);
    } else if (currentAnimation.type === 'enqueue') {
      enqueuedNodes.add(nodeToAnimate);
    }
  }

  return (
    <svg ref={treeSvgRef} width="100%" height="400" className="bg-gray-700 w-full rounded-md mx-auto mt-4">
      <motion.g>
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
      </motion.g>

      {Object.entries(nodePositions).map(([valueStr, { x, y }]) => {
        const value = Number(valueStr); // Convert string key to number for comparison
        let fillColor = 'fill-blue-500';
        if (visitedNodes.has(value)) {
          fillColor = 'fill-yellow-500';
        } else if (enqueuedNodes.has(value)) {
          fillColor = 'fill-purple-500';
        }
        const showArrow = currentAnimation && (
          (currentAnimation.type === 'visit' && Number(currentAnimation.node) === value) || // Ensure currentAnimation.node is number for comparison
          (currentAnimation.type === 'enqueue' && Number(currentAnimation.node) === value)   // Ensure currentAnimation.node is number for comparison
        );
        return (
          <motion.g
            key={value}
            initial={{ x: x, y: y }}
            animate={{ x: x, y: y }}
            transition={{ duration: speed / 1000, ease: "linear" }}
          >
            <circle cx={0} cy={0} r={nodeRadius} className={`${fillColor} stroke-white stroke-1 `} />
            <text x={0} y={5} textAnchor="middle" className="bg-gradient-text text-transparent bg-clip-text text-sm">{value}</text>
            {showArrow && (
              <motion.text
                x={0}
                y={10} // Base position at the center of the node
                textAnchor="middle"
                className="text-white text-xl"
                initial={{ opacity: 1, y: -25 }} // Start 25px above the node's center
                animate={{ opacity: 1, y: -35 }} // Animate to 5px below the node's center
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

export default TreeVisualization;
