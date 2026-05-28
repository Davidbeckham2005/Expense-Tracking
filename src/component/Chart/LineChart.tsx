import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { formatChartValue } from "../../utils/format";
interface LineChartProps {
    dailyData: { date: string, income: number, expense: number }[];

}

export default function LineChartComponent({ dailyData }: LineChartProps) {
    const sortedData = [...dailyData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (

        <LineChart data={sortedData} className="p-2 ">
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis
                width={80}
                tickFormatter={(value) => {
                    if (value >= 1_000_000) {
                        return `${value / 1_000_000}M`;
                    }

                    if (value >= 1_000) {
                        return `${value / 1_000}K`;
                    }

                    return value;
                }}
            />

            <Tooltip formatter={(value, name) => [
                formatChartValue(Number(value)),
                name
            ]} />

            <Legend />

            <Line
                type="monotone"
                dataKey="income"
                stroke="#22C55E"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                name="Thu nhập"
            />

            {/* Expense */}
            <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                name="Chi tiêu"
            />
        </LineChart>

    )
}