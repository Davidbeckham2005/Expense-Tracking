type chartDate = 'pie' | 'line' | 'bar';
import { PieChart, ChartColumn, ChartSpline } from 'lucide-react'

interface ChartSwitcherProps {
    chartType: chartDate;
    setChartType: React.Dispatch<React.SetStateAction<chartDate>>;
}

export default function ChartSwitcher({ chartType, setChartType }: ChartSwitcherProps) {

    const charts = [
        {
            type: 'pie' as const,
            label: 'Tròn',
            icon: PieChart
        },
        {
            type: 'line' as const,
            label: 'Đường',
            icon: ChartSpline
        },
        {
            type: 'bar' as const,
            label: 'Cột',
            icon: ChartColumn
        }
    ];

    return (
        <div className="space-y-3 md:w-15 gap-2 justify-center flex flex-wrap md:flex-col">
            {charts.map((item) => {
                const Icon = item.icon;
                const active = chartType === item.type;

                return (
                    <button
                        key={item.type}
                        onClick={() => setChartType(item.type)}
                        className={`min-w-24 h-9 md:min-w-16 items-center flex gap-2 px-3 border border-gray-200 py-1 rounded-xl transition-all duration-300 font-medium text-sm
                            ${active ? 'bg-theme text-white shadow-lg md:scale-105' : 'bg-white text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}>
                        <Icon size={16} />
                        <span className="">
                            {item.label}
                        </span>

                    </button>
                );
            })}
        </div>
    );
}