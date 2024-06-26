import React from 'react';
import { Image, LinkBox, LinkOverlay } from '@chakra-ui/react';

export function BlightDisplayCard({ blight, size = 'lg' }: { blight: BlightName, size?: 'lg' | 'sm' }) {
    return (<LinkBox width={size == 'sm' ? '150px' : undefined} height={'auto'}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={BLIGHTS[blight].img} objectFit={'contain'} />
        <LinkOverlay href={BLIGHTS[blight].link} isExternal={true} />
    </LinkBox>);
}

export enum IslandStatus {
    HEALTHY = 'healthy',
    STILL_HEALTHY = 'still-healthy',
    BLIGHTED = 'blighted',
}

export const BLIGHTS = {
    'Healthy': {
        link: 'https://spiritislandwiki.com/index.php?title=Healthy_Island',
        img: 'https://user-images.githubusercontent.com/1783159/38713771-da903d8e-3ea0-11e8-8d68-d919360c512c.png',
        status: IslandStatus.HEALTHY,
        blight: 2,
    },
    'Downward Spiral': {
        link: 'https://spiritislandwiki.com/index.php?title=Downward_Spiral',
        img: 'https://spiritislandwiki.com/images/3/3b/Downward_Spiral_%28base%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Memory Fades to Dust': {
        link: 'https://spiritislandwiki.com/index.php?title=Memory_Fades_to_Dust',
        img: 'https://spiritislandwiki.com/images/3/3c/Memory_Fades_to_Dust_%28base%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'A Pall Upon the Land': {
        link: 'https://spiritislandwiki.com/index.php?title=A_Pall_Upon_the_Land',
        img: 'https://spiritislandwiki.com/images/e/ec/A_Pall_Upon_the_Land_%28bc%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Aid from Lesser Spirits': {
        link: 'https://spiritislandwiki.com/index.php?title=Aid_from_Lesser_Spirits',
        img: 'https://spiritislandwiki.com/images/a/a9/Aid_from_Lesser_Spirits_%28bc%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Back Against the Wall': {
        link: 'https://spiritislandwiki.com/index.php?title=Back_Against_the_Wall',
        img: 'https://spiritislandwiki.com/images/3/34/Back_Against_the_Wall_%28bc%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    // 'Disintegrating Ecosystem': {
    //     link: 'https://spiritislandwiki.com/index.php?title=Disintegrating_Ecosystem',
    //     img: 'https://spiritislandwiki.com/images/e/e7/Disintegrating_Ecosystem_%28bc%29.png',
    //     status: IslandStatus.BLIGHTED,
    //     blight: 5,
    // },
    'Erosion of Will': {
        link: 'https://spiritislandwiki.com/index.php?title=Erosion_of_Will',
        img: 'https://spiritislandwiki.com/images/c/cb/Erosion_of_Will_%28bc%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Promising Farmlands': {
        link: 'https://spiritislandwiki.com/index.php?title=Promising_Farmlands',
        img: 'https://spiritislandwiki.com/images/8/81/Promising_Farmlands_%28bc%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'All Things Weaken': {
        link: 'https://spiritislandwiki.com/index.php?title=All_Things_Weaken',
        img: 'https://spiritislandwiki.com/images/7/7e/All_Things_Weaken_%28je%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Invaders Find the Land to Their Liking': {
        link: 'https://spiritislandwiki.com/index.php?title=Invaders_Find_the_Land_to_Their_Liking',
        img: 'https://spiritislandwiki.com/images/3/3b/Invaders_Find_the_Land_to_Their_Liking_%28je%29.png',
        status: IslandStatus.STILL_HEALTHY,
        blight: 5,
    },
    'Power Corrodes the Spirit': {
        link: 'https://spiritislandwiki.com/index.php?title=Power_Corrodes_the_Spirit',
        img: 'https://spiritislandwiki.com/images/3/36/Power_Corrodes_the_Spirit_%28je%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Strong Earth Shatters Slowly': {
        link: 'https://spiritislandwiki.com/index.php?title=Strong_Earth_Shatters_Slowly',
        img: 'https://spiritislandwiki.com/images/6/6a/Strong_Earth_Shatters_Slowly_%28je%29.png',
        status: IslandStatus.STILL_HEALTHY,
        blight: 5,
    },
    'Thriving Communities': {
        link: 'https://spiritislandwiki.com/index.php?title=Thriving_Communities',
        img: 'https://spiritislandwiki.com/images/b/b9/Thriving_Communities_%28je%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Unnatural Proliferation': {
        link: 'https://spiritislandwiki.com/index.php?title=Unnatural_Proliferation',
        img: 'https://spiritislandwiki.com/images/e/e7/Unnatural_Proliferation_%28je%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Untended Land Crumbles': {
        link: 'https://spiritislandwiki.com/index.php?title=Untended_Land_Crumbles',
        img: 'https://spiritislandwiki.com/images/c/c2/Untended_Land_Crumbles_%28je%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Attenuated Essence': {
        link: 'https://spiritislandwiki.com/index.php?title=Attenuated_Essence',
        img: 'https://spiritislandwiki.com/images/2/2e/Attenuated_Essence_%28ni%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Corrodes the Spirit': {
        link: 'https://spiritislandwiki.com/index.php?title=Corrodes_the_Spirit',
        img: 'https://spiritislandwiki.com/images/3/35/Blight_Corrodes_the_Spirit_%28ni%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Burn Brightest Before the End': {
        link: 'https://spiritislandwiki.com/index.php?title=Burn_Brightest_Before_the_End',
        img: 'https://spiritislandwiki.com/images/0/09/Burn_Brightest_Before_the_End_%28ni%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Intensifying Exploitation': {
        link: 'https://spiritislandwiki.com/index.php?title=Intensifying_Exploitation',
        img: 'https://spiritislandwiki.com/images/b/b6/Intensifying_Exploitation_%28ni%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    'Shattered Fragments of Power': {
        link: 'https://spiritislandwiki.com/index.php?title=Shattered_Fragments_of_Power',
        img: 'https://spiritislandwiki.com/images/5/51/Shattered_Fragments_of_Power_%28ni%29.png',
        status: IslandStatus.BLIGHTED,
        blight: 5,
    },
    // 'Slow Dissolution of Will': {
    //     link: 'https://spiritislandwiki.com/index.php?title=Slow_Dissolution_of_Will',
    //     img: 'https://spiritislandwiki.com/images/8/8d/Slow_Dissolution_of_Will_%28ni%29.png',
    //     status: IslandStatus.BLIGHTED,
    //     blight: 5,
    // },
    'The Border of Life and Death': {
        link: 'https://spiritislandwiki.com/index.php?title=The_Border_of_Life_and_Death',
        img: 'https://spiritislandwiki.com/images/c/ca/The_Border_of_Life_and_Death_%28ni%29.png',
        status: IslandStatus.STILL_HEALTHY,
        blight: 5,
    },
    'Thriving Crops': {
        link: 'https://spiritislandwiki.com/index.php?title=Thriving_Crops',
        img: 'https://spiritislandwiki.com/images/5/57/Thriving_Crops_%28ni%29.png',
        status: IslandStatus.STILL_HEALTHY,
        blight: 5,
    },
} as const;

export type BlightName = keyof typeof BLIGHTS;

export function getAllBlightNames(): BlightName[] {
    const blights: BlightName[] = [];
    for (const value in BLIGHTS) {
        blights.push(value as BlightName);
    }
    return blights;
}
