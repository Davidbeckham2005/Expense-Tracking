export const formatVND = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};