import { Button, Center, Heading, Link, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import Layout from '../../features/structural/components/Layout';
import { BlightDisplayCard } from '../../features/spirit-island/BlightDisplayCard';

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
    return (
        <Layout>
            <Center>
                <VStack spacing={3} py={5}>
                    <Intro />
                    <BlightDisplayCard />
                    <Button
                        leftIcon={<RepeatIcon />}
                    >
                        Setup a new blight card
                    </Button>
                </VStack>
            </Center>
        </Layout>
    );
}

export default SpiritBlightsPage;
