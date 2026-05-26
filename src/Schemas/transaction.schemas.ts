import * as z from "zod";

export const transactionSchema = z.object({
    amount: z.number()
        .min(1, "Số tiền không được để trống")
        .positive(),
    transaction_date: z.string().min(1, "Ngày giao dịch không được để trống"),
    type: z.enum(["income", "expense"]),
    category_id: z.string().min(1, "Danh mục không được để trống"),
    note: z.string().optional(),
});

export type TransactionInput =
    z.infer<typeof transactionSchema>;