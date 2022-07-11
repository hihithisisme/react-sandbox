import React, { useState } from 'react';
import {
    Button,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
    Tooltip,
    VStack,
} from '@chakra-ui/react';
import { ArrowUp } from 'phosphor-react';

interface commonControlProps {
    name: string;
}

type controlProps<T> = T extends 'button' ? buttonControls : T extends 'slider' ? sliderControls : never;

type controlTypeNames = 'button' | 'slider';

interface buttonControls extends commonControlProps {
    type: 'button';
    setterFunc: () => void;
}

interface sliderControls extends commonControlProps {
    type: 'slider';
    defaultValue: number;
    min: number;
    max: number;
    step?: number;
    setterFunc: (value: number) => void;
}

function ControlSlider({ control, i }: { control: sliderControls; i: number }) {
    const [value, setValue] = useState(control.defaultValue);

    return (
        <Stack w={'100%'} backgroundColor={'gray.100'} p={2} rounded={'0.375rem'}>
            <Text fontWeight={'semibold'}>{control.name}</Text>
            <Slider
                defaultValue={control.defaultValue}
                min={control.min}
                max={control.max}
                step={control.step}
                onChange={(v) => {
                    setValue(v);
                    control.setterFunc(v);
                }}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <Tooltip hasArrow placement={'top'} label={value}>
                    <SliderThumb />
                </Tooltip>
            </Slider>
        </Stack>
    );
}

export default function IterativeControls({ controls }: { controls: controlProps<any>[] }) {
    return (
        <Popover>
            <PopoverTrigger>
                <IconButton
                    aria-label={'open experiment controls'}
                    icon={<ArrowUp />}
                    position={'absolute'}
                    bottom={0}
                    rounded={0}
                    roundedTopRight={10}
                />
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <VStack
                        // position={'absolute'}
                        // bottom={0}
                        // p={3}
                        // spacing={3}
                        // alignItems={'start'}
                        // backgroundColor={'rgba(255,255,255,0.2)'}
                        // roundedTopRight={10}
                        minW={'300px'}
                    >
                        {controls.map((control, i) => {
                            if (control.type === 'button') {
                                return (
                                    <Button key={i} w={'100%'} onClick={control.setterFunc}>
                                        {control.name}
                                    </Button>
                                );
                            } else if (control.type === 'slider') {
                                return <ControlSlider key={i} control={control} i={i} />;
                            }
                        })}
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
