import { PathArrayAlias, PathCommand } from '@svgdotjs/svg.js';

export default class PathHelper {
    segment: PathCommand[];

    constructor() {
        this.segment = [];
    }

    compile(): PathArrayAlias {
        return this.segment;
    }

    M(x: number, y: number) {
        this.segment.push(['M', x, y]);
        return this;
    }

    m(dx: number, dy: number) {
        this.segment.push(['m', dx, dy]);
        return this;
    }

    L(x: number, y: number) {
        this.segment.push(['L', x, y]);
        return this;
    }

    l(dx: number, dy: number) {
        this.segment.push(['l', dx, dy]);
        return this;
    }

    H(x: number) {
        this.segment.push(['H', x]);
        return this;
    }

    h(dx: number) {
        this.segment.push(['h', dx]);
        return this;
    }

    V(y: number) {
        this.segment.push(['V', y]);
        return this;
    }

    v(dy: number) {
        this.segment.push(['v', dy]);
        return this;
    }

    C(c0x: number, c0y: number, c1x: number, c1y: number, x: number, y: number) {
        this.segment.push(['C', c0x, c0y, c1x, c1y, x, y]);
        return this;
    }

    c(c0dx: number, c0dy: number, c1dx: number, c1dy: number, dx: number, dy: number) {
        this.segment.push(['c', c0dx, c0dy, c1dx, c1dy, dx, dy]);
        return this;
    }

    Q(cx: number, cy: number, x: number, y: number) {
        this.segment.push(['Q', cx, cy, x, y]);
        return this;
    }

    q(cdx: number, cdy: number, dx: number, dy: number) {
        this.segment.push(['q', cdx, cdy, dx, dy]);
        return this;
    }

    S(x0: number, y0: number, x1: number, y1: number) {
        this.segment.push(['S', x0, y0, x1, y1]);
        return this;
    }

    s(dx0: number, dy0: number, dx1: number, dy1: number) {
        this.segment.push(['s', dx0, dy0, dx1, dy1]);
        return this;
    }

    T(x: number, y: number) {
        this.segment.push(['T', x, y]);
        return this;
    }

    t(dx: number, dy: number) {
        this.segment.push(['t', dx, dy]);
        return this;
    }

    z() {
        this.segment.push(['z']);
        return this;
    }
}
