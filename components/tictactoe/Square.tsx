import { Center, Flex, GridItem, Icon } from '@chakra-ui/react';
import React from 'react';

import { Circle, X } from 'phosphor-react';
import { squareSize } from './BaseTicTacToe';
import { deserializeSign } from '../../tictactoe/squareSign';

interface ISquareProps {
    index: number;
    gameSize: number;
    value: string | null;
    highlight: boolean;

    handleClick(): void;
}

export default function Square(props: ISquareProps): JSX.Element {
    const defaultBorder = `2px black solid`;

    return (
        <GridItem
            className={`sq-${props.index}`}
            onClick={props.handleClick}
            boxSize={squareSize}
            rowSpan={1}
            colSpan={1}
            rowStart={~~(props.index / props.gameSize) + 1}
            colStart={(props.index % props.gameSize) + 1}
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
                <PlayerIcon sign={props.value} isFocus={props.highlight} />
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

export function PlayerIcon(props: {
    sign: string | null;
    isFocus: boolean;
    boxSize?: any;
}) {
    const deserializedSign = deserializeSign(props.sign);
    if (!deserializedSign) {
        return <></>;
    }

    const { sign, size, filled } = deserializedSign;
    return (
        <Flex
            bgColor={filled ? 'teal.300' : 'transparent'}
            borderRadius={'20%'}
        >
            <Icon
                as={sign === 'X' ? X : Circle}
                boxSize={props.boxSize || size || '60%'}
                transition={'opacity 0.3s ease-out'}
                opacity={props.isFocus ? 1 : 0.2}
            />
        </Flex>
    );
}
