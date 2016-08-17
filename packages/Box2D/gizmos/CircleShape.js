'use strict';

let Tools = Editor.require('app://editor/page/gizmos/elements/tools');

let snapPixel = Editor.GizmosUtils.snapPixel;
let snapPixelWihVec2 = Editor.GizmosUtils.snapPixelWihVec2;

let ToolType = {
    None: 0,
    Side: 1,
    Center: 2
};

class CircleShape extends Editor.Gizmo {
    onCreateRoot () {
        let startOffset;
        let startRadius;
        let pressx, pressy;
        let updated;

        this.createTool({
            start: (type, x, y) => {
                startOffset = this.target.offset;
                startRadius = this.target.radius;
                pressx = x;
                pressy = y;
                updated = false;
            },

            update: (type, dx, dy) => {
                if (dx === 0 && dy === 0) {
                    return;
                }
                updated = true;

                let node = this.node;
                _Scene.Undo.recordNode( node.uuid );

                if (type === ToolType.Center) {
                    dy = -dy;

                    let t = cc.affineTransformClone( node.getWorldToNodeTransform() );
                    t.tx = t.ty = 0;
                    
                    let d = cc.v2(cc.pointApplyAffineTransform(dx, dy, t)).add(startOffset);
                    this.target.offset = _Scene.adjustVec2(d);
                }
                else {
                    let canvasSize = cc.view.getCanvasSize();
                    let o = node.convertToNodeSpaceAR(cc.v2(pressx + dx, canvasSize.height - pressy - dy));
                    let d = o.sub(startOffset).mag();
                    this.target.radius = Editor.Math.toPrecision(d);
                }

                this._view.repaintHost();
            },

            end: () => {
                if (updated) {
                    _Scene.AnimUtils.recordNodeChanged(this.node);
                    _Scene.Undo.commit();    
                }
            }
        });
    }

    createTool (callbacks) {
        let root = this._root;
        let circle;
        let sidePointGroup;
        let lp, tp, rp, bp;     // size sides points
        let dragArea;           // center drag area

        function creatToolCallbacks (type) {
            return {
                start: function ( x, y, event ) {
                    callbacks.start.call(root, type, x, y, event);
                },
                update: function ( dx, dy, event ) {
                    callbacks.update.call(root, type, dx, dy, event);
                },
                end: function ( event ) {
                    callbacks.end.call(root, type, event);
                }
            };
        }

        function createSidePoint (svg, cursor) {
            return Tools.circleTool(svg, 5, {color: '#7fc97a'}, null, creatToolCallbacks(ToolType.Side))
                .style( 'cursor', cursor );
        }

        // init center drag area
        root.dragArea = dragArea = root.circle('0,0,0,0,0,0')
            .fill( { color: 'rgba(0,128,255,0.2)' } )
            .stroke('none')
            .style( 'pointer-events', 'fill' )
            .style('cursor', 'move')
            .hide()
            ;

        Editor.GizmosUtils.addMoveHandles( dragArea, creatToolCallbacks(ToolType.Center) );

        // init circle
        circle = root.circle = Tools.circleTool(root, 0, null, {color: '#7fc97a'}, creatToolCallbacks(ToolType.Side));
        circle.style( 'pointer-events', 'none' );

        // init sides points
        sidePointGroup = root.sidePointGroup = root.group();
        sidePointGroup.hide();

        lp = createSidePoint(sidePointGroup, 'col-resize');
        tp = createSidePoint(sidePointGroup, 'row-resize');
        rp = createSidePoint(sidePointGroup, 'col-resize');
        bp = createSidePoint(sidePointGroup, 'row-resize');

        // set bounds
        root.plot =  (pos, radius) => {
            circle.radius(radius).center(pos.x, pos.y);
            dragArea.radius(radius).center(pos.x, pos.y);

            if (this._targetEditing) {
                lp.center(pos.x - radius, pos.y);
                tp.center(pos.x, pos.y + radius);
                rp.center(pos.x + radius, pos.y);
                bp.center(pos.x, pos.y - radius);
            }
        };
    }

    onUpdate () {
        if (this.target.editing) {
            this.enterEditing();
        }
        else {
            this.leaveEditing();
        }

        let node = this.node;
        let radius = this.target.radius;

        let p  = snapPixelWihVec2( this._view.worldToPixel( node.convertToWorldSpaceAR(this.target.offset) ) );

        let p1 = node.convertToWorldSpace(cc.v2(0, 0));
        let p2 = node.convertToWorldSpace(cc.v2(radius, 0));
        let d = p1.sub(p2).mag();

        this._root.plot(p, snapPixel(d));
    }

    enterEditing () {
        if (this._targetEditing) {
            return;
        }

        let root = this._root;
        root.circle.style( 'pointer-events', 'stroke' );
        root.dragArea.show();
        root.sidePointGroup.show();

        this._targetEditing = true;
    }

    leaveEditing () {
        if (!this._targetEditing) {
            return;
        }

        let root = this._root;
        root.circle.style( 'pointer-events', 'none' );
        root.dragArea.hide();
        root.sidePointGroup.hide();

        this._targetEditing = false;
    }

    hide () {
        Editor.Gizmo.prototype.hide.call(this);
        this.target.editing = false;
    }
}

module.exports = CircleShape;
