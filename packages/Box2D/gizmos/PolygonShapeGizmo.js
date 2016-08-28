'use strict';

let GizmoTool = Editor.require('packages://box2d/gizmos/GizmoTool');
let Circle = GizmoTool.Circle;
let Polygon = GizmoTool.Polygon;
let Line = GizmoTool.Line;

class PolygonShapeGizmo extends Editor.Gizmo {

    onCreateRoot() {

        this.fillArea = new Polygon(this._root.group(), true)
            .color(null, 'rgba(0,128,255,0.2)')
            .cursorStytle('move', 'fill')
            ;


        this.lines = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            this.lines[i] = new Line(this._root.group())
                .color('rgba(0,128,255,1)')
                .lineStytle(2)
                .cursorStytle('pointer')
                ;
            Editor.GizmosUtils.addMoveHandles(this.lines[i].shape, this.addVertexe());
        }

        this.points = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            this.points[i] = new Circle(this._root.group())
                .color(null, 'rgba(0,128,255,1)')
                .cursorStytle('pointer')
                .radius(3)
                ;
            Editor.GizmosUtils.addMoveHandles(this.points[i].shape, this.moveOrDeleteVertexe());
        }


        this._targetEditing = !this.target.editing;
    }

    moveOrDeleteVertexe(index) {
        return {
            start: function (x, y, event) {

                this.pressx = x;
                this.pressy = y;
                this.updated = false;

                let el = event.currentTarget.instance;
                index = -1;
                for (let i = 0; i < this.points.length; ++i) {
                    if (this.points[i].shape === el) {
                        index = i;
                        break;
                    }
                }

                let deleteKeyDown = event.ctrlKey || event.metaKey;
                if (deleteKeyDown) {
                    _Scene.Undo.recordNode(this.node.uuid);

                    let vertexes = this.target.vertexes;
                    vertexes.splice(index, 1);
                    this.points[0].visible(false)
                    this.points.splice(0, 1);
                    this.lines[0].visible(false);
                    this.lines.splice(0, 1);

                    this._view.repaintHost();
                    return;
                }
            }.bind(this),

            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0) {
                    return;
                }
                this.updated = true;

                let deleteKeyDown = event.ctrlKey || event.metaKey;
                if (deleteKeyDown) {
                    return;
                }

                let node = this.node;
                _Scene.Undo.recordNode(node.uuid);

                let x = this.pressx + dx, y = this.pressy + dy;
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = node.convertToNodeSpaceAR(pos).sub(this.target.offset);

                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);

                this.target.vertexes[index] = pos;
                this._view.repaintHost();
            }.bind(this),

            end: function (event) {
                if (this.updated) {
                    _Scene.Undo.commit();
                }
            }.bind(this)
        };
    }

    addVertexe() {
        return {
            start: function (x, y, event) {
                _Scene.Undo.recordNode(this.node.uuid);

                let canvasSize = cc.view.getCanvasSize();
                y = canvasSize.height - y;
                let pos = this.node.convertToNodeSpaceAR(cc.v2(x, y)).sub(this.target.offset);
                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);

                let el = event.currentTarget.instance;
                let vertexes = this.target.vertexes;
                let nextIndex = -1;
                for (let i = 0; i < this.lines.length; ++i) {
                    if (this.lines[i].shape === el) {
                        nextIndex = i + 1;
                        break;
                    }
                }

                let newLine = new Line(this._root.group())
                    .color('rgba(0,128,255,1)')
                    .lineStytle(2)
                    .cursorStytle('pointer')
                    ;
                Editor.GizmosUtils.addMoveHandles(newLine.shape, this.addVertexe());
                this.lines.push(newLine);

                let newPoint = new Circle(this._root.group())
                    .color(null, 'rgba(0,128,255,1)')
                    .cursorStytle('pointer')
                    .radius(3)
                    ;
                Editor.GizmosUtils.addMoveHandles(newPoint.shape, this.moveOrDeleteVertexe());
                this.points.push(newPoint);

                this.target.vertexes.splice(nextIndex, 0, pos);

                this._view.repaintHost();
            }.bind(this),

            update: function (dx, dy, event) {
            }.bind(this),

            end: function (event) {
            }.bind(this)
        };
    }

    onUpdate() {
        if (this.target.editing) {
            this.enterEditing();
        }
        else {
            this.leaveEditing();
        }

        if (this.target.vertexes.length <= 0)
            return;

        let node = this.node;
        let pos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.offset)));

        let vertexes = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            vertexes[i] = Editor.GizmosUtils.snapPixelWihVec2(
                this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.vertexes[i].add(this.target.offset))));
        }

        this.fillArea.vertexes(vertexes);
        for (let i = 0; i < this.lines.length - 1; ++i) {
            this.lines[i].line(vertexes[i], vertexes[i + 1]);
        }
        this.lines[this.lines.length - 1].line(vertexes[0], vertexes[vertexes.length - 1]);        
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].position(vertexes[i].x, vertexes[i].y);
        }
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.fillArea.visible(true);
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].visible(true);
        }

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.fillArea.visible(false);
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].visible(false);
        }

        this._targetEditing = false;
    }

    visible() {
        return true;
    }
}

module.exports = PolygonShapeGizmo;