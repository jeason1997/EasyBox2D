'use strict';

let GizmoTool = Editor.require('packages://box2d/gizmos/GizmoTool');
let Circle = GizmoTool.Circle;
let Rect = GizmoTool.Rect;

class BoxShapeGizmo extends Editor.Gizmo {

    onCreateRoot() {

        this.box = new Rect(this._root.group())
            .color('rgba(0,128,255,1)')
            .lineStytle(2)
            .cursorStytle('move')
            ;

        // left up, left down, right up, right down 
        this.lu = new Circle(this.box)
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(3)
            ;
        this.ld = new Circle(this.box)
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(3)
            ;
        this.ru = new Circle(this.box)
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(3)
            ;
        this.rd = new Circle(this.box)
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(3)
            ;

        Editor.GizmosUtils.addMoveHandles(this.box.shape, this.move());
        Editor.GizmosUtils.addMoveHandles(this.lu.shape, this.resize());
        Editor.GizmosUtils.addMoveHandles(this.ld.shape, this.resize());
        Editor.GizmosUtils.addMoveHandles(this.ru.shape, this.resize());
        Editor.GizmosUtils.addMoveHandles(this.rd.shape, this.resize());

        this.lu.visible(false);
        this.ld.visible(false);
        this.ru.visible(false);
        this.rd.visible(false);
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
                if (dx === 0 && dy === 0) {
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
                pos = node.convertToNodeSpaceAR(pos).sub(this.target.offset).mul(2);

                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);
                pos.x = pos.x  < 0 ? -pos.x : pos.x;
                pos.y = pos.y  < 0 ? -pos.y : pos.y;

                this.target.size = pos;
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
        let size = this.target.size;
        let pos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.offset)));

        let p1 = node.convertToWorldSpace(cc.v2(0, 0));
        let p2 = node.convertToWorldSpace(cc.v2(size.x, 0));
        let p3 = node.convertToWorldSpace(cc.v2(0, size.y));

        let w = p1.sub(p2).mag();
        let h = p1.sub(p3).mag();

        this.box.size(w, h);
        this.box.position(pos.x, pos.y);
        this.box.rotate(this.target.node.rotation);
        this.lu.position(-w / 2, h / 2);
        this.ld.position(-w / 2, -h / 2);
        this.ru.position(w / 2, h / 2);
        this.rd.position(w / 2, -h / 2);
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.box.color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)');
        this.lu.visible(true);
        this.ld.visible(true);
        this.ru.visible(true);
        this.rd.visible(true);

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.box.color('rgba(0,128,255,1)');
        this.lu.visible(false);
        this.ld.visible(false);
        this.ru.visible(false);
        this.rd.visible(false);

        this._targetEditing = false;
    }

    visible() {
        return true;
    }
}

module.exports = BoxShapeGizmo;