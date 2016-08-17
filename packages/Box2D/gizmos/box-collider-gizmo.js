'use strict';

let Tools = Editor.require('app://editor/page/gizmos/elements/tools');
let RectToolType = Tools.rectTool.Type;

let snapPixelWihVec2 = Editor.GizmosUtils.snapPixelWihVec2;

class BoxColliderGizmo extends Editor.Gizmo {
    onCreateRoot () {
        let startOffset;
        let startSize;
        let updated;
        let self = this;

        function handleCenterRect (delta) {
            let node = self.node;
            let t = cc.affineTransformClone( node.getWorldToNodeTransform() );
            t.tx = t.ty = 0;
            
            let d = cc.v2(cc.pointApplyAffineTransform(delta.x, delta.y, t)).add(startOffset);
            self.target.offset = _Scene.adjustVec2(d);
        }

        function formatDelta (type, delta, sizeDelta, keepAspectRatio) {
            if (type === RectToolType.LeftBottom) {
                sizeDelta.x *= -1;
            }
            else if (type === RectToolType.LeftTop) {
                sizeDelta.x *= -1;
                sizeDelta.y *= -1;
            }
            else if (type === RectToolType.RightTop) {
                sizeDelta.y *= -1;
            }
            else if (type === RectToolType.Left) {
                sizeDelta.x *= -1;
                if (!keepAspectRatio) {
                    delta.y = sizeDelta.y = 0;
                }
            }
            else if (type === RectToolType.Right) {
                if (!keepAspectRatio) {
                    delta.y = sizeDelta.y = 0;
                }
            }
            else if (type === RectToolType.Top) {
                sizeDelta.y *= -1;
                if (!keepAspectRatio) {
                    delta.x = sizeDelta.x = 0;
                }
            }
            else if (type === RectToolType.Bottom) {
                if (!keepAspectRatio) {
                    delta.x = sizeDelta.x = 0;
                }
            }
        }

        function formatDeltaWithAnchor (type, anchor, delta, sizeDelta, keepCenter) {
            if (type === RectToolType.Right ||
                type === RectToolType.RightTop ||
                type === RectToolType.RightBottom) {
                if (keepCenter) {
                    sizeDelta.x /= (1 - anchor.x);
                }
                delta.x = sizeDelta.x * anchor.x;
            }
            else {
                if (keepCenter) {
                    sizeDelta.x /= anchor.x;
                }
                delta.x = sizeDelta.x * (1 - anchor.x);
            }

            if (type === RectToolType.LeftBottom ||
                type === RectToolType.Bottom ||
                type === RectToolType.RightBottom) {
                if (keepCenter) {
                    sizeDelta.y /= (1- anchor.y);
                }
                delta.y = sizeDelta.y * anchor.y;
            }
            else {
                if (keepCenter) {
                    sizeDelta.y /= anchor.y;
                }
                delta.y = sizeDelta.y * (1 - anchor.y);
            }

            return delta;
        }

        function handleSizePoint (type, delta, keepAspectRatio, keepCenter) {

            let sizeDelta = delta.clone();
            let node = self.node;
            let target = self.target;

            // compute transform
            let world2nodeTransform  = cc.affineTransformClone( node.getWorldToNodeTransform() );
            world2nodeTransform.tx   = world2nodeTransform.ty = 0;

            // compute position and size
            let d = cc.pointApplyAffineTransform(delta, world2nodeTransform);
            let sd = cc.pointApplyAffineTransform(sizeDelta, world2nodeTransform);
            let anchor = cc.v2(0.5, 0.5);

            formatDeltaWithAnchor(type, anchor, d, sd, keepCenter);
            formatDelta(type, d, sd, keepAspectRatio);

            if (keepAspectRatio) {
                sd.y = sd.x * (startSize.height / startSize.width);
            }

            // apply results
            let size = cc.size(startSize.width + sd.x, startSize.height + sd.y);

            if (!keepCenter) {
                if (size.width < 0) {
                    d.x -= size.width/2;
                }
                if (size.height < 0) {
                    d.y -= size.height/2;
                }
                d = startOffset.add(d);
                target.offset = d;
            }

            if (size.width < 0) {
                size.width = 0;
            }
            if (size.height < 0) {
                size.height = 0;
            }
            target.size = size;
        }

        this.createTool({
            start: () => {
                startOffset = this.target.offset.clone();
                startSize = this.target.size.clone();
                updated = false;
            },

            update: (type, dx, dy, event) => {
                if (dx === 0 && dy === 0) {
                    return;
                }
                updated = true;
                let delta = new cc.Vec2(dx, -dy);

                let node = this.node;
                _Scene.Undo.recordNode( node.uuid );

                if (type === RectToolType.Center) {
                    handleCenterRect(delta.clone());
                }
                else {
                    let keepAspectRatio = event ? event.shiftKey : false;
                    let keepCenter = event ? event.altKey : false;

                    handleSizePoint(type, delta.clone(), keepAspectRatio, keepCenter);
                }

                this._view.repaintHost();
            },

            end: (type) => {
                if (updated) {
                    let target = self.target;
                    if (type === RectToolType.Center) {
                        target.offset = _Scene.adjustVec2(target.offset);
                    }
                    else {
                        target.offset = _Scene.adjustVec2(target.offset);
                        target.size = _Scene.adjustSize(target.size);
                    }

                    _Scene.AnimUtils.recordNodeChanged(this.node);
                    _Scene.Undo.commit();    
                }
            }
        });
    }

