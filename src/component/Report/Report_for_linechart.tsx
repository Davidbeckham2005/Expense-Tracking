import { formatVND } from "../../utils/format";
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"

interface ReportForLineChartProps {
    map_with_date: {
        date: string;
        income: number;
        expense: number;
    }[];
}

export default function ReportForLineChart({ map_with_date }: ReportForLineChartProps) {
    return (
        map_with_date.length === 0 ? (
            <p className="text-center text-muted-foreground">Không có dữ liệu</p>
        ) : (
            <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
                {map_with_date.map((item) => {
                    return (
                        <motion.div
                            key={item.date}
                            variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                        >
                            <Card className="flex items-center px-3 py-2.5">
                                <div className="flex items-center justify-between gap-3 flex-1">
                                    <div className="flex-1 flex items-center justify-start text-card-foreground font-medium">
                                        {item.date}
                                    </div>
                                </div>
                                <div className="flex ml-auto max-w-50 w-full">
                                    <div className="flex-1 text-right text-green-600">+ {formatVND(item.income)}đ
                                    </div>
                                    <div className="flex-1 text-right text-red-600">- {formatVND(item.expense)}đ
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

        )
    )
}
