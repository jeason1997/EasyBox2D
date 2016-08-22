'use strict';

let GizmoTool = Editor.require('packages://box2d/gizmos/GizmoTool');
let Circle = GizmoTool.Circle;
let Polygon = GizmoTool.Polygon;

class EdgeShapeGizmo extends Editor.Gizmo {

    onCreateRoot() {

        this.edge = new Polygon(this._root.group(), false)
            .color('rgba(0,128,255,1)')
            .lineStytle(2)
            .cursorStytle('pointer', 'stroke')
            ;

        this.points = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            this.points[i] = new Circle(this._root.group())
                .color(null, 'rgba(0,128,255,1)')
                .cursorStytle('pointer')
                .radius(3)
                ;
            Editor.GizmosUtils.addMoveHandles(this.points[i].shape, this.moveOrDeleteVertexe(i));
            this.points[i].visible(false);
        }

        Editor.GizmosUtils.addMoveHandles(this.edge.shape, this.addVertexe());

        this._targetEditing = !this.target.editing;
    }

    moveOrDeleteVertexe(index) {
        return {
            start: function (x, y, event) {
                this.pressx = x;
                this.pressy = y;
                this.updated = false;

                let deleteKeyDown = event.ctrlKey || event.metaKey;
                if (deleteKeyDown) {
                    _Scene.Undo.recordNode(this.node.uuid);

                    let vertexes = this.target.vertexes;
                    Editor.log(index + ' : ' + vertexes[index])
                    vertexes.splice(index, 1);
                    this.points.splice(index, 1);

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
                pos = node.convertToNodeSpaceAR(pos);

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
                this.pressx = x;
                this.pressy = y;

                _Scene.Undo.recordNode(this.node.uuid);

                let canvasSize = cc.view.getCanvasSize();
                y = canvasSize.height - y;

                let p = this.node.convertToNodeSpaceAR(cc.v2(x, y)).sub(this.target.offset);

                let el = event.currentTarget.instance;
                let start = el.startSvgPoint.point.origin;
                let end = el.endSvgPoint.point.origin;

                let vertexes = this.target.vertexes;
                let nextIndex = vertexes.indexOf(start) + 1;

                // allign point to line
                let dx = start.x - end.x;
                let dy = start.y - end.y;
                let u = (p.x - start.x) * (start.x - end.x) + (p.y - start.y) * (start.y - end.y);
                u = u / ((dx * dx) + (dy * dy));

                p.x = start.x + u * dx;
                p.y = start.y + u * dy;

                _Scene.adjustVec2(p);

                this.target.vertexes.splice(nextIndex, 0, p);
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

        let node = this.node;
        let pos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR()));

        let vertexes = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            vertexes[i + 1] = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.vertexes[i])))
        }
        vertexes[0] = new cc.Vec2(vertexes[1].x, pos.y + 100);
        vertexes[vertexes.length] = new cc.Vec2(vertexes[vertexes.length - 1].x, pos.y + 100);

        this.edge.vertexes(vertexes);
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].position(vertexes[i + 1].x, vertexes[i + 1].y);
        }
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.edge.color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)');
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].visible(true);
        }

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.edge.color('rgba(0,128,255,1)');
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].visible(false);
        }

        this._targetEditing = false;
    }

    visible() {
        return true;
    }
}

module.exports = EdgeShapeGizmo;