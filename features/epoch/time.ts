const GMT = 'GMT';
const UTC = 'UTC';
const definedTimezones = [GMT, UTC];

// Parsing function for flexible time input
export function parseTime(input: string): Date | null {
    // Trim and remove any whitespace
    input = input.trim();

    // BUG: might need to find a better way to parse the input Date. Does not accept 27/04/2025, 12:10:49
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

export function convertToTimezone(
    parsedTime?: Date,
    timeZone?: string
): string {
    if (!parsedTime) return '';

    if (!timeZone) return 'Invalid timezone';

    if (
        !definedTimezones.includes(timeZone) &&
        (timeZone.startsWith(GMT) || timeZone.startsWith(UTC))
    ) {
        timeZone = processOffsetString(timeZone.substring(3).trim());
    }

    timeZone = processOffsetString(timeZone);

    try {
        // passing locale as undefined defaults to the user's browser locale
        return parsedTime.toLocaleString(undefined, {
            timeZone,
        });
    } catch (error) {
        return 'Invalid timezone';
    }
}

export function buildAllTimezones(): string[] {
    let ianaTimezones: string[] = [];
    try {
        ianaTimezones = Intl.supportedValuesOf('timeZone');
    } catch (error) {
        console.error('Error getting IANA timezones:', error);
    }

    const gmtOffsets = Array.from({ length: 24 })
        .map((_, i) => {
            const pos = i < 10 ? ` +0${i}` : ` +${i}`;
            const neg = i < 10 ? ` -0${i}` : ` -${i}`;
            return [GMT + pos, GMT + neg];
        })
        .flat();

    // FEAT: add short timezone abbreviations as well

    return ianaTimezones.concat(...gmtOffsets).sort();
}

function processOffsetString(offset: string): string {
    offset = offset.trim();
    const offsetSign = offset.charAt(0);
    // validate string has a valid sign
    if (offsetSign !== '+' && offsetSign !== '-') {
        return offset;
    }
    const offsetValue = offset.substring(1).trim();
    let hours = '';
    let mins = '';
    if (offsetValue.includes(':')) {
        const [h, m] = offsetValue.split(':');
        hours = h;
        mins = m;
    } else {
        hours = offsetValue;
    }
    // add a leading zero if hours is single digit
    if (hours.length === 1 || hours.length === 3) {
        hours = '0' + hours;
    }
    const processedValue = hours + mins;
    // ensure that processedValue is valid length
    if (processedValue.length !== 4 && processedValue.length !== 2) {
        return offset;
    }
    return offsetSign + processedValue;
}
