import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StackVisualization = React.memo(({ data, animations, currentStep, speed }) => {
  const {t}=useTranslation();
  const stack = data || [];
  const nodeHeight = 20;
  const nodeWidth = 100;
  const stackBaseY = 300; // Y position for the bottom of the stack
  const stackX = 250; // X position for the stack

  const currentAnimation = animations && animations[currentStep];

  return (
    <svg width="500" height="400" className="bg-gray-700 rounded-md mx-auto overflow-y-scroll"> {/* Increased height */}
      {/* Stack base */}
      <rect x={stackX - nodeWidth / 2} y={stackBaseY + 50} width={nodeWidth} height="5" className="fill-gray-500" />
      {/* <rect x={stackX - nodeWidth / 2} y={stackBaseY - nodeHeight * (stack.length + 1) + 50 +10} width={nodeWidth} height="5" className="fill-gray-500" /> Top line */}
      <rect x={stackX - nodeWidth / 2 -8} y={stackBaseY - nodeHeight * (stack.length + 1) + 50} width="5" height={nodeHeight * (stack.length + 1) + 5} className="fill-gray-500" /> {/* Left line */}
      <rect x={stackX + nodeWidth / 2 +3} y={stackBaseY - nodeHeight * (stack.length + 1) + 50} width="5" height={nodeHeight * (stack.length + 1) + 5} className="fill-gray-500" /> {/* Right line */}

      {/* "TOP" label */}
      {stack.length > 0 && (
        <text
          x={stackX + nodeWidth / 2 + 10}
          y={stackBaseY - stack.length * nodeHeight + nodeHeight / 2 + 50}
          textAnchor="start"
          className="text-yellow-300 text-sm font-bold"
        >
          {t('top')}
        </text>
      )}

      {stack.map((item, index) => {
        const yPosition = stackBaseY - (index + 1) * nodeHeight + 50;
        let fillColor = 'fill-blue-500';
        let opacity = 1;
        let initialY = stackBaseY + 50; // Start from below the base for push
        let animateY = yPosition;

        if (currentAnimation) {
          if (currentAnimation.type === 'push' && currentAnimation.value.id === item.id) {
            fillColor = 'fill-green-500'; // New pushed item
            initialY = stackBaseY + nodeHeight + 100; // Start from outside the stack
            animateY = yPosition;
          } else if (currentAnimation.type === 'pop' && currentAnimation.value.id === item.id) {
            fillColor = 'fill-red-500'; // Item being popped
            animateY = -nodeHeight * 2; // Animate out further upwards
            opacity = 0;
          } else if (currentAnimation.type === 'peek' && currentAnimation.value.id === item.id) {
            fillColor = 'fill-yellow-500'; // Item being peeked
          }
        }

        return (
          <motion.g
            key={item.id}
            initial={{ y: 0, opacity: 1 }} // Start with full opacity
            animate={{ y: animateY, opacity: 1 }}
            transition={{ duration: speed / 1000, ease: "easeOut" }} // Use speed prop for duration
          >
            <rect
              x={stackX - nodeWidth / 2}
              y={0} // Relative to g's y
              width={nodeWidth}
              height={nodeHeight}
              className={`${fillColor} stroke-white stroke-1 mb-1`}
              style={{ opacity: 1 }}
            />
            <text
              x={stackX}
              y={nodeHeight / 2 + 5} // Center text vertically
              textAnchor="middle"
              className="text-white text-sm"
            >
              {item.value}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
});

export default StackVisualization;
