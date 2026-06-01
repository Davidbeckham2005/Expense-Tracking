type chartDate = 'pie' | 'line' | 'bar';
import { PieChart, ChartColumn, ChartSpline } from 'lucide-react'
import { motion } from "motion/react"

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
                    <motion.button
                        key={item.type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setChartType(item.type)}
                        className={`min-w-24 h-9 md:min-w-16 items-center flex gap-2 px-3 border py-1 rounded-xl transition-all duration-300 font-medium text-sm
                            ${active ? 'bg-theme text-white shadow-lg md:scale-105 border-theme/50' : 'bg-white/20 backdrop-blur-sm border-white/30 text-slate-600 hover:text-slate-800 hover:bg-white/30'}`}>
                        <Icon size={16} />
                        <span className="">
                            {item.label}
                        </span>

                    </motion.button>
                );
            })}
        </div>
    );
}