import { ICommand } from '../tictactoe/commands';
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
} from 'react';
import useWebSocket from 'react-use-websocket';
import { Button, Center, Heading, useClipboard } from '@chakra-ui/react';

interface ConnectorProps {
    roomCode: string;

    handleNewMessage(message: any): void;
}

export interface ConnectorRefProps {
    sendWsMessage(message: ICommand): void;
}

const Connector = forwardRef<ConnectorRefProps, ConnectorProps>(
    (props: ConnectorProps, ref: ForwardedRef<any>) => {
        const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
            buildWsAddress(props.roomCode)
        );
        const { hasCopied, onCopy } = useClipboard(props.roomCode);

        useImperativeHandle(ref, () => ({
            sendWsMessage(message: ICommand) {
                console.log('sending', message);
                sendJsonMessage(message);
            },
        }));

        useEffect(() => {
            if (lastJsonMessage) {
                console.log('message', lastJsonMessage);

                props.handleNewMessage(lastJsonMessage);
            }
        }, [lastJsonMessage]);

        return (
            <Center width={'100%'}>
                {/*<Text>{ReadyState[readyState]}</Text>*/}
                <Heading as={'kbd'}>{props.roomCode}</Heading>
                <Button onClick={onCopy} ml={2}>
                    {hasCopied ? 'Copied' : 'Copy'}
                </Button>
                {/*<Text>{buildWsAddress(code)}</Text>*/}
            </Center>
        );
    }
);
Connector.displayName = 'Connector';

const buildWsAddress = (roomCode: string) => {
    return `ws://${process.env.NEXT_PUBLIC_WS_ADDRESS}?code=${roomCode}`;
};

export default Connector;
