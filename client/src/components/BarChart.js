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
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[4, 4, 1, 1]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradientBarCard;
