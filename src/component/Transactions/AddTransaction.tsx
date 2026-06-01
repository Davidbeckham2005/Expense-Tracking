
import TransactionForm from './Transaction_Form';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { formatVND } from '../../utils/format';
import type { IconName, TColor } from '../../types/ICategories';
import { icons } from '../../constants/icon';
import {colors} from '../../constants/color';
export default function ExpenseManager() {
    const { transactions } = useTransactionStore();
    const { categories } = useCategoryStore();
    return (
        <div>
            <TransactionForm mode="create" />
            <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Chi tiêu gần đây</h3>
                        <p className="text-xs text-slate-500">Nhìn nhanh các khoản vừa thêm để nhập liệu nhanh hơn.</p>
                    </div>
                </div>
                {transactions.length === 0 ? (
                    <p className="text-sm text-slate-500">Chưa có chi tiêu nào.</p>
                ) : (
                    <div className="space-y-2">
                        {transactions.map((item) => {
                            const category = categories.find((cat) => cat.id === item.category_id);
                            const Icon = category ? icons[category.icon as IconName] : null;

                            return (
                                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                                            {Icon ? <Icon className="h-4 w-4" style={{ color: category ? colors[category.color as TColor] : undefined }} /> : null}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">{category?.name || 'Không xác định'}</p>
                                            <p className="truncate text-xs text-slate-500">{item.note || 'Không có ghi chú'} · {item.transaction_date.split('T')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-rose-600">
                                        - {formatVND(item.amount)}đ
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}