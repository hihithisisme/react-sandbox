import { useDraggable } from '@dnd-kit/core';
import { Flex } from '@chakra-ui/react';

// TODO: add isDisabled props
interface IDraggable {
    id: string | number;
    children: any;
}

export default function Draggable(props: IDraggable) {
    const id = `id-${props.id}`;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });
    return (
        <Flex
            id={id}
            ref={setNodeRef}
            transform={`translate3d(${transform?.x}px, ${transform?.y}px, 0)`}
            {...listeners}
            {...attributes}
            sx={{ touchAction: 'none' }}
        >
            {props.children}
        </Flex>
    );
}
