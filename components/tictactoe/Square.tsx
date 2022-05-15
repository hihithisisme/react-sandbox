import { Center, GridItem, Icon } from '@chakra-ui/react';
import React from 'react';

import { Circle, X } from 'phosphor-react';
import { squareSize } from './TicTacToe';

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

    let displayIcon = null;
    if (props.value == 'X') {
        displayIcon = <CrossIcon isFocus={props.highlight} />;
    } else if (props.value === 'O') {
        displayIcon = <CircleIcon isFocus={props.highlight} />;
    }

    return (
        <GridItem
            onClick={props.handleClick}
            boxSize={squareSize}
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

const iconSize = '60%';

function CrossIcon(props: { isFocus: boolean }) {
    return (
        <Icon
            as={X}
            boxSize={iconSize}
            transition={'opacity 0.3s ease-out'}
            opacity={props.isFocus ? 1 : 0.2}
        />
    );
}

function CircleIcon(props: { isFocus: boolean }) {
    return (
        <Icon
            as={Circle}
            boxSize={iconSize}
            transition={'opacity 0.3s ease-out'}
            opacity={props.isFocus ? 1 : 0.2}
        />
    );
}
