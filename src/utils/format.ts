export const formatVND = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export const percentFormat = (value: number, total: number): string => {
    if (total === 0) return '0%';
    const percent = (value / total) * 100;
    return `${percent.toFixed(2)}%`;
}