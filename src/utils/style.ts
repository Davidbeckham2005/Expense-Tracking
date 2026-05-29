export function getProgressColor (persent: number): string {
    if(persent>=100) return 'bg-red-500';
    if(persent>=80) return 'bg-yellow-500';
    return 'bg-green-500';
}