import {
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import CustomToolTip from "./CustomToolTip";
import CustomDot from "./CustomDot";

export default function Graph({
    data
}: {
    data: { key: string; date: string; amount: number, event_text?: string }[];
}) {

    return (
        <>
            {data.length > 1 && (
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <ComposedChart
                            width={500}
                            height={400}
                            data={data}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
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
                                dot={<CustomDot />}
                                stroke="#67a1d4"
                                type="monotone"
                            />
                            
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </>
    );
}
