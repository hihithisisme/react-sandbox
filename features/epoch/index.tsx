import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { parseTime } from './time';

interface TimezoneRow {
    id: number;
    timezone: string;
    convertedTime: string;
}

export default function EpochConverter() {
    const [timeInput, setTimeInput] = useState('');
    const [utcTime, setUtcTime] = useState('');
    const [localTime, setLocalTime] = useState('');
    const [timezoneRows, setTimezoneRows] = useState<TimezoneRow[]>([]);
    const [timezones, setTimezones] = useState<string[]>([]);

    // Populate timezones on component mount
    useEffect(() => {
        // TODO: Somehow this is showing up as an error, but it works
        const supportedTimezones = Intl.supportedValuesOf('timeZone');
        setTimezones(supportedTimezones);

        // Initial timezone row
        setTimezoneRows([
            {
                id: 0,
                timezone: '',
                convertedTime: '',
            },
        ]);
    }, []);

    // Convert time whenever input changes
    useEffect(() => {
        const parsedTime = parseTime(timeInput);

        if (parsedTime) {
            // Set UTC and local times
            setUtcTime(parsedTime.toUTCString());
            setLocalTime(parsedTime.toString());

            // Convert for additional timezones
            const updatedRows = timezoneRows.map((row) => {
                if (row.timezone) {
                    try {
                        return {
                            ...row,
                            convertedTime: parsedTime.toLocaleString('en-US', {
                                timeZone: row.timezone,
                            }),
                        };
                    } catch (error) {
                        return {
                            ...row,
                            convertedTime: 'Invalid Timezone',
                        };
                    }
                }
                return row;
            });

            setTimezoneRows(updatedRows);
        } else {
            // Reset times if parsing fails
            setUtcTime('Invalid Time Format');
            setLocalTime('Invalid Time Format');

            const resetRows = timezoneRows.map((row) => ({
                ...row,
                convertedTime: '',
            }));
            setTimezoneRows(resetRows);
        }
    }, [timeInput, timezoneRows.length]);

    // Add a new timezone row
    const addTimezoneRow = () => {
        setTimezoneRows((prev) => [
            ...prev,
            {
                id: prev.length,
                timezone: '',
                convertedTime: '',
            },
        ]);
    };

    // Remove a timezone row
    const removeTimezoneRow = (id: number) => {
        if (timezoneRows.length > 1) {
            setTimezoneRows((prev) => prev.filter((row) => row.id !== id));
        }
    };

    // Update timezone for a specific row
    const updateTimezone = (id: number, timezone: string) => {
        setTimezoneRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, timezone } : row))
        );
    };

    return (
        <div className={styles.timezoneConverter}>
            <div className={styles.timezoneConverterContainer}>
                <h1>Timezone Converter</h1>

                <div className={styles.timezoneConverterRow}>
                    <input
                        type="text"
                        placeholder="Enter time (ISO, epoch)"
                        value={timeInput}
                        onChange={(e) => setTimeInput(e.target.value)}
                    />
                </div>

                {timezoneRows.map((row) => (
                    <div key={row.id} className={styles.timezoneConverterRow}>
                        <select
                            value={row.timezone}
                            onChange={(e) =>
                                updateTimezone(row.id, e.target.value)
                            }
                        >
                            <option value="">Select Timezone</option>
                            {timezones.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={row.convertedTime}
                            readOnly
                            placeholder="Converted Time"
                        />
                        <button
                            className={`${styles.timezoneConverterRowButton} ${styles.timezoneConverterRowButtonRemove}`}
                            onClick={() => removeTimezoneRow(row.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <div className={styles.timezoneConverterRow}>
                    <button
                        className={`${styles.timezoneConverterRowButton} ${styles.timezoneConverterRowButtonAdd}`}
                        onClick={addTimezoneRow}
                    >
                        Add Timezone
                    </button>
                </div>

                <div className={styles.timezoneConverterRow}>
                    <label>UTC Time: </label>
                    <input type="text" value={utcTime} readOnly />
                </div>

                <div className={styles.timezoneConverterRow}>
                    <label>Local Time: </label>
                    <input type="text" value={localTime} readOnly />
                </div>
            </div>
        </div>
    );
}
