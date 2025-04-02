import {
    Box,
    Divider,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    FormLabelProps,
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
    const addTimezoneRow = (timezone: string) => {
        setTimezoneRows((prev) => [
            ...prev,
            {
                order: prev.length,
                label: 'New Timezone',
                // TODO: normalize timezone
                timezone,
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
                            updateTimezone={(newData) =>
                                updateTimezone(index, newData)
                            }
                            // TODO: variant based on config
                            variant={TimezoneRowVariant.CONCISE}
                        />
                    );
                })}
                <TimezoneRow
                    key={timezoneRows.length}
                    index={timezoneRows.length}
                    data={{ label: '', timezone: '' }}
                    variant={TimezoneRowVariant.CONCISE}
                    updateTimezone={() => {}}
                />
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
    updateTimezone(newData: TimezoneRowData): void;
}

function TimezoneRow({
    index,
    data,
    variant,
    updateTimezone,
}: TimezoneRowProps) {
    const showLabel = data.label === data.timezone;

    return (
        <FormControl>
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <EditableFormLabel
                        htmlFor={`timezone-${index}`}
                        initialLabel={data.label}
                        onLabelChange={(newLabel) => {
                            updateTimezone({ ...data, label: newLabel });
                        }}
                        cursor="pointer"
                        labelAlignment="left"
                    />
                    <EditableFormLabel
                        htmlFor={`timezone-${index}`}
                        initialLabel={data.timezone}
                        onLabelChange={(newLabel) => {
                            updateTimezone({ ...data, timezone: newLabel });
                        }}
                        cursor="pointer"
                        labelAlignment="right"
                    />
                </Box>
            </Box>
            <InputGroup>
                <Input
                    isReadOnly
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
interface EditableFormLabelProps {
    initialLabel: string;
    onLabelChange: (newLabel: string) => void;
    htmlFor: string;
    labelAlignment: 'left' | 'right';
}

function EditableFormLabel(props: EditableFormLabelProps & FormLabelProps) {
    const { initialLabel, onLabelChange, htmlFor, labelAlignment } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editableLabel, setEditableLabel] = useState(initialLabel);

    const handleLabelClick = () => {
        setIsEditing(true);
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableLabel(e.target.value);
        onLabelChange(editableLabel);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <Flex
            alignItems="center"
            ml={labelAlignment === 'right' ? 'auto' : undefined}
            mr={labelAlignment === 'left' ? 'auto' : undefined}
        >
            {isEditing ? (
                <Input
                    autoFocus
                    value={editableLabel}
                    onChange={handleLabelChange}
                    onBlur={handleBlur}
                    variant="unstyled"
                    textAlign={labelAlignment}
                    fontStyle={'italic'}
                />
            ) : (
                <FormLabel
                    htmlFor={htmlFor}
                    onClick={handleLabelClick}
                    cursor="pointer"
                    mr={1}
                    my={1}
                    textAlign={labelAlignment}
                >
                    {editableLabel}
                </FormLabel>
            )}
        </Flex>
    );
}

// // TODO: should this be just reusing TimezoneRow? Editable label and timezones
// function NewTimezoneRow({
//     addTimezoneRow,
// }: {
//     addTimezoneRow: (timezone: string) => void;
// }) {
//     const [timezone, setTimezone] = useState('');

//     const handleClick = (
//         e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//     ) => {
//         if (!!timezone) {
//             addTimezoneRow(timezone);
//         }
//     };
//     return (
//         <FormControl>
//             {/* <FormLabel htmlFor={`timezone-${index}`}>{label}</FormLabel> */}
//             <InputGroup>
//                 <FormLabel htmlFor={'new-timezone'}>kldsjf</FormLabel>
//                 {/* TODO: change to autocomplete */}
//                 <Input
//                     // // disable normal focus styling for readOnly
//                     // _focus={{
//                     //     borderColor: 'blue.500',
//                     // }}
//                     id={'new-timezone'}
//                     borderEndRadius={'full'}
//                     variant={'outline'}
//                     placeholder={'Add new timezone'}
//                     value={timezone}
//                     onChange={(e) => setTimezone(e.target.value)}
//                 />
//                 <InputRightElement>
//                     <Box>
//                         <IconButton
//                             borderRadius={'full'}
//                             onClick={handleClick}
//                             icon={<PlusCircle />}
//                             isDisabled={!timezone}
//                             aria-label={'add timezone'}
//                         />
//                     </Box>
//                 </InputRightElement>
//             </InputGroup>
//         </FormControl>
//     );
// }

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
