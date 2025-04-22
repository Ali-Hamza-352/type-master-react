
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export interface ProgressDataPoint {
  time: number;
  accuracy: number;
}

interface TimerChartProps {
  progress: number;
  progressData: ProgressDataPoint[];
}

export const TimerChart = ({ progress, progressData }: TimerChartProps) => {
  // Format time for display (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="h-48 mt-6">
        <h3 className="text-sm font-medium mb-2">Accuracy Over Time</h3>
        <ChartContainer
          config={{
            line: {
              theme: {
                light: "#3b82f6",
                dark: "#3b82f6",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTime} 
                label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }}
                minTickGap={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                type="number"
                domain={[0, 100]} 
                allowDecimals={false}
                label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Accuracy']}
                labelFormatter={(label) => `Time: ${formatTime(label)}`}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3b82f6" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
