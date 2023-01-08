import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Heading, Image, Link, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { randomlyChooseElement } from "../../generative/logic/numbers";

// const HERO_HEIGHT = '500px';

export interface HeroInfo {
    name: string;
    url: string;
    imgUrl: string;
    abilityText: string;
}

// TODO: convert into Cards
function HeroDisplay({ hero }: { hero: HeroInfo }) {
    return (
        <VStack bg='tomato' spacing={3} py={3} px={5}>
            <Heading as='h2'>
                <Link href={hero.url} isExternal>
                    {hero.name}
                    <ExternalLinkIcon mx={2} />
                </Link>
            </Heading>
            <Image src={hero.imgUrl} w={'80%'} />
            {/* TODO: use yuxuan's regex to parse the character ability heading from description */}
            <Text>
                {hero.abilityText}
            </Text>
        </VStack>
    )
}

function ThreeHeroDisplay({ json }: { json: HeroInfo[] }) {
    const [heroes, setHeroes] = useState<HeroInfo[] | undefined>(undefined);

    useEffect(() => {
        setHeroes(Array('', '', '').map(() => randomlyChooseElement(json)));
    }, [json]);

    return (
        <>
            {
                !heroes ? (<Spinner />) : (
                    <SimpleGrid columns={1} spacing={4}>
                        {heroes.map(hero => <HeroDisplay hero={hero} />)}
                    </SimpleGrid>
                )
            }
        </>

    )
}

export default function SanGuoSha({ json }: { json: HeroInfo[] }) {
    return (
        <Box p={5} bg='gray.400'>
            <ThreeHeroDisplay json={json} />
        </Box>
    )
}