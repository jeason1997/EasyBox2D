'use strict';

class Shape {

    constructor(parent) {
        this.parent = parent;
        if (parent.root !== undefined) {
            this.parent = parent.root;
            parent.children.push(this);
        }
        this.children = new Array();
        this.root = this.parent.group();
        this._position = [0, 0];
    }

    position(x, y) {
        this._position = [x, y];
        this.root.move(x, y);
        return this;
    }

    rotate(angle) {
        this.shape.rotate(angle);
        this.children.forEach(function (child) {
            child.rotate(angle);
        }, this);
        return this;
    }

    scale(s) {
        this.root.scale(s);
        return this;
    }

    color(lineColor, fillColor) {
        this.shape.attr({
            stroke: lineColor.rgb,
            'stroke-opacity': lineColor.a,
        });
        if (fillColor !== undefined) {
            this.shape.attr({
                fill: fillColor.rgb,
                'fill-opacity': fillColor.a,
            });
        }
        return this;
    }

    stytle(lineWidth) {
        this.shape.attr({
            'stroke-width': lineWidth,
            'cursor': 'pointer',
        });
        return this;
    }

    onClick(callback) {
        this.shape.on('click', callback.bind(this));
        return this;
    }

    onMousedown(callback) {
        this.shape.on('mousedown', callback.bind(this));
        return this;
    }

    onMouseup(callback) {
        this.shape.on('mouseup', callback.bind(this));
        return this;
    }

    onMousemove(callback) {
        this.shape.on('mousemove', callback.bind(this));
        return this;
    }

    onMouseover(callback) {
        this.shape.on('mouseover', callback.bind(this));
        return this;
    }

    onMouseout(callback) {
        this.shape.on('mouseout', callback.bind(this));
        return this;
    }
}

class Circle extends Shape {

    constructor(parent) {
        super(parent);

        this._radius = 100;
        this.shape = this.root.circle(this._radius);
    }

    radius(radius) {
        this._radius = radius;
        this.shape.radius(radius);
        return this;
    }
}

class Rect extends Shape {

    constructor(parent) {
        super(parent);

        this._size = [100, 100];
        this.shape = this.root.rect(this._size[0], this._size[1]);
    }

    size(w, h) {
        this._size = [w, h];
        this.shape.width(w);
        this.shape.height(h);
        return this;
    }
}

class Polygon extends Shape {

    constructor(parent, close) {
        super(parent);

        this._vectors = '0,0 -50,50 50,50';
        this.shape = close ? this.root.polygon(this._vectors) : this.root.polyline(this._vectors).fill('none').stroke({ width: 1 });
    }

    vectors(v) {
        this._vectors = v;
        this.shape.plot(v);
        return this;
    }
}

class Path extends Shape {

    constructor(parent) {
        super(parent);

        this._path = 'M100,200L300,400';
        this.shape = this.root.path(this._path);
    }

    path(v) {
        this._path = v;
        this.shape.plot(v);
        return this;
    }
}