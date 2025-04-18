import { Center, Flex, GridItem, Icon } from '@chakra-ui/react';
import { Circle, X } from '@phosphor-icons/react';
import React from 'react';
import { deserializeSign } from '../logic/squareSign';
import { squareSize } from './BaseTicTacToe';


export interface ISquareProps {
    index: number;
    gameSize: number;
    signValue: string | null;
    highlightSign: boolean;

    handleClick(): void;
}

export default function Square(props: ISquareProps): JSX.Element {
    const defaultBorder = `2px black solid`;

    return (
        <GridItem
            onClick={props.handleClick}
            boxSize={squareSize}
            rowSpan={1}
            colSpan={1}
            rowStart={~~(props.index / props.gameSize) + 1}
            colStart={(props.index % props.gameSize) + 1}
            borderBottom={isBottomEdge(props.index, props.gameSize) ? 'transparent' : defaultBorder}
            borderTop={isTopEdge(props.index, props.gameSize) ? 'transparent' : defaultBorder}
            borderLeft={isLeftEdge(props.index, props.gameSize) ? 'transparent' : defaultBorder}
            borderRight={isRightEdge(props.index, props.gameSize) ? 'transparent' : defaultBorder}
        >
            <Center w={'100%'} h={'100%'}>
                <PlayerIcon signValue={props.signValue} isFocus={props.highlightSign} />
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

export interface IPlayerIconProps {
    signValue: string | null;
    isFocus: boolean;
    boxSize?: any;
}

function getBgColor(filled: boolean, isFocus: boolean) {
    if (!filled) {
        return 'transparent';
    }

    if (isFocus) {
        return 'teal.300';
    }
    return 'teal.200';
}

export function PlayerIcon(props: IPlayerIconProps) {
    const deserializedSign = deserializeSign(props.signValue);
    if (!deserializedSign) {
        return <></>;
    }

    const { sign, size, filled } = deserializedSign;
    return (
        <Flex bgColor={getBgColor(filled, props.isFocus)} borderRadius={'20%'}>
            <Icon
                as={sign === 'X' ? X : Circle}
                boxSize={props.boxSize || size}
                transition={'opacity 0.3s ease-out'}
                opacity={props.isFocus ? 1 : 0.2}
            />
        </Flex>
    );
}
