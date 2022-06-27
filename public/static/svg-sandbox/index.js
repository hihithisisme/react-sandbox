/************************************
 This codepen is part of the svg.js
 advent calendar. You can find all
 the pens at twitter: @svg_js
 *************************************/

const width = window.innerWidth - 10;
const height = window.innerHeight - 10;

const canvas = SVG().addTo('body').size(width, height);

// Create a group and add 5 lines
const group = canvas.group();
const lines = new SVG.List([0, 30, 60, 90, 120].map((tx) => group.line(0, 0, 0, 100).x(tx)));

// Move the group to the center and color all lines
group.center(width / 2, height / 2);
lines.stroke({ color: '#ccc', width: 10 });

// As you can see, with Lists, you can call
// a method for all members at once
const timeline = new SVG.Timeline();
lines.timeline(timeline);

// Lists are Arrays or Array-Like objects and
// therefore have a forEach method
lines.forEach((line, i) => {
    line.animate(1000, i * 100, 'absolute')
        .ease('<>')
        .loop(Infinity, true)
        .height(10)
        .y(45);
});
