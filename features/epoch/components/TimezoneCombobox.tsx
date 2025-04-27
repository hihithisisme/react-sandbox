import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { useCombobox } from 'downshift';
import { useState } from 'react';
import { buildAllTimezones } from '../time';

const VISIBLE_TIMEZONE_LIMIT = 10;

export interface TimezoneComboboxProps {
    inputValue?: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}

export default function TimezoneCombobox({
    inputValue,
    onChange,
    onBlur,
}: TimezoneComboboxProps): JSX.Element {
    const [visibleTimezones, setVisibleTimezones] = useState<string[]>([]);
    // const allTimezones = useMemo(() => buildAllTimezones(), []);
    const allTimezones = buildAllTimezones();

    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        setInputValue,
        getItemProps,
        selectedItem,
    } = useCombobox<string>({
        selectedItem: inputValue,
        onSelectedItemChange({ selectedItem }) {
            if (selectedItem) {
                onChange(selectedItem);
            }
        },
        onInputValueChange({ inputValue }) {
            setVisibleTimezones(
                // FEAT: fuzzy filter
                allTimezones
                    .filter((tz) =>
                        tz
                            .toLowerCase()
                            .includes(inputValue?.toLowerCase() || '')
                    )
                    .slice(0, VISIBLE_TIMEZONE_LIMIT)
            );
        },
        items: visibleTimezones,
        itemToString(item) {
            return item || '';
        },
    });

    return (
        <Box onBlur={onBlur}>
            {/* FEAT: add rightElement button for dropdown */}
            <Input
                autoFocus
                variant="unstyled"
                //     textAlign={labelAlignment}
                fontStyle={'italic'}
                {...getInputProps()}
            />
            <Stack direction={'column'} {...getMenuProps()}>
                {isOpen &&
                    visibleTimezones.map((tz, index) => {
                        return (
                            <Box
                                key={tz}
                                {...getItemProps({
                                    index,
                                    item: tz,
                                })}
                            >
                                <Text>{tz}</Text>
                            </Box>
                        );
                    })}
            </Stack>
        </Box>
    );
}
