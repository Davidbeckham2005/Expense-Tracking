import type { IconName, TColor } from "../../types/ICategories"
import type { ICategory } from "../../types/ICategories";
import type { TTransactionType } from "../../types/Transactions";
import { formatVND, percentFormat } from "../../utils/format";
import { icons } from "../../constants/icon";
import { colors } from "../../constants/color";


interface ReportForPieChartProps {
    map_with_category: {
        category: ICategory;
        value: number;
    }[];
    currentType: TTransactionType;
    totalIncome: number;
    totalExpense: number;
}
export default function ReportForPieChart({ map_with_category,currentType,totalExpense,totalIncome }: ReportForPieChartProps) {

    return (
        map_with_category.length === 0 ? (
            <p className="text-center text-gray-500">Không có dữ liệu</p>
        ) : (
            <div className="space-y-2">
                {map_with_category.map((item) => {
                    const Icon = icons[item.category.icon as IconName];
                    return (
                        <div key={item.category.id} className={`flex items-center border-b-2 border-gray-400/40 rounded-lg transition pr-2`}>
                            <div className="flex items-center justify-between gap-3">
                                <div
                                    className="w-10 h-10 flex items-center justify-center rounded-full"
                                >
                                    {Icon && <Icon className="w-5 h-5 text-white" style={{ color: colors[item.category.color as TColor] || "#E5E7EB" }} />}
                                </div>
                                <h3 className="font-medium text-state-700">{item.category.name}</h3>
                            </div>

                            <div className="flex items-center gap-4 ml-auto">
                                <div className="text-stone-900 hover:text-gray-700"> {formatVND(item.value)}đ
                                </div>
                                <div className="text-stone-500 hover:text-gray-700"> {percentFormat((item.value), currentType === 'income' ? totalIncome : totalExpense)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        )
    )
}
