import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Center, Heading, Link, Text } from '@chakra-ui/react';
import { readFile } from 'fs/promises';
import React from 'react';
import SanGuoSha, { HeroInfo } from '../features/sanguosha/components/SanGuoSha';
import Layout from '../features/structural/components/Layout';


const HERO_INFO_JSON_FILEPATH = 'public/static/characters_dump.json';
let heroInfoJson: HeroInfo[];

const SanGuoShaPage = ({ json }: { json: HeroInfo[] }) => {
    return (
        <Layout>
            <Intro />
            <SanGuoSha json={json} />
        </Layout>
    );
};

SanGuoShaPage.getInitialProps = async () => {
    return { json: await fetchHeroInfoJson() };
}

export default SanGuoShaPage;

async function fetchHeroInfoJson(): Promise<HeroInfo[]> {
    if (heroInfoJson === undefined) {
        heroInfoJson = JSON.parse(await readFile(HERO_INFO_JSON_FILEPATH, "utf8"));
    }
    return heroInfoJson;
}


function Intro() {
    return (
        <Center w={'100vw'} py={3} px={5} backgroundColor={'rgba(0, 0, 0, .1)'}>
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