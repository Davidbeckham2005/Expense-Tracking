type chartDate = 'pie' | 'line' | 'bar';
import { PieChart, ChartColumn, ChartSpline } from 'lucide-react'
import { Button } from "@/components/ui/button"

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
        <div className="gap-3 justify-center flex flex-wrap md:flex-col md:w-16">
            {charts.map((item) => {
                const Icon = item.icon;
                const active = chartType === item.type;

                return (
                    <Button
                        key={item.type}
                        variant={active ? "default" : "outline"}
                        onClick={() => setChartType(item.type)}
                        className="min-w-24 md:min-w-16"
                    >
                        <Icon size={16} />
                        <span>
                            {item.label}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
}
