import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Center, Heading, Link, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import tinycolor from 'tinycolor2';
import { generateBackgroundImage, randomPalette } from '../../features/generative/logic/colours';
import Layout from '../../features/structural/components/Layout';

const DynamicComponent = dynamic(() => import('../../features/generative/components/Squiggles'), {
    ssr: false,
});

function Intro({ textColour }: { textColour: string }) {
    return (
        <Center w={'100vw'} py={3} px={5} backgroundColor={'rgba(0, 0, 0, .1)'}>
            <Center maxW={600} flexDirection={'column'}>
                <Heading as={'h1'} color={textColour}>
                    Squiggles
                </Heading>
                <Text color={textColour}>
                    This is my first attempt as programmatically generative art. Credits to{' '}
                    <Link href={'https://frontend.horse/articles/generative-grids/'} isExternal>
                        this article
                        <ExternalLinkIcon mx="2px" />
                    </Link>{' '}
                    on the tutorial and inspiration.
                </Text>
            </Center>
        </Center>
    );
}

function SquigglesPage() {
    const size = useBreakpointValue({ base: 300, md: 700 }, 'base')!;
    const [palette, setPalette] = useState(['']);
    useEffect(() => {
        setPalette(randomPalette());
    }, []);

    const textColour = tinycolor(palette[0]).isLight() ? 'black' : 'white';
    return (
        <Layout background={generateBackgroundImage(palette[0])}>
            <Center>
                <VStack spacing={3} py={5}>
                    <Intro textColour={textColour} />
                    <DynamicComponent height={size} width={size} palette={palette} />
                    <Button
                        backgroundColor={palette[0]}
                        color={textColour}
                        leftIcon={<RepeatIcon />}
                        onClick={() => setPalette(randomPalette())}
                        _hover={{ background: palette[0], color: textColour }}
                    >
                        Refresh
                    </Button>
                </VStack>
            </Center>
        </Layout>
    );
}

export default SquigglesPage;
