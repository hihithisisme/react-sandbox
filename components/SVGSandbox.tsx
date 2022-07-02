import React, { useEffect } from 'react';
import { Svg, SVG, Timeline } from '@svgdotjs/svg.js';
import { Box, Center } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { randomBool, randomIntFromInterval, randomlyChooseElement } from '../generative-utils/numbers';
import { randomPalette } from '../generative-utils/colours';
import tinycolor from 'tinycolor2';

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

const squareSize = 75;
const palette = randomPalette();

function getTwoColours(palette: string[]) {
    const list = [...palette];
    const firstIndex = randomIntFromInterval(0, list.length - 1);
    const background = list[firstIndex];
    list.splice(firstIndex, 1);
    const foreground = list[randomIntFromInterval(0, list.length - 1)];
    return {
        foreground,
        background,
    };
}

function generativeGrid(canvas: Svg, width: number, height: number, elementId: string) {
    function drawCircle(x: number, y: number, size: number) {
        const { foreground, background } = getTwoColours(palette);
        const group = canvas.group().addClass('circle-block');

        group.rect(size, size).fill(background).move(x, y);
        group.circle(size).fill(foreground).move(x, y).addClass('curve');
        if (randomBool()) {
            group
                .circle(size / randomIntFromInterval(2, 4))
                .fill(background)
                .center(x + size / 2, y + size / 2)
                .addClass('curve');
        }
    }

    function drawQuadrantCircle(x: number, y: number, size: number) {
        const { foreground, background } = getTwoColours(palette);
        const group = canvas.group().addClass('quad-circle-block');
        const circleGroup = canvas.group();
        group.rect(size, size).fill(background).move(x, y);

        const leftOffset = randomBool() ? 0 : size;
        const topOffset = randomBool() ? 0 : size;

        circleGroup
            .circle(size * 2)
            .fill(foreground)
            .center(x + leftOffset, y + topOffset)
            .addClass('curve');

        if (randomBool()) {
            circleGroup
                .circle(size)
                .fill(background)
                .center(x + leftOffset, y + topOffset)
                .addClass('curve');
        }

        const mask = canvas.rect(size, size).fill('#fff').move(x, y);
        // maskWith removes mask from the group and add it as a defs
        circleGroup.maskWith(mask);
    }

    function drawOppositeCircles(x: number, y: number, size: number) {
        const { foreground, background } = getTwoColours(palette);
        const group = canvas.group().addClass('opp-circles-block');
        const circleGroup = canvas.group();
        group.rect(size, size).fill(background).move(x, y);

        const c1 = circleGroup.circle(size).fill(foreground).addClass('curve');
        const c2 = circleGroup.circle(size).fill(foreground).addClass('curve');
        if (randomBool()) {
            c1.center(x, y + size);
            c2.center(x + size, y);
        } else {
            c1.center(x, y);
            c2.center(x + size, y + size);
        }

        const mask = canvas.rect(size, size).fill('#fff').move(x, y);
        // maskWith removes mask from the group and add it as a defs
        circleGroup.maskWith(mask);
        group.add(circleGroup);
    }

    const blockStyles = [drawCircle, drawOppositeCircles, drawQuadrantCircle];

    function generateLittleBlock(i: number, j: number) {
        const x = i * squareSize;
        const y = j * squareSize;
        const style = randomlyChooseElement(blockStyles);
        style(x, y, squareSize);
    }

    function generateBigBlock() {
        const multiplier = randomIntFromInterval(2, 3);
        const bigSquareSize = squareSize * multiplier;
        const x = randomIntFromInterval(0, nRows - multiplier) * squareSize;
        const y = randomIntFromInterval(0, nCols - multiplier) * squareSize;
        const style = randomlyChooseElement(blockStyles);
        style(x, y, bigSquareSize);
    }

    const nRows = randomIntFromInterval(5, 10);
    const nCols = randomIntFromInterval(5, 10);

    canvas
        .addTo(`#${elementId}`)
        .size(width, height)
        .viewbox(`0 0 ${nRows * squareSize} ${nCols * squareSize}`);

    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            generateLittleBlock(i, j);
        }
    }
    generateBigBlock();
}

function generateBackgroundImage(): string {
    const bg = tinycolor.mix(palette[0], palette[1], 50).lighten(20).desaturate(10).toString();
    const bgInner = tinycolor(bg).lighten(10).toString();
    const bgOuter = tinycolor(bg).darken(10).toString();
    return `linear-gradient(${randomIntFromInterval(0, 360)}deg, ${bgInner}, ${bgOuter})`;
}

function SVGSandbox({ width, height }: { width: number; height: number }) {
    const canvas: Svg = SVG();
    const elementId = `svg-${uuidv4()}`;
    const padding = 50;

    useEffect(() => {
        generativeGrid(canvas, width - padding, height - padding, elementId);
    }, []);

    return (
        <Center width={width} height={height} backgroundImage={generateBackgroundImage()}>
            <Box
                id={elementId}
                width={width - padding}
                height={height - padding}
                style={{ shapeRendering: 'crispEdges' }}
                // style={{ shapeRendering: 'geometricPrecision' }}
            />
        </Center>
    );
}

export default SVGSandbox;
