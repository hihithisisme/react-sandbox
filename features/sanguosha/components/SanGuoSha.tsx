import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Divider, Flex, Heading, Image, Link, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { randomlyChooseElement } from "../../generative/logic/numbers";

interface AbilityInfo {
    title: string;
    description: string;
}

export interface HeroInfo {
    name: string;
    url: string;
    imgUrl: string;
    // abilityText: string;
    ability: AbilityInfo[]
}

function HeroDisplay({ hero }: { hero: HeroInfo }) {
    return (
        <VStack p={5} rounded={10} borderWidth={2} shadow='md' spacing={3} bg={'blackAlpha.50'}        >
            <Heading as='h2'>
                <Link href={hero.url} isExternal>
                    {hero.name}
                    <ExternalLinkIcon mx={2} />
                </Link>
            </Heading>
            <Image src={hero.imgUrl} w='80%' />
            {
                hero.ability.map((a) => {
                    return (
                        <>
                            <Divider />
                            <Heading as={'h3'} size={'sm'}>{a.title}</Heading>
                            <Text>{a.description}</Text>
                        </>
                    )
                })
            }
        </VStack>
    )
}

// TODO: shift functionality to websockets + cookies
// TODO: add in a replace hero functionality
// TODO: add in a I'm a ruler button to show the ruler cards
function ThreeHeroDisplay({ json }: { json: HeroInfo[] }) {
    const [heroes, setHeroes] = useState<HeroInfo[] | undefined>(undefined);

    useEffect(() => {
        setHeroes(Array('', '', '').map(() => randomlyChooseElement(json)));
    }, [json]);

    return (
        <>
            {
                !heroes ? (<Spinner />) : (
                    <SimpleGrid spacing={3}
                        columns={{ base: 1, sm: 3 }}
                    >
                        {heroes.map(hero => <HeroDisplay hero={hero} />)}
                    </SimpleGrid>
                )
            }
        </>

    )
}

export default function SanGuoSha({ json }: { json: HeroInfo[] }) {
    return (
        <Flex p={5}>
            <ThreeHeroDisplay json={json} />
        </Flex>
    )
}