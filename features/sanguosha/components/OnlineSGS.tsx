import { Button, Center, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import OnlineRoom, { useOnlineRoom } from "../../../websocket/OnlineRoom";
import { DrawCmd, InitCmd, SGSAction, ShowCmd, ShowRulerCmd } from "../logic/messages";
import { HeroCard, HeroCards, HeroInfo } from "./SanGuoSha";

export default function OnlineSGS() {
    const roomState = useOnlineRoom();
    const [heroes, setHeroes] = useState<HeroInfo[] | undefined>(undefined);
    const [rulerId, setRulerId] = useState('');
    const [playersSelection, setPlayersSelection] = useState<Record<string, HeroInfo>>({});

    function handleNewMessage(message: any): void {
        console.log('incoming message', message);
        switch (message.action) {
            case SGSAction.INIT_CMD: {
                const { rulerId } = message.data as InitCmd;
                setRulerId(rulerId);
                break;
            }
            case SGSAction.DRAW_CMD: {
                const { heroes } = message.data as DrawCmd;
                setHeroes(heroes);
                break;
            }
            case SGSAction.SHOW_RULER_CMD: {
                const { rulerId, hero } = message.data as ShowRulerCmd;
                // TODO: implement
                setRulerId(rulerId);
                setPlayersSelection({ [rulerId]: hero });
                break;
            }
            case SGSAction.SHOW_CMD: {
                const { playersSelection } = message.data as ShowCmd;
                setPlayersSelection(playersSelection);
                break;
            }
            default:
                console.log('unrecognisable action:', message);
                return;
        }
    }

    function rulerDeclaration() {
        // TODO: implement player names
        roomState.sendWsMessage({
            action: SGSAction.RULER_REQ,
        })
    }

    return (

        <VStack>
            <OnlineRoom handleNewMessage={handleNewMessage} {...roomState} />

            {!rulerId &&
                (
                    <Button onClick={rulerDeclaration}>
                        I'm the Ruler!
                    </Button>
                )
            }
            {/* TODO: implement proper info bar. Idea: Modal that you can expand to see Ruler's Hero */}
            {
                rulerId && Object.keys(playersSelection).length === 1 && (
                    <Center>
                        <Text>{`Ruler is ${rulerId} and he chose ${playersSelection[rulerId].name}`}</Text>
                    </Center>
                )
            }
            {
                Object.keys(playersSelection).length > 1 ? (
                    // TODO: make this arrangement responsive -- or reuse HeroCards
                    Object.entries(playersSelection).map((entry, idx) => {
                        return (
                            <HeroCard key={idx} hero={entry[1]} ownerId={entry[0]} />
                        )
                    })
                ) : (

                    <HeroCards heroes={heroes} interactive sendWsMessage={roomState.sendWsMessage} />
                )
            }

        </VStack>
    )
}