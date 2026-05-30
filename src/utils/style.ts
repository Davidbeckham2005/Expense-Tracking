export function getProgressColor(persent: number): string {
    if (persent >= 100) return 'bg-red-500';
    if (persent >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
}
export function getColor(percent: number): string {
    if (percent >= 100) return 'text-red-500';
    if (percent >= 80) return 'text-yellow-500';
    return 'text-green-500';
}