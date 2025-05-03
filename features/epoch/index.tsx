import { Divider, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TimeInputField from './components/TimeInputField';
import TimezoneRow, {
    TimezoneRowData,
    TimezoneRowVariant,
} from './components/TimezoneRow';

export default function EpochConverter(): JSX.Element {
    const [parsedTime, setParsedTime] = useState<Date | undefined>(undefined);
    const [timezoneRows, setTimezoneRows] = useState<TimezoneRowData[]>([]);

    useEffect(() => {
        // Initial timezone row
        setTimezoneRows([
            {
                label: 'Local',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            {
                label: 'UTC',
                timezone: 'UTC',
            },
        ]);
    }, []);

    const appendTimezoneRow = (timezoneData: TimezoneRowData) => {
        setTimezoneRows((prev) => [...prev, timezoneData]);
    };

    const removeTimezoneRow = (id: number) => {
        if (timezoneRows.length > 1) {
            setTimezoneRows((prev) => {
                prev.splice(id, 1);
                return prev;
            });
        }
    };

    const updateTimezone = (id: number, newData: TimezoneRowData) => {
        setTimezoneRows((prev) => {
            prev[id] = { ...prev[id], ...newData };
            return [...prev];
        });
    };

    return (
        <Stack direction={'column'} gap={4}>
            <TimeInputField setTimeInput={setParsedTime} />

            <Divider />

            {timezoneRows.map((row, index) => {
                return (
                    <TimezoneRow
                        key={index}
                        index={index}
                        timezoneRowData={row}
                        updateTimezone={(newData) =>
                            updateTimezone(index, newData)
                        }
                        inputTime={parsedTime}
                        // TODO: variant based on config
                        variant={TimezoneRowVariant.CONCISE}
                    />
                );
            })}

            {/* FEAT: hide this behind a add row button */}
            <TimezoneRow
                key={timezoneRows.length}
                index={timezoneRows.length}
                timezoneRowData={{ label: '', timezone: '' }}
                variant={TimezoneRowVariant.CONCISE}
                updateTimezone={(data) => appendTimezoneRow(data)}
            />
            {/* <TimezoneCombobox inputValue="GMT +08" onChange={() => {}} /> */}
        </Stack>
    );
}
