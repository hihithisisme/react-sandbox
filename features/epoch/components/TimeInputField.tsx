import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { parseTime } from '../time';

export interface TimeInputFieldProps {
    setTimeInput: (timeInput: Date) => void;
}

export default function TimeInputField({ setTimeInput }: TimeInputFieldProps) {
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
        // Parse the input value
        const parsedTime = parseTime(newValue) || undefined;
        if (parsedTime) {
            setTimeInput(parsedTime);
        }
    };

    return (
        <FormControl>
            <FormLabel htmlFor="time-input">Flexible Time Input</FormLabel>
            <InputGroup>
                <Input
                    id="time-input"
                    type="text"
                    onChange={(e) => handleInputChange(e.target.value)}
                    value={inputValue}
                />
                <InputRightElement>
                    <Button
                        mr={1}
                        size="sm"
                        onClick={() =>
                            // set to current epoch ms
                            handleInputChange(Date.now().toString())
                        }
                    >
                        <Text textAlign={'right'}>now</Text>
                    </Button>
                </InputRightElement>
            </InputGroup>

            {/* FEAT: display the identified time format */}
            <FormHelperText>
                Put in your time and we will attempt to convert it.
            </FormHelperText>
        </FormControl>
    );
}
