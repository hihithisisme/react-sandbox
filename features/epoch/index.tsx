import {
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    useClipboard,
} from '@chakra-ui/react';
import { CheckSquare, Copy } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { parseTime } from './time';

interface TimezoneRowData {
    label: string;
    timezone: string;
    convertedTime?: string;
}

export default function EpochConverter() {
    const [timeInput, setTimeInput] = useState('');
    // TODO: initialize TimezoneRows with browser's localstorage or default to local + UTC
    // const [localTime, setLocalTime] = useState('');
    const [timezoneRows, setTimezoneRows] = useState<TimezoneRowData[]>([]);

    useEffect(() => {
        // TODO: Somehow this is showing up as an error, but it works
        // const supportedTimezones = Intl.supportedValuesOf('timeZone');

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

    // Convert time whenever input changes
    useEffect(() => {
        const parsedTime = parseTime(timeInput);

        if (parsedTime) {
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
                        console.log('Invalid Timezone', error);
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
            // TODO: Reset times if parsing fails. Or maybe let's not act on any difference?
        }
    }, [timeInput, timezoneRows.length]);

    // Add a new timezone row
    const addTimezoneRow = () => {
        setTimezoneRows((prev) => [
            ...prev,
            {
                order: prev.length,
                label: 'New Timezone',
                timezone: '',
            },
        ]);
    };

    // Remove a timezone row
    const removeTimezoneRow = (id: number) => {
        if (timezoneRows.length > 1) {
            setTimezoneRows((prev) => {
                prev.splice(id, 1);
                return prev;
            });
        }
    };

    // Update timezone for a specific row
    const updateTimezone = (id: number, newData: TimezoneRowData) => {
        setTimezoneRows((prev) => {
            prev[id] = { ...prev[id], ...newData };
            return prev;
        });
    };

    return (
        <Stack>
            <Stack direction={'column'} spacing={4}>
                <FormControl>
                    <FormLabel htmlFor="time-input">
                        Flexible Time Input
                    </FormLabel>
                    <InputGroup>
                        <Input
                            id="time-input"
                            type="text"
                            onChange={(e) => {
                                console.log('time input', e.target.value);
                                setTimeInput(e.target.value);
                            }}
                            value={timeInput}
                        />
                    </InputGroup>
                    <FormHelperText>
                        Put in your time and we will attempt to convert it.
                    </FormHelperText>
                </FormControl>

                <Divider />

                {timezoneRows.map((row, index) => {
                    return (
                        <TimezoneRow
                            key={index}
                            index={index}
                            data={row}
                            // TODO: variant based on config
                            variant={TimezoneRowVariant.CONCISE}
                        />
                    );
                })}
            </Stack>
        </Stack>
    );
}

enum TimezoneRowVariant {
    CONCISE,
    COMFORTABLE,
}

interface TimezoneRowProps {
    index: number;
    data: TimezoneRowData;
    variant: TimezoneRowVariant;
}

function TimezoneRow({ index, data, variant }: TimezoneRowProps) {
    const label =
        data.label == data.timezone
            ? data.label
            : `${data.label} (${data.timezone})`;
    return (
        <FormControl>
            <FormLabel htmlFor={`timezone-${index}`}>{label}</FormLabel>
            <InputGroup>
                <Input
                    isReadOnly
                    // disable normal focus styling for readOnly
                    _focus={{
                        borderColor: 'blue.500',
                    }}
                    variant={'filled'}
                    id={`timezone-${index}`}
                    value={data.convertedTime}
                />
                <InputRightElement
                    children={<CopyButton value={data.convertedTime} />}
                />
            </InputGroup>
        </FormControl>
    );
}

interface CopyButtonProps {
    value?: string;
}

function CopyButton({ value }: CopyButtonProps) {
    const { hasCopied, onCopy } = useClipboard(value || '');
    return (
        <IconButton
            size={'sm'}
            aria-label="Copy"
            onClick={onCopy}
            fontSize={'lg'}
            icon={hasCopied ? <CheckSquare /> : <Copy />}
        />
    );
}
