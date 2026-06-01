
import TransactionForm from './Transaction_Form';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { formatVND } from '../../utils/format';
import type { IconName, TColor } from '../../types/ICategories';
import { icons } from '../../constants/icon';
import {colors} from '../../constants/color';
import { motion } from "motion/react"

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 }
};

export default function ExpenseManager() {
    const { transactions } = useTransactionStore();
    const { categories } = useCategoryStore();
    return (
        <div>
            <TransactionForm mode="create" />
            <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-white/40 bg-white/15 backdrop-blur-lg p-4 shadow-lg">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Chi tiêu gần đây</h3>
                        <p className="text-xs text-slate-500">Nhìn nhanh các khoản vừa thêm để nhập liệu nhanh hơn.</p>
                    </div>
                </div>
                {transactions.length === 0 ? (
                    <p className="text-sm text-slate-500">Chưa có chi tiêu nào.</p>
                ) : (
                    <motion.div
                        className="space-y-2"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                    >
                        {transactions.map((item) => {
                            const category = categories.find((cat) => cat.id === item.category_id);
                            const Icon = category ? icons[category.icon as IconName] : null;

                            return (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-3 py-2.5"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30">
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
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    )
}