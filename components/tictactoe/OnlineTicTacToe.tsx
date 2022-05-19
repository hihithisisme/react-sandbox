import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { isNotAllowedToPlay, newGame, otherPlayerSign } from './game';
import BaseTicTacToe from './BaseTicTacToe';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { IMove } from '../../pages/api/tictactoe/_live';

const gameSize = 3;
const roomCodeLength = 4;

const buildWsAddress = (roomCode: string) => {
    return `ws://${process.env.NEXT_PUBLIC_WS_ADDRESS}?code=${roomCode}`;
};

interface OnlineTicTacToeProps {}

interface ConnectorProps {
    roomCode: string;

    handleNewMessage(message: any): void;
}

const Connector = forwardRef<
    { sendWsMessage(message: object): void },
    ConnectorProps
>((props: ConnectorProps, ref: ForwardedRef<any>) => {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        buildWsAddress(props.roomCode)
    );

    useImperativeHandle(ref, () => ({
        sendWsMessage(message: object) {
            console.log('sending', message);
            sendJsonMessage(message);
        },
    }));

    useEffect(() => {
        if (lastJsonMessage) {
            console.log('message', lastJsonMessage);

            props.handleNewMessage(lastJsonMessage.data);

            // setTimeout(() => {
            //     sendJsonMessage({ hello: 'world' });
            // }, 1000);
        }
    }, [lastJsonMessage]);

    // useEffect(() => {
    //     sendJsonMessage({ hello: 'first hello' });
    // }, []);

    return (
        <Box>
            <Text>{ReadyState[readyState]}</Text>
            {/*<Text>{buildWsAddress(code)}</Text>*/}
        </Box>
    );
});
Connector.displayName = 'Connector';

function OnlineTicTacToe(props: OnlineTicTacToeProps) {
    // TODO: playerTurn and playerSign managed by server?
    const isPlayerFirst = true;

    async function handleClick(i: number) {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        connectorRef.current!.sendWsMessage({
            move: i,
            playerSign: game.isPlayerTurn
                ? game.playerSign
                : otherPlayerSign(game),
        });

        const squares = game.squares.slice();
        squares[i] = game.isPlayerTurn
            ? game.playerSign
            : otherPlayerSign(game);
        const nGame = {
            ...game,
            squares,
            isPlayerTurn: !game.isPlayerTurn,
        };
        setGame(nGame);
    }

    function handleNewMessage(message: IMove): void {
        console.log('handling new message', message);

        const squares = game.squares.slice();
        squares[message.move] = message.playerSign;
        const nGame = {
            ...game,
            squares,
            isPlayerTurn: !game.isPlayerTurn,
        };
        setGame(nGame);
    }

    const [game, setGame] = useState(newGame(gameSize, isPlayerFirst));
    const [roomCode, setRoomCode] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure({
        isOpen: roomCode.length !== roomCodeLength,
        // isOpen: true,
    });
    const connectorRef = useRef<{ sendWsMessage(message: object): void }>(null);

    return (
        <Box textAlign={'center'}>
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
                        <Flex justifyContent={'center'}>
                            <PinInput
                                focusBorderColor={'teal.400'}
                                type={'alphanumeric'}
                                size={'lg'}
                                value={roomCode}
                                onChange={(value) =>
                                    setRoomCode(value.toLocaleUpperCase())
                                }
                            >
                                {Array(roomCodeLength)
                                    .fill(null)
                                    .map((_, i) => {
                                        return <PinInputField key={i} />;
                                    })}
                            </PinInput>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="teal"
                            mr={3}
                            onClick={() => {
                                console.log('should create new room');
                            }}
                        >
                            Create New Room
                        </Button>
                        <Button variant="ghost">Go back</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {roomCode.length === roomCodeLength && (
                <Connector
                    ref={connectorRef}
                    roomCode={roomCode}
                    handleNewMessage={handleNewMessage}
                />
            )}

            <BaseTicTacToe
                handleSquareClick={handleClick}
                game={game}
                setGame={setGame}
                isPlayerFirst={isPlayerFirst}
            />
            {/*<Button*/}
            {/*    // variant="contained"*/}
            {/*    size="md"*/}
            {/*    colorScheme="teal"*/}
            {/*    onClick={() => setGame(newGame(gameSize, isPlayerFirst))}*/}
            {/*>*/}
            {/*    new game*/}
            {/*</Button>*/}
        </Box>
    );
}

export default OnlineTicTacToe;
