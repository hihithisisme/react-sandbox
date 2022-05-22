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
import { useRef, useState } from 'react';
import {
    emptyGame,
    isNotAllowedToPlay,
    otherPlayerSign,
} from '../../tictactoe/game';
import BaseTicTacToe from './BaseTicTacToe';
import { ICommand, InitCmd, MoveCmd } from '../../tictactoe/commands';
import Connector, { ConnectorRefProps } from '../../websocket/Connector';

const gameSize = 3;
const roomCodeLength = 4;

function OnlineTicTacToe() {
    async function handleClick(i: number) {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        connectorRef.current!.sendWsMessage({
            action: 'MOVE',
            data: {
                move: i,
                playerSign: game.isPlayerTurn
                    ? game.playerSign
                    : otherPlayerSign(game),
            },
        });

        // const squares = game.squares.slice();
        // squares[i] = game.isPlayerTurn
        //     ? game.playerSign
        //     : otherPlayerSign(game);
        // const nGame = {
        //     ...game,
        //     squares,
        //     isPlayerTurn: !game.isPlayerTurn,
        // };
        // setGame(nGame);
    }

    function handleNewMessage(message: ICommand): void {
        console.log('handling new message', message);

        switch (message.action) {
            case 'INIT': {
                const data = message.data as InitCmd;
                setGame({
                    isPlayerTurn: data.playerTurn,
                    playerSign: data.playerSign,
                    squares: data.squares,
                });
                break;
            }
            case 'MOVE': {
                const data = message.data as MoveCmd;
                const squares = game.squares.slice();
                squares[data.move] = data.playerSign;
                const nGame = {
                    ...game,
                    squares,
                    isPlayerTurn: !game.isPlayerTurn,
                };
                setGame(nGame);
                break;
            }
            default:
                console.log('unrecognisable action:', message);
                return;
        }
    }

    const [game, setGame] = useState(emptyGame());
    const [roomCode, setRoomCode] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure({
        isOpen: roomCode.length !== roomCodeLength,
        // isOpen: true,
    });
    const connectorRef = useRef<ConnectorRefProps>(null);

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
