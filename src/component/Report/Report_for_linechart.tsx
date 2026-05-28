import { formatVND } from "../../utils/format";

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
            <p className="text-center text-gray-500">Không có dữ liệu</p>
        ) : (
            <div className="space-y-2">
                {map_with_date.map((item) => {
                    return (
                        <div key={item.date} className={`flex items-center border-b-2 border-gray-400/40 rounded-lg transition pr-2`}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 flex items-center justify-center">
                                    {item.date}
                                </div>
                            </div>
                            <div className="flex ml-auto max-w-50 w-full">
                                <div className="flex-1 text-right text-green-600">+ {formatVND(item.income)}đ
                                </div>
                                <div className="flex-1 text-right text-red-600">- {formatVND(item.expense)}đ
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        )
    )
}