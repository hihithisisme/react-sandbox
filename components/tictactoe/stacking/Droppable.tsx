import { useDroppable } from '@dnd-kit/core';
import { Grid, GridItem } from '@chakra-ui/react';

// TODO: add isDisabled props
interface IDroppable {
    id: string | number;
    children: any;
}

export default function Droppable(props: IDroppable) {
    const id = `id-${props.id}`;
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });
    const style = {
        bgColor: isOver ? 'gray.500' : undefined,
        opacity: isOver ? '50%' : '0%',
    };

    return (
        <Grid templateRows={'1fr'} templateColumns={'1fr'} ref={setNodeRef}>
            <GridItem rowStart={1} colStart={1} sx={style} />
            <GridItem rowStart={1} colStart={1}>
                {props.children}
            </GridItem>
        </Grid>
    );
}
