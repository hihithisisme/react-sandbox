import {
    Box,
    Button,
    Center,
    Code,
    Flex,
    FormControl, FormLabel,
    HStack,
    IconButton,
    Input, LinkBox,
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
    VStack
} from '@chakra-ui/react';
import { LinkSimple } from '@phosphor-icons/react';
import { ChangeEvent, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';
import { reviver } from './jsonSerializer';

const ROOM_ID_LENGTH = 4;
const ROOM_ID_URL_PARAM_KEY = 'roomId';

interface OnlineRoomProps {
    handleNewMessage: (message: any) => void;
    wsHook: WebSocketHook<MessageEvent<any>>;
    roomId: string;
    setRoomId: (roomId: string) => void;
    username: string;
    setUsername: (username: string) => void;
    isUsernameValid: boolean;
    setIsUsernameValid: (valid: boolean) => void;
    setTryConnect: (tryConnect: boolean) => void;
}

export function useOnlineRoom() {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [tryConnect, setTryConnect] = useState(false);

    const isRoomValidToStart =
        roomId.length === ROOM_ID_LENGTH && isUsernameValid;

    const wsHook = useWebSocket(
        buildWsAddress(roomId),
        { retryOnError: true, reconnectAttempts: 3 },
        isRoomValidToStart && tryConnect
    );

    useEffect(() => {
        setRoomId(tryGetRoomId());
    }, []);

    useEffect(() => {
        if (tryConnect) {
            if (!isRoomValidToStart) {
                setTryConnect(false);
            }
        }
    }, [tryConnect]);

    return {
        sendWsMessage: wsHook.sendJsonMessage,
        wsHook,
        roomId,
        setRoomId,
        username,
        setUsername,
        isUsernameValid,
        setIsUsernameValid,
        setTryConnect,
    };
}

function OnlineRoom(props: OnlineRoomProps) {
    const [inRoom, setInRoom] = useState(false);
    const { isOpen, onClose } = useDisclosure({ isOpen: !inRoom });
    const { lastMessage, readyState } = props.wsHook;
    const { hasCopied, onCopy } = useClipboard(getCurrentURL());
    const toast = useToast();

    const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

    useEffect(() => {
        if (ReadyState.OPEN === readyState && props.username !== '') {
            setInRoom(() => true);

            const url = new URL(window.location.href);
            url.searchParams.set(ROOM_ID_URL_PARAM_KEY, props.roomId);
            window.history.pushState('', '', url);
        }
    }, [readyState, props.roomId]);

    useEffect(() => {
        if (lastMessage) {
            const lastJsonMessage = JSON.parse(lastMessage.data, reviver);
            if (lastJsonMessage.action === 'PING') return;
            props.handleNewMessage(lastJsonMessage);
        }
    }, [lastMessage]);

    function onUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        let name = event.target.value;
        if (name.length > 8) {
            name = name.slice(0, 8);
        }
        props.setUsername(name);
        props.setIsUsernameValid(name.length > 0);
    }

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
                    <ModalBody>
                        <VStack p={3} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    isInvalid={!props.isUsernameValid}
                                    placeholder={'Username here!'}
                                    value={props.username}
                                    onChange={onUsernameChange}
                                />
                                {/* {!isUsernameValid ?
                                    <FormErrorMessage>
                                        You need a username
                                    </FormErrorMessage> :
                                    <FormHelperText>
                                        Please enter a username
                                    </FormHelperText>
                                } */}
                            </FormControl>
                            <RoomIdInput
                                roomId={props.roomId}
                                onChange={(value) =>
                                    props.setRoomId(value.toLocaleUpperCase())
                                }
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Stack
                            direction={{ base: 'column', md: 'row' }}
                            spacing={3}
                        >
                            <Button
                                colorScheme="teal"
                                onClick={() => {
                                    if (props.username === '') {
                                        return;
                                    }

                                    if (props.roomId === '') {
                                        props.setRoomId(
                                            generateRandomRoomId(ROOM_ID_LENGTH)
                                        );
                                    }
                                    props.setTryConnect(true);
                                }}
                            >
                                {props.roomId === ''
                                    ? 'Create a new room'
                                    : 'Join room'}
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
                        {inRoom ? props.roomId : '----'}
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

function RoomIdInput(props: { roomId: string; onChange: (value: string) => void }) {
    return (
        <Box>
            <Text>Get the Room code from your friend!</Text>
            <HStack justifyContent={'center'}>
                <PinInput
                    focusBorderColor={'teal.400'}
                    type={'alphanumeric'}
                    size={'lg'}
                    value={props.roomId}
                    onChange={props.onChange}
                >
                    {Array(ROOM_ID_LENGTH)
                        .fill(null)
                        .map((_, i) => (
                            <PinInputField key={i} />
                        ))}
                </PinInput>
            </HStack>
        </Box>

    );
}

function tryGetRoomId(): string {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    return (searchParams.has(ROOM_ID_URL_PARAM_KEY) ? searchParams.get(ROOM_ID_URL_PARAM_KEY)! : '').toLocaleUpperCase();
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
        url.searchParams.set(ROOM_ID_URL_PARAM_KEY, roomCode);
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
