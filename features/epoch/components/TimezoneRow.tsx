import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    FormLabelProps,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useClipboard,
} from '@chakra-ui/react';
import { CheckSquare, Copy } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { convertToTimezone } from '../time';

export enum TimezoneRowVariant {
    CONCISE,
    COMFORTABLE,
}

export interface TimezoneRowData {
    label: string;
    timezone: string;
}

export interface TimezoneRowProps {
    index: number;
    timezoneRowData: TimezoneRowData;
    variant: TimezoneRowVariant;
    updateTimezone(newData: TimezoneRowData): void;
    inputTime?: Date;
}

export default function TimezoneRow({
    index,
    timezoneRowData,
    variant,
    updateTimezone,
    inputTime,
}: TimezoneRowProps): JSX.Element {
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
                    // FEAT: consider allowing different time formats
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

function EditableFormLabel(
    props: EditableFormLabelProps & Partial<FormLabelProps>
) {
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
