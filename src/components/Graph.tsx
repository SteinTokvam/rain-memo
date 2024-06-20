import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CustomToolTip from "./CustomToolTip";

export default function Graph({
  data,
}: {
  data: { key: number; date: Date; amount: number }[];
}) {
  return (
    <>
      {data.length > 1 && (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                content={
                  // @ts-ignore
                  <CustomToolTip />
                }
              />
              <Line
                activeDot={{ r: 8 }}
                dataKey="amount"
                dot={{ r: 0 }}
                stroke="#67a1d4"
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
