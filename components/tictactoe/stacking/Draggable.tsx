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
    const style = {
        touchAction: 'none',
        transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    };

    return (
        <Flex
            id={id}
            ref={setNodeRef}
            sx={style}
            {...listeners}
            {...attributes}
        >
            {props.children}
        </Flex>
    );
}
