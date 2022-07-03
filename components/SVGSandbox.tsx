import React, { useEffect } from 'react';
import { Svg, SVG, Timeline } from '@svgdotjs/svg.js';
import { Box, Center } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { randomPalette } from './generative/utils/colours';

function purpleLoadingBars(canvas: Svg, width: number, height: number, elementId: string) {
    canvas.addTo(`#${elementId}`).size(width, height);

    // Create a group and add 5 lines
    const group = canvas.group();
    const lines = [0, 30, 60, 90, 120].map((tx) => group.line(0, 0, 0, 100).x(tx));

    // Move the group to the center and color all lines
    group.center(width / 2, height / 2);
    lines.forEach((line) => line.stroke({ color: '#ccc', width: 10 }));

    // As you can see, with Lists, you can call
    // a method for all members at once
    const timeline = new Timeline();
    lines.forEach((line) => line.timeline(timeline));

    // Lists are Arrays or Array-Like objects and
    // therefore have a forEach method
    lines.forEach((line, i) => {
        line.animate(1000, i * 100, 'absolute')
            .ease('<>')
            .loop(Infinity, true)
            .height(10)
            .dy(45);
    });
}

const palette = randomPalette();

function SVGSandbox({ width, height }: { width: number; height: number }) {
    const canvas: Svg = SVG();
    const elementId = `svg-${uuidv4()}`;
    const padding = 50;

    useEffect(() => {
        purpleLoadingBars(canvas, width - padding, height - padding, elementId);
    }, []);

    return (
        <Center width={width} height={height} background={'purple'}>
            <Box
                id={elementId}
                width={width - padding}
                height={height - padding}
                sx={{
                    shapeRendering: 'crispEdges',
                    '.curve': { shapeRendering: 'geometricPrecision' },
                }}
            />
        </Center>
    );
}

export default SVGSandbox;
