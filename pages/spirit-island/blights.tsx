import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    Text,
    VStack,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import Layout from '../../features/structural/components/Layout';
import { BlightDisplayCard, BlightName, getAllBlightNames } from '../../features/spirit-island/BlightDisplayCard';
import { randomlyChooseElement } from '../../features/generative/logic/numbers';

function Intro({}: {}) {
    return (
        <Center w={'100vw'} py={3} px={5} backgroundColor={'rgba(0, 0, 0, .1)'}>
            <Center maxW={600} flexDirection={'column'}>
                <Heading as={'h1'}>
                    Randomized Blight cards
                </Heading>
                <Text>
                    This is a utility for the game Spirit Island. This is enable to randomize blight cards when you
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    don't own all the expansions. The base game only comes with 2 blight cards, both of which are quite
                    punishing and gets stale after a few plays.
                    Hence, mixing in other blight cards might make for a more balanced experience. All these information
                    are taken from {' '}
                    <Link href={'https://spiritislandwiki.com/index.php?title=List_of_Blight_Cards'} isExternal>
                        https://spiritislandwiki.com/index.php?title=List_of_Blight_Cards
                        <ExternalLinkIcon mx="2px" />
                    </Link>
                    .
                </Text>
            </Center>
        </Center>
    );
}

function SpiritBlightsPage() {
    const [blights, setBlights] = useState<BlightName[]>(['Healthy']);

    return (
        <Layout>
            <Center>
                <VStack spacing={3} py={5}>
                    <Intro />

                    {/* main display */}
                    <BlightDisplayCard blight={blights[blights.length - 1]} />
                    <HStack>
                        <Button
                            variant={'ghost'}
                            leftIcon={<RepeatIcon />}
                            onClick={() => {
                                setBlights(['Healthy']);
                            }}
                        >
                            Restart
                        </Button>

                        <Button
                            onClick={() => {
                                setBlights(blights => addNewRandomBlight(blights));
                            }}
                        >
                            Reveal a new blight card
                        </Button>
                    </HStack>

                    {/* history section */}
                    <Heading as={'h3'}>History</Heading>
                    <Wrap maxW={'90vw'} justify={'center'}>
                        {blights.map((blight) => {
                            return (<WrapItem key={blight}>
                                <BlightDisplayCard blight={blight} size={'sm'} />
                            </WrapItem>);
                        })}
                    </Wrap>
                </VStack>
            </Center>
        </Layout>
    );
}

function getRandomBlight() {
    return randomlyChooseElement(getAllBlightNames());
}

function addNewRandomBlight(blights: BlightName[]): BlightName[] {
    let maybeBlight: BlightName;
    for (let i = 0; i < 25; i++) {
        maybeBlight = getRandomBlight();
        if (!blights.includes(maybeBlight)) {
            return [...blights, maybeBlight];
        }
    }

    // TODO: throw alert or something
    return [...blights];
}

export default SpiritBlightsPage;
