import { Button, Center, Container, Flex, Heading, LinkBox, LinkOverlay, Stack, Text, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { randomPalette } from './generative/utils/colours';
import { RepeatIcon } from '@chakra-ui/icons';
import tinycolor from 'tinycolor2';

export default function CallToActionWithHero() {
    return (
        <Container maxW={'7xl'}>
            <Stack
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}
                direction={{ base: 'column', md: 'row' }}
            >
                <Stack flex={1} spacing={{ base: 5, md: 10 }}>
                    <CTAText />
                    <CTAButton />
                </Stack>
                <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
                    <HeroComponent />
                </Flex>
            </Stack>
        </Container>
    );
}

function Header() {
    return (
        <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
            {/*<Text*/}
            {/*    as={'span'}*/}
            {/*    position={'relative'}*/}
            {/*    _after={{*/}
            {/*        content: "''",*/}
            {/*        width: 'full',*/}
            {/*        height: '30%',*/}
            {/*        position: 'absolute',*/}
            {/*        bottom: 1,*/}
            {/*        left: 0,*/}
            {/*        bg: 'red.400',*/}
            {/*        zIndex: -1,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Just experimenting */}
            {/*</Text>*/}
            {/*<br />*/}
            <Text as={'span'} color={'red.600'}>
                Just experimenting
            </Text>
        </Heading>
    );
}

function CTAText() {
    return (
        <>
            <Header />
            <Text color={'gray.500'}>
                Just playing around with web development. Not really trying to do anything. Something like a playground,
                yeah? Hopefully, I will add more stuff as things go.
            </Text>
        </>
    );
}

function CTAButton() {
    return (
        <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
            <LinkBox>
                <Button
                    rounded={'full'}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                    colorScheme={'red'}
                    bg={'red.400'}
                    _hover={{ bg: 'red.500' }}
                >
                    <LinkOverlay href={'/generative/squiggles'}>Try it out!</LinkOverlay>
                </Button>
            </LinkBox>
        </Stack>
    );
}

const Squiggles = dynamic(() => import('./generative/Squiggles'), {
    ssr: false,
});

function HeroComponent() {
    const [palette, setPalette] = useState(['']);
    useEffect(() => {
        setPalette(randomPalette());
    }, []);
    const textColour = tinycolor(palette[0]).isLight() ? 'black' : 'white';
    return (
        // On creating a squared element with dynamic width
        // https://stackoverflow.com/a/13625843
        // <Box
        //     // bgColor={'teal.100'}
        //     // borderRadius={'10px'}
        //     h={0}
        //     w={{ base: '100%' }}
        //     pb={{ base: '100%' }}
        //     justifyContent={'center'}
        // >
        <Center width={300}>
            <VStack>
                <Squiggles height={300} width={300} palette={palette} />
                <Button
                    backgroundColor={palette[0]}
                    color={textColour}
                    leftIcon={<RepeatIcon />}
                    onClick={() => setPalette(randomPalette())}
                >
                    Refresh
                </Button>
            </VStack>
        </Center>
        // </Box>

        // <>
        //     <Blob
        //         w={'150%'}
        //         h={'150%'}
        //         position={'absolute'}
        //         top={'-20%'}
        //         left={0}
        //         zIndex={-1}
        //         color={useColorModeValue('red.50', 'red.400')}
        //     />
        //     <Box
        //         position={'relative'}
        //         height={'300px'}
        //         rounded={'2xl'}
        //         boxShadow={'2xl'}
        //         width={'full'}
        //         overflow={'hidden'}
        //     >
        //         <Image
        //             alt={'Hero Image'}
        //             fit={'cover'}
        //             align={'center'}
        //             w={'100%'}
        //             h={'100%'}
        //             src={
        //                 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80'
        //             }
        //         />
        //     </Box>
        // </>
    );
}
