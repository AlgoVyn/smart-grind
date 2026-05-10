// --- DATE UTILITIES ---
// Pure date helpers with no application dependencies.
// Safe to import from any module.

export const getToday = (): string => new Date().toISOString().split('T')[0]!;

export const addDays = (date: string, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0]!;
};

export const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
