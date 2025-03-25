// Parsing function for flexible time input
export function parseTime(input: string): Date | null {
    // Trim and remove any whitespace
    input = input.trim();

    // Try parsing as ISO 8601
    let parsedDate = new Date(input);
    if (!isNaN(parsedDate.getTime())) return parsedDate;

    // Try parsing as epoch seconds
    if (/^\d+$/.test(input)) {
        const num = Number(input);
        if (input.length === 10) return new Date(num * 1000); // seconds
        if (input.length === 13) return new Date(num); // milliseconds
        if (input.length === 16) return new Date(num / 1000); // nanoseconds
    }

    // If no parsing succeeded
    return null;
}
