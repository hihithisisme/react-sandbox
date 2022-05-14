import { Center, GridItem } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import React from 'react';
import { useWindowDimensions } from '../../components/tictactoe/utils';

interface ISquareProps {
    index: number;
    gameSize: number;
    value: string | null;
    highlight: boolean;

    handleClick(): void;
}

export default function Square(props: ISquareProps): JSX.Element {
    // const theme = useTheme();

    const defaultBorder = `2px black solid`;
    let squareWidth = useSquareWidth(props.gameSize);

    let displayIcon = null;
    if (props.value == 'X') {
        displayIcon = (
            <CrossIcon fontSize={squareWidth * 0.5} isFocus={props.highlight} />
        );
    } else if (props.value === 'O') {
        displayIcon = (
            <CircleIcon
                fontSize={squareWidth * 0.5}
                isFocus={props.highlight}
            />
        );
    }

    return (
        <GridItem
            onClick={props.handleClick}
            // height={`${squareWidth}px`}
            // width={`${squareWidth}px`}
            // h={`${100 / props.gameSize}%`}
            // w={`${100 / props.gameSize}%`}
            rowSpan={1}
            colSpan={1}
            borderBottom={
                isBottomEdge(props.index, props.gameSize)
                    ? 'transparent'
                    : defaultBorder
            }
            borderTop={
                isTopEdge(props.index, props.gameSize)
                    ? 'transparent'
                    : defaultBorder
            }
            borderLeft={
                isLeftEdge(props.index, props.gameSize)
                    ? 'transparent'
                    : defaultBorder
            }
            borderRight={
                isRightEdge(props.index, props.gameSize)
                    ? 'transparent'
                    : defaultBorder
            }
        >
            <Center w={'100%'} h={'100%'}>
                {displayIcon}
            </Center>
        </GridItem>
    );
}

function useSquareWidth(gameSize: number): number {
    const { width } = useWindowDimensions();

    const MAX_SQUARE = 200;
    const MIN_SQUARE = 50;
    const MARGINS = 100;

    if (width >= gameSize * MAX_SQUARE + MARGINS) {
        return MAX_SQUARE;
    } else if (width < gameSize * MIN_SQUARE + MARGINS) {
        return MIN_SQUARE;
    } else {
        return (width - MARGINS) / gameSize;
    }
}

function isTopEdge(index: number, gameSize: number) {
    return ~~(index / gameSize) === 0;
}

function isBottomEdge(index: number, gameSize: number) {
    return ~~(index / gameSize) === gameSize - 1;
}

function isLeftEdge(index: number, gameSize: number) {
    return index % gameSize === 0;
}

function isRightEdge(index: number, gameSize: number) {
    return index % gameSize === gameSize - 1;
}

function CrossIcon(props: { isFocus: boolean; fontSize: number }) {
    return (
        <CloseIcon
            w={'50%'}
            h={'50%'}
            transition={'opacity 0.3s ease-out'}
            opacity={props.isFocus ? 1 : 0.2}
        />
    );
}

function CircleIcon(props: { isFocus: boolean; fontSize: number }) {
    return (
        <CheckCircleIcon
            w={'50%'}
            h={'50%'}
            transition={'opacity 0.3s ease-out'}
            opacity={props.isFocus ? 1 : 0.2}
        />
    );
}
