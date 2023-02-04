import { Button, Center, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import OnlineRoom, { useOnlineRoom } from "../../../websocket/OnlineRoom";
import { DrawCmd, InitCmd, SGSAction, ShowCmd, ShowRulerCmd } from "../logic/messages";
import { SGSPlayer } from "../logic/SGSOnlineRoom";
import { HeroCard, HeroCards, HeroInfo } from "./SanGuoSha";

export default function OnlineSGS() {
    const roomState = useOnlineRoom();
    const [heroChoices, setHeroChoices] = useState<HeroInfo[] | undefined>(undefined);
    const [ruler, setRuler] = useState<SGSPlayer | undefined>(undefined);
    const [players, setPlayers] = useState<SGSPlayer[]>([]);

    function handleNewMessage(message: any): void {
        console.log('incoming message', message);
        switch (message.action) {
            case SGSAction.INIT_CMD: {
                const { ruler } = message.data as InitCmd;
                setRuler(ruler);
                break;
            }
            case SGSAction.DRAW_CMD: {
                const { heroes } = message.data as DrawCmd;
                setHeroChoices(heroes);
                break;
            }
            case SGSAction.SHOW_RULER_CMD: {
                const { ruler } = message.data as ShowRulerCmd;
                // TODO: implement
                setRuler(ruler);
                setPlayers([ruler]);
                break;
            }
            case SGSAction.SHOW_CMD: {
                const { players } = message.data as ShowCmd;
                setPlayers(players);
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
            data: {
                rulerUsername: roomState.username,
            }
        })
    }

    function onHeroSubmit(hero: HeroInfo) {
        roomState.sendWsMessage({
            action: SGSAction.SUBMIT_REQ,
            data: {
                hero,
                username: roomState.username,
            },
        });
    }

    return (
        <VStack>
            <OnlineRoom handleNewMessage={handleNewMessage} {...roomState} />

            {!ruler &&
                (
                    <Button onClick={rulerDeclaration}>
                        I'm the Ruler!
                    </Button>
                )
            }
            {/* TODO: implement proper info bar. Idea: Modal that you can expand to see Ruler's Hero */}
            {
                ruler && Object.keys(players).length === 1 && (
                    <Center>
                        <Text>{`Ruler is ${ruler.username} and he chose ${ruler.selectedHero?.name}`}</Text>
                    </Center>
                )
            }

            {
                Object.keys(players).length > 1 ? (
                    // TODO: make this arrangement responsive -- or reuse HeroCards
                    <SimpleGrid spacing={3} columns={{ base: 1, sm: 3 }}>
                        {players.map((player: SGSPlayer, idx: number) => {
                            return (
                                <HeroCard key={idx} hero={player.selectedHero!} ownerUsername={player.username} />
                            )
                        })}
                    </SimpleGrid>
                ) : (
                    <HeroCards heroes={heroChoices} onSubmit={onHeroSubmit} />
                )
            }


        </VStack>
    )
}