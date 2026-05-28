export const formatVND = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};
export const percent = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
};
export const percentFormat = (value: number, total: number): string => {
    return `${percent(value, total).toFixed(2)}%`;
}

export const formatChartValue = (value: number) => {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(0)}K`;
    }

    return value.toString();
};