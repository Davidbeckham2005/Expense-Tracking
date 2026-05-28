import {
    Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart,
} from "recharts";
import { formatChartValue } from "../../utils/format";
interface LineChartProps {
    dailyData: { date: string, income: number, expense: number }[];

}

export default function LineChartComponent({ dailyData }: LineChartProps) {
    const sortedData = [...dailyData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (

        <BarChart data={sortedData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis
                width={80}
                tickFormatter={formatChartValue}
            />

            <Tooltip
                formatter={(value, name) => [
                    formatChartValue(Number(value)),
                    name
                ]}
                contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            />

            <Legend />

            {/* Income */}
            <Bar
                dataKey="income"
                name="Thu nhập"
                fill="#22C55E"
                radius={[8, 8, 0, 0]}
            />

            {/* Expense */}
            <Bar
                dataKey="expense"
                name="Chi tiêu"
                fill="#EF4444"
                radius={[8, 8, 0, 0]}
            />

        </BarChart>

    )
}