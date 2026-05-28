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
            label: 'Pie',
            icon: PieChart
        },
        {
            type: 'line' as const,
            label: 'Line',
            icon: ChartSpline
        },
        {
            type: 'bar' as const,
            label: 'Bar',
            icon: ChartColumn
        }
    ];

    return (
        <div className="items-center space-y-3 w-[60px]">
            {charts.map((item) => {
                const Icon = item.icon;
                const active = chartType === item.type;

                return (
                    <button
                        key={item.type}
                        onClick={() => setChartType(item.type)}
                        className={`flex items-center gap-2 px-2 py-1 rounded-xl transition-all duration-300 font-medium text-sm
                            ${active ? 'bg-theme text-white shadow-lg scale-105' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}>
                        <Icon className="w-4 h-fit" />
                        <span>{item.label}
                        </span>

                    </button>
                );
            })}
        </div>
    );
}