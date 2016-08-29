'use strict';

let GizmoTool = Editor.require('packages://box2d/gizmos/GizmoTool');
let Circle = GizmoTool.Circle;
let Line = GizmoTool.Line;

class DistanceJoint extends Editor.Gizmo {

    onCreateRoot() {

        this.line = new Line(this._root.group())
            .color('rgba(0,128,255,1)')
            .lineStytle(2)
            ;
        this.line_local = new Line(this._root.group())
            .color('rgba(127,229,127,1)')
            .lineStytle(2)
            ;
        this.line_target = new Line(this._root.group())
            .color('rgba(127,229,127,1)')
            .lineStytle(2)
            ;

        this.local_circle = new Circle(this._root.group())
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(4)
            ;
        this.target_circle = new Circle(this._root.group())
            .color(null, 'rgba(0,128,255,1)')
            .cursorStytle('pointer')
            .radius(4)
            ;

        Editor.GizmosUtils.addMoveHandles(this.local_circle.shape, this.move('local'));
        Editor.GizmosUtils.addMoveHandles(this.target_circle.shape, this.move('target'));        

        this._targetEditing = false;
    }

    move(handle) {
        return {
            start: function (x, y, event) {
                this.pressx = x;
                this.pressy = y;
                this.updated = false;
            }.bind(this),

            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0 || !this._targetEditing) {
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

                if (handle === 'local')
                    this.target.localAnchor = pos;
                else if (handle === 'target')
                    this.target.targetAnchor = pos;
                
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
        if (!this._targetEditing) {
            this.enterEditing();
        }

        let localNode = this.node;
        let targetNode = this.target.targetBody.node;
        let localAnchor = this.target.localAnchor;
        let targetAnchor = this.target.targetAnchor;

        let localNodePos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(localNode.convertToWorldSpaceAR()));
        let targetNodePos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(targetNode.convertToWorldSpaceAR()));
        localAnchor = localAnchor.add(localNodePos);
        targetAnchor = targetAnchor.add(targetNodePos);

        this.line.line(localAnchor, targetAnchor);
        this.line_local.line(localNodePos, localAnchor);
        this.line_target.line(targetNodePos, targetAnchor);
        this.local_circle.position(localAnchor.x, localAnchor.y);
        this.target_circle.position(targetAnchor.x, targetAnchor.y);
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.local_circle.visible(true);
        this.target_circle.visible(true);        

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.local_circle.visible(false);
        this.target_circle.visible(false);   

        this._targetEditing = false;
    }

    visible() {
        return true;
    }

    hide () {
        Editor.Gizmo.prototype.hide.call(this);
        this.leaveEditing();
    }
}

module.exports = DistanceJoint;