import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { G, SVG } from '@svgdotjs/svg.js';
import { v4 as uuidv4 } from 'uuid';
import { makeNoise2D } from 'open-simplex-noise';
import tinycolor from 'tinycolor2';
import useResize from '../../structural/logic/useResize';
import PathHelper from '../logic/svgPath';
import { randomIntFromInterval } from '../logic/numbers';
import IterativeControls from './IterativeControls';

/* TODO: consider making this into DesertNight instead
 *  - shadows
 *  - more pointy tops (perhaps play with distance between end point and control point)
 *  - more sky variations -- translucent cloud, moon, lights from different angles, smoke
 *  - animation -- snow falling / star twinking / between transitions
 *  - focal point (another dune? or perhaps camels?)
 * */
export default function Waves({ palette, height, width }: { palette: string[]; height: string; width: string }) {
    const elementId = `svg-${uuidv4()}`;

    const ref = useRef(null);
    const { width: w, height: h } = useResize(ref);

    const [canvas] = useState(SVG());
    const [seed, setSeed] = useState(Math.random() * 100000);
    const [noiseInt, setNoiseInt] = useState(0.5);
    const [n, setN] = useState(5);
    const [noiseAmp, setNoiseAmp] = useState(50);

    const noise = useCallback(
        (x: number, y: number) => {
            return ((makeNoise2D(seed)(x, y) + 1) / 2) * (noiseAmp * 2) - noiseAmp;
        },
        [seed, noiseAmp]
    );

    useEffect(() => {
        if (w !== 0 && h !== 0) {
            canvas.addTo(`#${elementId}`).viewbox(`0 0 ${w} ${h}`);
            setNoiseAmp(h * 0.1);
        }
    }, [w, h]);

    function drawWave(
        yOff: number,
        noiseOffset: number,
        segW: number,
        fillColour: string,
        direction: 'top' | 'bottom' = 'bottom',
        group?: G
    ) {
        const path = new PathHelper();
        if (direction === 'top') {
            path.M(0, yOff + noise(noiseOffset, 0));
        } else if (direction === 'bottom') {
            path.M(0, h - yOff - noise(noiseOffset, 0));
        }
        noiseOffset = noiseOffset + noiseInt;

        for (let i = 0; i < n; i++) {
            if (i === 0) {
                path.c(
                    segW,
                    noise(noiseOffset, 0),
                    segW * 2,
                    noise(noiseOffset + noiseInt, 0),
                    segW * 3,
                    noise(noiseOffset + noiseInt * 2, 0)
                );
                noiseOffset = noiseOffset + noiseInt * 3;
            } else {
                path.s(segW * 2, noise(noiseOffset, 0), segW * 3, noise(noiseOffset + noiseOffset, 0));
                noiseOffset = noiseOffset + noiseInt * 2;
            }
        }

        if (direction === 'top') {
            path.L(w, 0).L(0, 0).z();
        } else if (direction === 'bottom') {
            path.L(w, h).L(0, h).z();
        }

        const g = group || canvas.group();
        return g.path(path.compile()).fill(fillColour);
    }

    function drawStars(vOffset: number, segW: number) {
        const stars = canvas.group();
        for (let i = 0; i < 300; i++) {
            stars
                .circle(randomIntFromInterval(1, 4))
                .fill('rgba(255, 255, 255, 0.4)')
                // .stroke('black')
                .move(randomIntFromInterval(0, w), randomIntFromInterval(0, h));
        }
        let mask = canvas.group();
        mask.rect(w, h).fill('#fff');
        drawWave(vOffset * 3, noiseInt * 87, segW, '#000', 'bottom', mask);
        stars.maskWith(mask);
    }

    useEffect(() => {
        const vOffset = 100;

        function staticDraw(palette: string[]) {
            canvas.children().forEach((value) => value.remove());
            const segW = w / 3 / n;
            drawWave(vOffset * 3, noiseInt * 87, segW, palette[2]);
            drawWave(vOffset * 2, noiseInt * 31, segW, palette[1]);
            drawWave(vOffset, noiseInt * 6, segW, palette[0]);

            drawStars(vOffset, segW);
        }

        staticDraw(palette);
    }, [palette, w, h, noiseInt, seed, n, noiseAmp]);

    return (
        <Box
            background={`radial-gradient(circle at bottom, ${tinycolor('#423278')
                .lighten(25)
                .toString()}, #423278 70%, #423278)`}
        >
            <Box id={elementId} ref={ref} height={height} width={width} />
            {/* TODO: consider using useMediaQuery to get initial default values */}
            <IterativeControls
                controls={[
                    {
                        name: 'Re-seed',
                        type: 'button',
                        setterFunc: () => setSeed(Math.random() * 100000),
                    },
                    {
                        name: 'noise',
                        type: 'slider',
                        setterFunc: (v) => setNoiseInt(v),
                        min: 0.01,
                        max: 1,
                        step: 0.01,
                        defaultValue: 0.5,
                    },
                    {
                        name: 'noise amplitude',
                        type: 'slider',
                        setterFunc: (v) => setNoiseAmp(v),
                        min: 10,
                        max: 150,
                        step: 10,
                        defaultValue: 50,
                    },
                    {
                        name: '# of waves',
                        type: 'slider',
                        setterFunc: (v) => setN(v),
                        min: 1,
                        max: 20,
                        step: 1,
                        defaultValue: 5,
                    },
                ]}
            />
        </Box>
    );
}
