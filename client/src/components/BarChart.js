import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "A", value: 50 },
  { name: "B", value: 19 },
  { name: "C", value: 15 },
  { name: "D", value: 30 },
  { name: "E", value: 50 },
  { name: "D", value: 10},
  { name: "E", value: 50 },
];

const GradientBarCard = () => {
  return (
    <div className="bg-opacity-50 p-2 rounded-lg flex items-center space-x-3 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
      {/* Left pulse dot */}
      {/* <div className="w-4 h-4 rounded-full bg-pink-400 animate-pulse"></div> */}

      {/* Small gradient bar chart */}
      <div className="w-60 h-20"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgb(30, 30, 30)" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF69B4" /> {/* Pink for extra sparkle */}
              </linearGradient>
              <filter id="sparkle" x="-50%" y="-50%" width="200%" height="200%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="turbulence">
                  <animate attributeName="baseFrequency" values="0.05;0.1;0.05" dur="3s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="5" result="displace" />
                <feGaussianBlur in="displace" stdDeviation="2" result="blur">
                  <animate attributeName="stdDeviation" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
                </feGaussianBlur>
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <style>
              {`
                @keyframes twinkle {
                  0% { stroke-opacity: 0.6; }
                  20% { stroke-opacity: 1; }
                  40% { stroke-opacity: 0.4; }
                  60% { stroke-opacity: 1; }
                  80% { stroke-opacity: 0.5; }
                  100% { stroke-opacity: 0.6; }
                }
                .sparkle-border {
                  animation: twinkle 1.2s ease-in-out infinite;
                }
              `}
            </style>
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[4, 4, 1, 1]}
              stroke="url(#strokeGradient)"
              strokeWidth={2}
              className="sparkle-border"
              filter="url(#sparkle)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradientBarCard;


