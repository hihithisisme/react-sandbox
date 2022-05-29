import { useDroppable } from '@dnd-kit/core';
import { Grid, GridItem } from '@chakra-ui/react';
import Square, { ISquareProps } from '../Square';

// TODO: add isDisabled props
interface IDroppable extends ISquareProps {
    id: string | number;
}

export default function DroppableSquare(props: IDroppable) {
    const id = `drop-${props.id}`;
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: {
            id: props.id,
            signValue: props.signValue,
        },
    });

    return (
        <Grid templateRows={'1fr'} templateColumns={'1fr'} ref={setNodeRef}>
            <GridItem
                rowStart={1}
                colStart={1}
                bgColor={isOver ? 'teal.300' : undefined}
                opacity={isOver ? '50%' : '0%'}
                borderRadius={'10%'}
            />
            <GridItem rowStart={1} colStart={1}>
                <Square {...props} />
            </GridItem>
        </Grid>
    );
}
