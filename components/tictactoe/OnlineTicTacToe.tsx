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
import { useEffect, useState } from 'react';
import {
    getWinningLine,
    isNotAllowedToPlay,
    newGame,
    otherPlayerSign,
} from './game';
import axios, { AxiosResponse } from 'axios';
import { AIResponse } from '../../pages/api/tictactoe/simple-ai';
import BaseTicTacToe from './BaseTicTacToe';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const gameSize = 3;
const roomCodeLength = 4;

const buildWsAddress = (roomCode: string) => {
    return `ws://${process.env.NEXT_PUBLIC_WS_ADDRESS}?code=${roomCode}`;
};

interface OnlineTicTacToeProps {}

function Connector({ code }: { code: string }) {
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        buildWsAddress(code)
    );

    useEffect(() => {
        if (lastMessage) {
            console.log('message', lastMessage.data);

            setTimeout(() => {
                sendMessage("{ hello: 'world' }");
            }, 1000);
        }
    }, [lastMessage]);

    useEffect(() => {
        sendMessage("{ hello: 'first hello?' }");
    }, []);

    return (
        <Box>
            <Text>{ReadyState[readyState]}</Text>
            <Text>{buildWsAddress(code)}</Text>
        </Box>
    );
}

function OnlineTicTacToe(props: OnlineTicTacToeProps) {
    const isPlayerFirst = true;

    async function handleClick(i: number) {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        const squares = game.squares.slice();
        squares[i] = game.isPlayerTurn
            ? game.playerSign
            : otherPlayerSign(game);
        let nGame = {
            ...game,
            squares,
            isPlayerTurn: !game.isPlayerTurn,
        };
        setGame(nGame);

        const aiMove: number = (
            (await axios.post('/api/tictactoe/simple-ai', {
                data: nGame,
            })) as AxiosResponse<AIResponse>
        ).data.bestMove;

        setTimeout(() => {
            setGame((nGame) => {
                if (getWinningLine(nGame)) {
                    return nGame;
                }

                const squares = nGame.squares.slice();
                squares[aiMove] = nGame.isPlayerTurn
                    ? nGame.playerSign
                    : otherPlayerSign(nGame);
                return {
                    ...nGame,
                    squares,
                    isPlayerTurn: !nGame.isPlayerTurn,
                };
            });
        }, 400);
    }

    const [game, setGame] = useState(newGame(gameSize, isPlayerFirst));
    const [roomCode, setRoomCode] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure({
        // isOpen: roomCode.length !== roomCodeLength,
        isOpen: true,
    });

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

                        {roomCode.length === roomCodeLength && (
                            <Connector code={roomCode} />
                        )}
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
