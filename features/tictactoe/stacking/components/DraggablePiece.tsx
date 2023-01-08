import { useDraggable } from '@dnd-kit/core';
import { Flex } from '@chakra-ui/react';
import { IPlayerIconProps, PlayerIcon } from '../../components/Square';

// TODO: add isDisabled props
interface IDraggable extends IPlayerIconProps {
    id: string | number;
}

export default function DraggablePiece(props: IDraggable) {
    const id = `drag-${props.id}`;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: {
            id: props.id,
            signValue: props.signValue,
        },
    });
    return (
        <Flex
            id={id}
            ref={setNodeRef}
            transform={`translate3d(${transform?.x}px, ${transform?.y}px, 0) scale(2)`}
            {...listeners}
            {...attributes}
            sx={{ touchAction: 'none' }}
        >
            <PlayerIcon {...props} />
        </Flex>
    );
}
