import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
const dailyData = [
    {
        date: "01",
        income: 500000,
        expense: 200000
    },
    {
        date: "02",
        income: 300000,
        expense: 450000
    }
];
export default function LineChartComponent() {
    return (
        <div className="w-full h-[400px] bg-white rounded-2xl p-4 shadow">
            <h2 className="text-xl font-bold mb-4">
                Xu hướng thu chi
            </h2>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
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
            </ResponsiveContainer>
        </div>
    )
}