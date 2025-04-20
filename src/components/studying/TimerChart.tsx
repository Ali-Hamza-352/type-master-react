
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = Array.from({ length: 10 }, (_, i) => ({
  name: (i + 1).toString(),
  value: Math.floor(Math.random() * 100)
}));

interface TimerChartProps {
  progress: number;
}

export const TimerChart = ({ progress }: TimerChartProps) => {
  return (
    <div className="h-48">
      <ChartContainer
        config={{
          bar: {
            theme: {
              light: "#0ea5e9",
              dark: "#0ea5e9",
            },
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="value" fill="var(--color-bar)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
