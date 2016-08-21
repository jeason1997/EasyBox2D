'use strict';

let GizmoTool = Editor.require('packages://box2d/gizmos/GizmoTool');
let Circle = GizmoTool.Circle;

class CircleShapeGizmo extends Editor.Gizmo {

    onCreateRoot() {

        this.bigCircle = new Circle(this._root.group())
            .color('rgba(0,128,255,1)')
            .lineStytle(2)
            .cursorStytle('move')
            ;

        this.smallCircle = new Circle(this.bigCircle)
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(3)
            ;

        Editor.GizmosUtils.addMoveHandles(this.bigCircle.shape, this.move());
        Editor.GizmosUtils.addMoveHandles(this.smallCircle.shape, this.resize());

        this.smallCircle.visible(false);
        this._targetEditing = !this.target.editing;
    }

    move() {
        return {
            start: function (x, y, event) {
                this.pressx = x;
                this.pressy = y;
                this.updated = false;
            }.bind(this),

            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0 || !this.target.editing) {
                    return;
                }
                this.updated = true;

                let node = this.node;
                _Scene.Undo.recordNode(node.uuid);

                let x = this.pressx + dx, y = this.pressy + dy;
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = node.convertToNodeSpaceAR(pos);

                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);

                this.target.offset = pos;
                this._view.repaintHost();
            }.bind(this),

            end: function (event) {
                if (this.updated) {
                    // _Scene.AnimUtils.recordNodeChanged(this.node);
                    _Scene.Undo.commit();
                }
            }.bind(this)
        };
    }

    resize() {
        return {
            start: function (x, y, event) {
                this.pressx = x;
                this.pressy = y;
                this.updated = false;
            }.bind(this),
            
            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0) {
                    return;
                }
                this.updated = true;

                let node = this.node;
                _Scene.Undo.recordNode(node.uuid);

                let x = this.pressx + dx, y = this.pressy + dy;
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = node.convertToNodeSpaceAR(pos).sub(this.target.offset);

                let radius = pos.mag();
                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);

                this.target.radius = Editor.Math.toPrecision(radius, minDifference);
                this._view.repaintHost();
            }.bind(this),

            end: function (event) {
                if (this.updated) {
                    _Scene.Undo.commit();
                }
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
        let r = this.target.radius;
        let pos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.offset)));

        let p1 = node.convertToWorldSpace(cc.v2(0, 0));
        let p2 = node.convertToWorldSpace(cc.v2(r, 0));
        let radius = p1.sub(p2).mag();

        this.bigCircle.radius(radius);
        this.bigCircle.position(pos.x, pos.y);
        this.smallCircle.position(0, radius);
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.bigCircle.color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)');
        this.smallCircle.visible(true);

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.bigCircle.color('rgba(0,128,255,1)');
        this.smallCircle.visible(false);

        this._targetEditing = false;
    }

    visible() {
        return true;
    }
}

module.exports = CircleShapeGizmo;