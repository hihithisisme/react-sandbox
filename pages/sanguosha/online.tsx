import { Center, Flex, Heading } from '@chakra-ui/react';
import OnlineSGS from '../../features/sanguosha/components/OnlineSGS';
import Layout from '../../features/structural/components/Layout';

const OnlineSGSPage = () => {
    return (
        <Layout>
            <Intro />
            <Flex p={5} justify={'center'}>
                <OnlineSGS />
            </Flex>
        </Layout>
    );
};

// OnlineSGSPage.getInitialProps = async () => {
//     return { json: await fetchHeroInfoJson() };
// }

export default OnlineSGSPage;

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