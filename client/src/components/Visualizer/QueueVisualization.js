import React from 'react';
import { motion } from 'framer-motion';

const QueueVisualization = React.memo(({ data, animations, currentStep, speed }) => {
  const queue = data || [];
  const nodeWidth = 80;
  const nodeHeight = 30;
  const queueY = 100; // Y position for the queue elements
  const startX = 50; // Starting X position for the first element

  const currentAnimation = animations && animations[currentStep];

  return (
    <svg  height="200" className="bg-gray-700 w-full rounded-md mx-auto">
      {/* Queue base line */}
      <line x1={startX - 10} y1={queueY + nodeHeight + 5} x2={startX + queue.length * nodeWidth + 10} y2={queueY + nodeHeight + 5} className="stroke-gray-500 stroke-2" />

      <line x1={startX - 10} y1={queueY + nodeHeight - 35} x2={startX + queue.length * nodeWidth + 10} y2={queueY + nodeHeight - 35} className="stroke-gray-500 stroke-2" />

      {/* "FRONT" and "REAR" labels */}
      {queue.length > 0 && (
        <>
          <text
            x={startX + nodeWidth / 2}
            y={queueY - 10}
            textAnchor="middle"
            className="text-yellow-300 text-sm font-bold"
          >
            FRONT
          </text>
          <text
            x={startX + (queue.length - 1) * nodeWidth + nodeWidth / 2}
            y={queueY + 55}
            textAnchor="middle"
            className="text-yellow-300 text-sm font-bold"
          >
            REAR
          </text>
        </>
      )}

      {queue.map((item, index) => {
        const xPosition = startX + index * nodeWidth;
        let fillColor = 'fill-blue-500';
        let opacity = 1;
        let initialX = startX + (queue.length) * nodeWidth; // Start from outside the queue for enqueue
        let animateX = xPosition;

        if (currentAnimation) {
          if (currentAnimation.type === 'enqueue' && currentAnimation.value.id === item.id) {
            fillColor = 'fill-green-500'; // New enqueued item
            initialX = startX + (queue.length) * nodeWidth; // Start from outside the queue
            animateX = xPosition;
          } else if (currentAnimation.type === 'dequeue' && currentAnimation.value.id === item.id) {
            fillColor = 'fill-red-500'; // Item being dequeued
            animateX = startX - nodeWidth * 2; // Animate out further to the left
            opacity = 0;
          } else if (currentAnimation.type === 'peek' && currentAnimation.value.id === item.id) {
            fillColor = 'fill-yellow-500'; // Item being peeked
          }
        }

        return (
          <motion.g
            key={item.id}
            initial={{ x: initialX, y: queueY, opacity: 1 }} // Start with full opacity
            animate={{ x: animateX, y: queueY, opacity: opacity }}
            transition={{ duration: speed / 1000, ease: "easeOut" }} // Use speed prop for duration
          >
            <rect
              x={0} // Relative to g's x
              y={0}
              width={nodeWidth}
              height={nodeHeight}
              className={`${fillColor} stroke-white stroke-1`}
              style={{ opacity: opacity }}
            />
            <text
              x={nodeWidth / 2}
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

export default QueueVisualization;
