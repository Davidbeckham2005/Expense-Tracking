import type { IconName, TColor } from "../../types/ICategories"
import type { ICategory } from "../../types/ICategories";
import type { TTransactionType } from "../../types/Transactions";
import { formatVND, percentFormat } from "../../utils/format";
import { icons } from "../../constants/icon";
import { colors } from "../../constants/color";
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"


interface ReportForPieChartProps {
    map_with_category: {
        category: ICategory;
        value: number;
    }[];
    currentType: TTransactionType;
    totalIncome: number;
    totalExpense: number;
}
export default function ReportForPieChart({ map_with_category, currentType, totalExpense, totalIncome }: ReportForPieChartProps) {

    return (
        map_with_category.length === 0 ? (
            <p className="text-center text-muted-foreground">Không có dữ liệu</p>
        ) : (
            <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
                {map_with_category.map((item) => {
                    const Icon = icons[item.category.icon as IconName];
                    const percent = percentFormat((item.value), currentType === 'income' ? totalIncome : totalExpense)
                    return (
                        <motion.div
                            key={item.category.id}
                            variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                        >
                            <Card className="flex items-center px-3 py-2.5">
                                <div className="flex items-center justify-between gap-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                                            {Icon && <Icon className="w-5 h-5" style={{ color: colors[item.category.color as TColor] || "#E5E7EB" }} />}
                                        </div>
                                        <h3 className="font-medium text-card-foreground">{item.category.name}</h3>
                                    </div>

                                    <div className="flex ml-auto max-w-44 w-full">
                                        <div className="flex-1 text-right text-card-foreground text-nowrap"> {formatVND(item.value)}đ
                                        </div>
                                        <div className="flex-1 text-right text-muted-foreground text-nowrap">
                                            {percent}
                                        </div>
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
