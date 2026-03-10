"use client";

import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts";

const data = [
  { subject: "Sun (Core)", A: 120, fullMark: 150 },
  { subject: "Moon (React)", A: 98, fullMark: 150 },
  { subject: "Asc (Mask)", A: 86, fullMark: 150 },
  { subject: "MC (Apex)", A: 99, fullMark: 150 },
  { subject: "Node (Path)", A: 85, fullMark: 150 },
  { subject: "Vx (Fate)", A: 65, fullMark: 150 },
];

export function HexagonalRadarChart() {
  return (
    <div className="w-[350px] h-[350px] relative">
      {/* Background glowing polygon overlay for Cyber-Mystic effect */}
      <div className="absolute inset-0 z-0 bg-neon-magenta/5 blur-3xl rounded-full" />
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(0, 240, 255, 0.2)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#00f0ff", fontSize: 10, fontFamily: "monospace", textAnchor: "middle" }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="Natal Layer"
            dataKey="A"
            stroke="#ff0055"
            strokeWidth={2}
            fill="#ff0055"
            fillOpacity={0.4}
            isAnimationActive={true}
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
