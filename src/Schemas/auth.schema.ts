import * as z from "zod";

export const registerSchema = z
    .object({
        // 1. Validate Họ và Tên
        name: z
            .string()
            .min(1, "Họ và tên không được để trống")
            .min(2, "Họ và tên phải có ít nhất 2 ký tự")
            .max(50, "Họ và tên không được vượt quá 50 ký tự"),

        // 2. Validate Email
        email: z
            .string()
            .min(1, "Email không được để trống")
            .email("Định dạng email không hợp lệ (Ví dụ: name@domain.com)"),

        // 3. Validate Mật khẩu (Có thể siết chặt độ bảo mật cho app tiền bạc)
        password: z
            .string()
            .min(1, "Mật khẩu không được để trống")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .max(30, "Mật khẩu không được vượt quá 30 ký tự")
            // Tùy chọn: Thêm regex nếu muốn bắt buộc có chữ hoa, chữ thường và số
            .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa")
            .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường")
            .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),

        // 4. Khai báo trường xác nhận mật khẩu (Tạm thời nhận vào chuỗi string)
        confirmPassword: z
            .string()
            .min(1, "Vui lòng nhập lại mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không trùng khớp",
        path: ["confirmPassword"], // Gắn thông báo lỗi này trực tiếp vào ô 'confirmPassword'
    });

// Ép kiểu (Inference) từ Schema sang Type của TypeScript để tái sử dụng
export type RegisterInput = z.infer<typeof registerSchema>;