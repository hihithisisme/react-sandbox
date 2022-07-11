import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import tinycolor from 'tinycolor2';

const DynamicComponent = dynamic(() => import('../../components/generative/Waves'), {
    ssr: false,
});

// TODO: curator palettes for the layered wave page
const oceanPalette = ['#edc9af', '#fff5ee', '#a0e2bd', '#53cbcf', '#0da3ba', '#046e94'];
const sandPalette = ['#f5f5dd', '#ece7ca', '#e3d8b7', '#dacaa4', '#d1bb91', '#c8ad7e'];

function WavesPage() {
    // const size = useBreakpointValue({ base: 300, md: 700 }, 'base')!;
    const [palette, setPalette] = useState(sandPalette);

    const textColour = tinycolor(palette[0]).isLight() ? 'black' : 'white';
    return (
        <Layout>
            {/*<Center>*/}
            {/*<VStack spacing={3} py={5}>*/}
            {/*<Intro textColour={textColour} />*/}
            <DynamicComponent height={'calc(100vh - 60px)'} width={'100%'} palette={palette} />
            {/*<Button*/}
            {/*    backgroundColor={palette[0]}*/}
            {/*    color={textColour}*/}
            {/*    leftIcon={<RepeatIcon />}*/}
            {/*    onClick={() => setPalette(randomPalette())}*/}
            {/*    _hover={{ background: palette[0], color: textColour }}*/}
            {/*>*/}
            {/*    Refresh*/}
            {/*</Button>*/}
            {/*</VStack>*/}
            {/*</Center>*/}
        </Layout>
    );
}

export default WavesPage;
