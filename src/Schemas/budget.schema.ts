import { z } from 'zod';
export const budgetSchema = z.object({
    name: z
        .string()
        .min(1, 'Tên không được để trống')
        .max(50, 'Tên quá dài'),
    limit_amount: z
        .number()
        .min(1, 'Số tiền phải lớn hơn 0')
        .positive(),
    period: z.enum(['weekly', 'monthly', 'yearly', 'daily']),
    categories: z.array(z.string())
        .min(1, 'Chọn ít nhất 1 category'),
    description: z
        .string()
        .optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Ngày không hợp lệ',
    }),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Ngày không hợp lệ',
    }),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;