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

export interface TimeInputFieldProps {
    timeInput: string;
    setTimeInput: (timeInput: string) => void;
}

export default function TimeInputField({
    timeInput,
    setTimeInput,
}: TimeInputFieldProps) {
    return (
        <FormControl>
            <FormLabel htmlFor="time-input">Flexible Time Input</FormLabel>
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

            {/* FEAT: display the identified time format */}
            <FormHelperText>
                Put in your time and we will attempt to convert it.
            </FormHelperText>
        </FormControl>
    );
}
