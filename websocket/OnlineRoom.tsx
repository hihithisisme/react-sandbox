import { ICommand } from '../tictactoe/commands';
import {
    Button,
    Center,
    Code,
    Flex,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Text,
    useClipboard,
    useDisclosure,
} from '@chakra-ui/react';
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const roomIdLength = 4;

interface OnlineRoomProps {
    handleNewMessage: (message: ICommand) => void;
}

export interface OnlineRoomRefProps {
    sendWsMessage(message: ICommand): void;
}

const OnlineRoom = forwardRef<OnlineRoomRefProps, OnlineRoomProps>(
    (props: OnlineRoomProps, ref: ForwardedRef<any>) => {
        const [roomId, setRoomId] = useState('');
        const [inRoom, setInRoom] = useState(false);
        const { isOpen, onClose } = useDisclosure({
            isOpen: roomId.length !== roomIdLength,
        });
        const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
            buildWsAddress(roomId),
            { retryOnError: true, reconnectAttempts: 3 },
            roomId.length === roomIdLength
        );
        const { hasCopied, onCopy } = useClipboard(roomId);

        useEffect(() => {
            if (ReadyState.OPEN === readyState) {
                setInRoom(() => true);
            }
        }, [readyState]);

        useEffect(() => {
            if (lastJsonMessage) {
                console.log('message', lastJsonMessage);

                props.handleNewMessage(lastJsonMessage);
            }
        }, [lastJsonMessage]);

        useImperativeHandle(ref, () => ({
            sendWsMessage(message: ICommand) {
                console.log('sending', message);
                sendJsonMessage(message);
            },
        }));

        return (
            <Flex pb={8}>
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    closeOnOverlayClick={false}
                    closeOnEsc={false}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Play against your friend!</ModalHeader>
                        {/*<ModalCloseButton />*/}
                        <ModalBody>
                            <Text>Get the Room code from your friend!</Text>
                            <RoomIdInput
                                roomId={roomId}
                                onChange={(value) =>
                                    setRoomId(value.toLocaleUpperCase())
                                }
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="teal"
                                mr={3}
                                onClick={() =>
                                    console.log('TODO: need create new room')
                                }
                            >
                                Create New Room
                            </Button>
                            <Button variant="ghost">Go back</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {inRoom && (
                    <Center width={'100%'}>
                        {/*<Text>{ReadyState[readyState]}</Text>*/}
                        <Code as={Heading}>{roomId}</Code>
                        <Button onClick={onCopy} ml={2}>
                            {hasCopied ? 'Copied' : 'Copy'}
                        </Button>
                        {/*<Text>{buildWsAddress(code)}</Text>*/}
                    </Center>
                )}
            </Flex>
        );
    }
);

function RoomIdInput(props: {
    roomId: string;
    onChange: (value: string) => void;
}) {
    return (
        <HStack justifyContent={'center'}>
            <PinInput
                focusBorderColor={'teal.400'}
                type={'alphanumeric'}
                size={'lg'}
                value={props.roomId}
                onChange={props.onChange}
            >
                {Array(roomIdLength)
                    .fill(null)
                    .map((_, i) => (
                        <PinInputField key={i} />
                    ))}
            </PinInput>
        </HStack>
    );
}

OnlineRoom.displayName = 'OnlineRoom';

const buildWsAddress = (roomCode: string) => {
    return `ws://${process.env.NEXT_PUBLIC_WS_ADDRESS}?code=${roomCode}`;
};

export default OnlineRoom;
