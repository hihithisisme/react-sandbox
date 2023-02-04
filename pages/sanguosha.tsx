import { Center, Flex, Heading } from '@chakra-ui/react';
import SanGuoSha, { HeroInfo } from '../features/sanguosha/components/SanGuoSha';
import { Deck } from '../features/sanguosha/logic/deck';
import Layout from '../features/structural/components/Layout';

const SanGuoShaPage = ({ heroes }: { heroes: HeroInfo[] }) => {
    return (
        <Layout>
            <Intro />
            <Flex p={5}>
                <SanGuoSha heroes={heroes} />
            </Flex>
        </Layout>
    );
};

SanGuoShaPage.getInitialProps = async () => {
    const deck = new Deck();
    await deck.loadDeck();
    return { heroes: deck.draw(3) };
};

export default SanGuoShaPage;

function Intro() {
    return (
        <Center w={'100vw'} py={3} px={5} bg={'blackAlpha.300'}>
            <Center maxW={600} flexDirection={'column'}>
                <Heading as={'h1'} >
                    三国杀 Hero Picker
                </Heading>
                {/* TODO: update the intro */}
                {/* <Text>
                    This is my first attempt as programmatically generative art. Credits to{' '}
                    <Link href={'https://frontend.horse/articles/generative-grids/'} isExternal>
                        this article
                        <ExternalLinkIcon mx="2px" />
                    </Link>{' '}
                    on the tutorial and inspiration.
                </Text> */}
            </Center>
        </Center>
    );
}