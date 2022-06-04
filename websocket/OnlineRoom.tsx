import { ICommand } from '../tictactoe/messages';
import {
    Button,
    Center,
    Code,
    Flex,
    HStack,
    IconButton,
    LinkBox,
    LinkOverlay,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Skeleton,
    Stack,
    Text,
    useBreakpointValue,
    useClipboard,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { LinkSimple } from 'phosphor-react';

const roomIdLength = 4;
const roomIdUrlParamKey = 'roomId';

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
        const { isOpen, onClose } = useDisclosure({ isOpen: !inRoom });
        const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
            buildWsAddress(roomId),
            { retryOnError: true, reconnectAttempts: 3 },
            roomId.length === roomIdLength
        );
        const { hasCopied, onCopy } = useClipboard(getCurrentURL());
        const toast = useToast();

        const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

        useEffect(() => {
            setRoomId(tryGetRoomId());
        }, []);

        useEffect(() => {
            if (ReadyState.OPEN === readyState) {
                setInRoom(() => true);

                const url = new URL(window.location.href);
                url.searchParams.set(roomIdUrlParamKey, roomId);
                window.history.pushState('', '', url);
            }
        }, [readyState, roomId]);

        useEffect(() => {
            if (lastJsonMessage) {
                props.handleNewMessage(lastJsonMessage);
            }
        }, [lastJsonMessage]);

        useImperativeHandle(ref, () => ({
            sendWsMessage(message: ICommand) {
                sendJsonMessage(message);
            },
        }));

        return (
            <Flex>
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    closeOnOverlayClick={false}
                    closeOnEsc={false}
                    size={modalSize}
                >
                    <ModalOverlay />
                    <ModalContent
                        borderRadius={{
                            base: '0.375rem 0.375rem 0rem 0rem',
                            md: '0.375rem',
                        }}
                        mt={'3.75rem'}
                    >
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
                            <Stack
                                direction={{ base: 'column', md: 'row' }}
                                spacing={3}
                            >
                                <Button
                                    colorScheme="teal"
                                    onClick={() => {
                                        setRoomId(
                                            generateRandomRoomId(roomIdLength)
                                        );
                                    }}
                                >
                                    Create a new room
                                </Button>
                                <LinkBox>
                                    <Button variant="ghost">
                                        <LinkOverlay href={'/'}>
                                            Return to homepage
                                        </LinkOverlay>
                                    </Button>
                                </LinkBox>
                            </Stack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Center w={'100%'} h={'3rem'}>
                    <Skeleton isLoaded={inRoom}>
                        <Code fontSize={'2rem'} borderRadius={'0.5rem'}>
                            {inRoom ? roomId : '----'}
                        </Code>
                    </Skeleton>
                    <IconButton
                        aria-label={'copy to clipboard'}
                        icon={<LinkSimple size={'2rem'} />}
                        onClick={() => {
                            onCopy();
                            toast({
                                title: 'Room URL copied',
                                description:
                                    'Give the URL to your friend to start the game.',
                                status: 'success',
                                duration: 5000,
                                isClosable: true,
                            });
                        }}
                        ml={2}
                        variant={hasCopied ? 'solid' : 'ghost'}
                    />
                </Center>
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

function tryGetRoomId(): string {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    return (
        searchParams.has(roomIdUrlParamKey)
            ? searchParams.get(roomIdUrlParamKey)!
            : ''
    ).toLocaleUpperCase();
}

function generateRandomRoomId(roomIdLength: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = roomIdLength; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

const buildWsAddress = (roomCode: string): string => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href.replace(/^http/, 'ws'));
        url.searchParams.set(roomIdUrlParamKey, roomCode);
        return url.toString();
    }
    return '';
};

function getCurrentURL(): string {
    if (typeof window !== 'undefined') {
        return window.location.href;
    }
    return '';
}

OnlineRoom.displayName = 'OnlineRoom';
export default OnlineRoom;