    createTool (callbacks) {
        let root = this._root;
        let sideGroup = root.sideGroup = root.group().style( 'pointer-events', 'none' );
        let sidePointGroup;
        let l, t, r, b;         // size sides
        let lb, lt, rt, rb;     // size sides points
        let rect;               // center rect

        function creatToolCallbacks (type) {
            return {
                start: function ( event ) {
                    callbacks.start.call(root, type, event);
                },
                update: function ( dx, dy, event ) {
                    callbacks.update.call(root, type, dx, dy, event);
                },
                end: function ( event ) {
                    callbacks.end.call(root, type, event);
                }
            };
        }

        // init center rect
        root.rect = rect = root.polygon('0,0,0,0,0,0')
            .fill( { color: 'rgba(0,128,255,0.2)' } )
            .stroke('none')
            .style( 'pointer-events', 'fill' )
            .style('cursor', 'move')
            .hide()
            ;

        Editor.GizmosUtils.addMoveHandles( rect, {}, creatToolCallbacks(RectToolType.Center) );

        // init sides
        function createLineTool(type, cursor) {
            return Tools.lineTool( sideGroup, cc.v2(0,0), cc.v2(0,0), '#7fc97a', cursor, creatToolCallbacks(type))
                .style( 'cursor', cursor );
        }

        l = createLineTool(RectToolType.Left, 'col-resize');
        t = createLineTool(RectToolType.Top, 'row-resize');
        r = createLineTool(RectToolType.Right, 'col-resize');
        b = createLineTool(RectToolType.Bottom, 'row-resize');

        // init sides points
        sidePointGroup = root.sidePointGroup = root.group();
        sidePointGroup.hide();

        function createSidePoint (type, svg, cursor) {
            return Tools.circleTool(svg, 5, {color: '#7fc97a'}, null, creatToolCallbacks(type))
                .style( 'cursor', cursor );
        }

        lb = createSidePoint(RectToolType.LeftBottom, sidePointGroup, 'nwse-resize');
        lt = createSidePoint(RectToolType.LeftTop, sidePointGroup, 'nesw-resize');
        rt = createSidePoint(RectToolType.RightTop, sidePointGroup, 'nwse-resize');
        rb = createSidePoint(RectToolType.RightBottom, sidePointGroup, 'nesw-resize');

        // set bounds
        root.plot =  (bounds) => {
            rect.plot([
                [bounds[0].x, bounds[0].y],
                [bounds[1].x, bounds[1].y],
                [bounds[2].x, bounds[2].y],
                [bounds[3].x, bounds[3].y]
            ]);

            l.plot(bounds[0].x, bounds[0].y, bounds[1].x, bounds[1].y);
            t.plot(bounds[1].x, bounds[1].y, bounds[2].x, bounds[2].y);
            r.plot(bounds[2].x, bounds[2].y, bounds[3].x, bounds[3].y);
            b.plot(bounds[3].x, bounds[3].y, bounds[0].x, bounds[0].y);

            if (this._targetEditing) {
                lb.center(bounds[0].x, bounds[0].y);
                lt.center(bounds[1].x, bounds[1].y);
                rt.center(bounds[2].x, bounds[2].y);
                rb.center(bounds[3].x, bounds[3].y);
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

        let target = this.target;
        let size = target.size;
        let offset = target.offset;
        let rect = cc.rect(offset.x - size.width/2, offset.y - size.height/2, size.width, size.height);

        let node = this.node;
        let mat = node.getNodeToWorldTransformAR();
        let obb_v1 = new cc.Vec2();
        let obb_v2 = new cc.Vec2();
        let obb_v3 = new cc.Vec2();
        let obb_v4 = new cc.Vec2();
        cc.engine.obbApplyAffineTransform(mat, rect, obb_v1, obb_v2, obb_v3, obb_v4);
        obb_v1 = snapPixelWihVec2( this._view.worldToPixel(obb_v1) );
        obb_v2 = snapPixelWihVec2( this._view.worldToPixel(obb_v2) );
        obb_v3 = snapPixelWihVec2( this._view.worldToPixel(obb_v3) );
        obb_v4 = snapPixelWihVec2( this._view.worldToPixel(obb_v4) );

        this._root.plot([
            obb_v1,
            obb_v2,
            obb_v3,
            obb_v4
        ]);
    }

    enterEditing () {
        if (this._targetEditing) {
            return;
        }

        let root = this._root;
        root.sideGroup.style( 'pointer-events', 'stroke' );
        root.rect.show();
        root.sidePointGroup.show();

        this._targetEditing = true;
    }

    leaveEditing () {
        if (!this._targetEditing) {
            return;
        }

        let root = this._root;
        root.sideGroup.style( 'pointer-events', 'none' );
        root.rect.hide();
        root.sidePointGroup.hide();

        this._targetEditing = false;
    }

    hide () {
        Editor.Gizmo.prototype.hide.call(this);
        this.target.editing = false;
    }
}

module.exports = BoxColliderGizmo;
