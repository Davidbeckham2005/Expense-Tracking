import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatVND, percentFormat, formatChartValue } from "../../utils/format";
import { COLORS } from "../../constants/color";
import type { TTransactionType } from "../../types/Transactions";

interface PieChartProps {
    categoryChartData: { name: string; value: number }[];
    totalIncome: number;
    totalExpense: number;
    currentType: TTransactionType;
}

export default function PieChartComponent({ categoryChartData, totalIncome, totalExpense, currentType }: PieChartProps) {
    return (
        <PieChart key={currentType} >
            <Pie
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(entry) => `${entry.name}: ${percentFormat(entry.value, currentType === 'income' ? totalIncome : totalExpense)}`}
            >
                {categoryChartData.map((_, index) => (
                    <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>

            <Tooltip
                formatter={(value, name) => [formatChartValue(Number(value)), name]}
            />
            <Legend />
        </PieChart>
    )
}