import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
interface LineChartProps {
    dailyData: { date: string, income: number, expense: number }[];

}

export default function LineChartComponent({ dailyData }: LineChartProps) {
    const sortedData = [...dailyData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (

        <LineChart data={sortedData} className="p-2">
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
                type="monotone"
                dataKey="income"
                stroke="#22C55E"
                strokeWidth={3}
            />

            <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={3}
            />
        </LineChart>

    )
}