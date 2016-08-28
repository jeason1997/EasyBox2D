'use strict';

class Shape {

    constructor(parent) {
        this.parent = parent;
        this.children = new Array();
        this.isRoot = false;
        this._position = [0, 0];
        this._rotate = 0;
        this._scale = 1;
        this._visible = true;

        if (parent.root !== undefined) {
            this.root = parent.root.group();
            parent.children.push(this);
        }
        else {
            this.isRoot = true;
            this.root = parent.group();
        }
    }

    position(x, y) {
        this._position = [x, y];
        this.root.move(x, y);
        return this;
    }

    rotate(angle) {
        this._angle = angle;
        this.root.rotate(angle);
        return this;
    }

    scale(s) {
        this._scale = s;
        this.root.scale(s);
        return this;
    }

    color(lineColor, fillColor) {
        this.shape.stroke(lineColor === null ? 'none' : { color: lineColor });
        this.shape.fill(fillColor === null ? 'none' : { color: fillColor });
        return this;
    }

    lineStytle(lineWidth) {
        this.shape.attr({
            'stroke-width': lineWidth,
        });
        return this;
    }

    cursorStytle(cursorType, pointerArea) {
        this.shape.attr({
            'cursor': cursorType,            
            'pointer-events': pointerArea,
        });
        return this;
    }

    visible(v) {
        this._visible = v;
        if (v)
            this.shape.show();
        else
            this.shape.hide();
        return this;
    }

    _resize(anchor) {
        if (!this.isRoot)
            this.shape.center(this.parent.shape.cx(), this.parent.shape.cy());
        else
            this.shape.center(0, 0);

        this.children.forEach(function (child) {
            child.shape.center(child.parent.shape.cx(), child.parent.shape.cy());
        }, this);
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
        this._resize();
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
        this._resize();
        return this;
    }
}

class Polygon extends Shape {

    constructor(parent, close) {
        super(parent);

        this._vertexes = '0,0 -50,50 50,50';
        this.shape = close ? this.root.polygon(this._vertexes) : this.root.polyline(this._vertexes).fill('none').stroke({ width: 1 });
    }

    // 多边形的中心点为了方便起见，就设置为第一个点的位置
    _resize(anchor) {
        //if (!this.isRoot)
        //    this.shape.center(this.parent.shape.cx(), this.parent.shape.cy());
        //else
        //    this.shape.center(0, 0);

        this.children.forEach(function (child) {
            child.shape.center(child.parent.shape.cx(), child.parent.shape.cy());
        }, this);
    }

    vertexes(vs) {
        let _v = '';
        vs.forEach(function(v) {
            _v += v.x + ',' + v.y + ' ';
        }, this);
        this._vertexes = _v;
        this.shape.plot(_v);
        this._resize();
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
        this._resize();
        return this;
    }
}

class Line extends Shape {

    constructor(parent) {
        super(parent);

        this._start = [0, 0];
        this._end = [100, 100],
        this.shape = this.root.line(0, 0, 100, 100);
    }

    // 跟多边形一样，线段的中心点就是第一个点的位置，而不去矫正
    _resize(anchor) {
        //if (!this.isRoot)
        //    this.shape.center(this.parent.shape.cx(), this.parent.shape.cy());
        //else
        //    this.shape.center(0, 0);

        this.children.forEach(function (child) {
            child.shape.center(child.parent.shape.cx(), child.parent.shape.cy());
        }, this);
    }

    line(start, end) {
        this._start = start;
        this._end = end;
        this.shape.plot(start.x, start.y, end.x, end.y);
        this._resize();
        return this;
    }

}

module.exports.Circle = Circle;
module.exports.Rect = Rect;
module.exports.Polygon = Polygon;
module.exports.Path = Path;
module.exports.Line = Line;

