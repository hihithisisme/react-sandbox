import {
    Box,
    Button,
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
    Text,
    useClipboard,
} from '@chakra-ui/react';
import { CheckSquare, Copy } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { convertToTimezone, parseTime } from './time';

interface TimezoneRowData {
    label: string;
    timezone: string;
    // convertedTime?: string;
}

export default function EpochConverter() {
    const [timeInput, setTimeInput] = useState('');
    const parsedTime = parseTime(timeInput) || undefined;
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

    // Add a new timezone row
    const appendTimezoneRow = (timezoneData: TimezoneRowData) => {
        setTimezoneRows((prev) => [...prev, timezoneData]);
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
            return [...prev];
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
                        <InputRightElement>
                            <Button
                                mr={1}
                                size="sm"
                                onClick={() =>
                                    // set to current epoch ms
                                    setTimeInput(Date.now().toString())
                                }
                            >
                                <Text textAlign={'right'}>now</Text>
                            </Button>
                        </InputRightElement>
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
                <TimezoneRow
                    key={timezoneRows.length}
                    index={timezoneRows.length}
                    timezoneRowData={{ label: '', timezone: '' }}
                    variant={TimezoneRowVariant.CONCISE}
                    updateTimezone={(data) => appendTimezoneRow(data)}
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
    timezoneRowData: TimezoneRowData;
    variant: TimezoneRowVariant;
    updateTimezone(newData: TimezoneRowData): void;
    inputTime?: Date;
}

function TimezoneRow({
    index,
    timezoneRowData,
    variant,
    updateTimezone,
    inputTime,
}: TimezoneRowProps) {
    const convertedTime = convertToTimezone(
        inputTime,
        timezoneRowData.timezone
    );

    return (
        <FormControl>
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* FEAT: add 'rename' ghost (right-aligned) */}
                    {/* <EditableFormLabel
                        htmlFor={`timezone-${index}`}
                        initialLabel={data.label}
                        onLabelChange={(newLabel) => {
                            updateTimezone({ ...data, label: newLabel });
                        }}
                        cursor="pointer"
                        labelAlignment="left"
                    /> */}
                    {/* FEAT: modify to autocomplete timezone selector */}
                    <EditableFormLabel
                        htmlFor={`timezone-${index}`}
                        initialLabel={timezoneRowData.timezone}
                        onLabelChange={(newLabel) => {
                            updateTimezone({
                                ...timezoneRowData,
                                timezone: newLabel,
                            });
                        }}
                        cursor="pointer"
                        labelAlignment="left"
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
                    value={convertedTime}
                />
                <InputRightElement
                    children={<CopyButton value={convertedTime} />}
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

    const thisRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableLabel, setEditableLabel] = useState(initialLabel);

    const handleLabelClick = () => {
        setIsEditing(true);
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableLabel(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onLabelChange(editableLabel);
    };

    return (
        <Flex
            alignItems="center"
            ml={labelAlignment === 'right' ? 'auto' : undefined}
            mr={labelAlignment === 'left' ? 'auto' : undefined}
        >
            {isEditing ? (
                <Input
                    ref={thisRef}
                    autoFocus
                    variant="unstyled"
                    textAlign={labelAlignment}
                    fontStyle={'italic'}
                    value={editableLabel}
                    onChange={handleLabelChange}
                    onBlur={handleBlur}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            thisRef.current?.blur();
                        }
                    }}
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
                    {editableLabel || 'New Timezone'}
                </FormLabel>
            )}
        </Flex>
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
