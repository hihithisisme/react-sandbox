import React, { useEffect, useState } from 'react';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { Box, Center, IconButton } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { randomBool, randomIntFromInterval, randomlyChooseElement, weightedRandomSample } from './utils/numbers';
import tinycolor from 'tinycolor2';
import { DownloadSimple } from 'phosphor-react';
import { downloadAsSVG } from './utils/export';

const squareSize = 75;

function getTwoColours(palette: string[]) {
    const list = palette.slice(1, 4);
    const background = tinycolor(palette[0]).desaturate(20).toString();
    const foreground = weightedRandomSample(list, [60, 30, 10]);

    return {
        foreground,
        background,
    };
}

function Squiggles({ width, height, palette }: { width: number; height: number; palette: string[] }) {
    const svg: Svg = SVG();
    const elementId = `svg-${uuidv4()}`;

    const [canvas, setCanvas] = useState(svg);

    function generativeGrid(svg: Svg, width: number, height: number, elementId: string, palette: string[]) {
        function drawQuadrantCircle(x: number, y: number, size: number) {
            const { foreground, background } = getTwoColours(palette);
            const group = svg.group().addClass('quad-circle-block');
            const circleGroup = svg.group();
            group.rect(size, size).fill(background).move(x, y);

            const leftOffset = randomBool() ? 0 : size;
            const topOffset = randomBool() ? 0 : size;

            circleGroup
                .circle((size * 4) / 3)
                .fill(foreground)
                .center(x + leftOffset, y + topOffset)
                .addClass('curve');

            circleGroup
                .circle((size * 2) / 3)
                .fill(background)
                .center(x + leftOffset, y + topOffset)
                .addClass('curve');

            const mask = svg.rect(size, size).fill('#fff').move(x, y);
            // maskWith removes mask from the group and add it as a defs
            circleGroup.maskWith(mask);
        }

        function drawOppositeCircles(x: number, y: number, size: number) {
            const { foreground, background } = getTwoColours(palette);
            const group = svg.group().addClass('opp-circles-block');
            const circleGroup = svg.group();
            group.rect(size, size).fill(background).move(x, y);

            const c1 = circleGroup
                .circle((size * 4) / 3)
                .fill(foreground)
                .addClass('curve');
            const c1b = circleGroup
                .circle((size * 2) / 3)
                .fill(background)
                .addClass('curve');
            const c2 = circleGroup
                .circle((size * 4) / 3)
                .fill(foreground)
                .addClass('curve');
            const c2b = circleGroup
                .circle((size * 2) / 3)
                .fill(background)
                .addClass('curve');
            if (randomBool()) {
                c1.center(x, y + size);
                c1b.center(x, y + size);
                c2.center(x + size, y);
                c2b.center(x + size, y);
            } else {
                c1.center(x, y);
                c1b.center(x, y);
                c2.center(x + size, y + size);
                c2b.center(x + size, y + size);
            }

            const mask = svg.rect(size, size).fill('#fff').move(x, y);
            // maskWith removes mask from the group and add it as a defs
            circleGroup.maskWith(mask);
            group.add(circleGroup);
        }

        const blockStyles = [
            drawOppositeCircles,
            drawQuadrantCircle,
            // drawSmallerQuadrantCircles,
        ];

        function generateLittleBlock(i: number, j: number) {
            const x = i * squareSize;
            const y = j * squareSize;
            const style = randomlyChooseElement(blockStyles);
            style(x, y, squareSize);
        }

        function generateBigBlock() {
            const multiplier = randomIntFromInterval(2, 3);
            const bigSquareSize = squareSize * multiplier;
            const x = randomIntFromInterval(0, n - multiplier) * squareSize;
            const y = randomIntFromInterval(0, n - multiplier) * squareSize;
            const style = randomlyChooseElement(blockStyles);
            style(x, y, bigSquareSize);
        }

        const n = randomIntFromInterval(6, 12);

        canvas.remove();
        setCanvas(
            svg
                .addTo(`#${elementId}`)
                .size(width, height)
                .viewbox(`0 0 ${n * squareSize} ${n * squareSize}`)
        );

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                generateLittleBlock(i, j);
            }
        }
        // generateBigBlock();
    }

    useEffect(() => {
        generativeGrid(svg, width, height, elementId, palette);
    }, [palette]);

    const downloadButtonSize = 7;
    const backgroundColour = tinycolor(palette[0]).desaturate(20).toString();
    const contrastColour = tinycolor(backgroundColour).isLight() ? 'black' : 'white';

    return (
        <Center width={width} height={height}>
            <Box
                id={elementId}
                position={'relative'}
                width={width}
                height={height}
                sx={{
                    shapeRendering: 'crispEdges',
                    '.curve': { shapeRendering: 'geometricPrecision' },
                }}
            >
                <IconButton
                    position={'absolute'}
                    right={0}
                    roundedTop={0}
                    bottom={-downloadButtonSize}
                    width={downloadButtonSize}
                    height={downloadButtonSize}
                    backgroundColor={backgroundColour}
                    color={contrastColour}
                    aria-label={'Download Squiggles SVG'}
                    icon={<DownloadSimple weight={'bold'} />}
                    onClick={() => downloadAsSVG(canvas.svg())}
                    _hover={{ background: backgroundColour, color: contrastColour }}
                />
            </Box>
        </Center>
    );
}

export default Squiggles;
