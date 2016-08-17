'use strict';

let Tools = Editor.require('app://editor/page/gizmos/elements/tools');
let snapPixelWihVec2 = Editor.GizmosUtils.snapPixelWihVec2;

let ToolType = {
    None: 0,
    Point: 1,
    Line: 2,
    Center: 3
};

class PolygonColliderGizmo extends Editor.Gizmo {
    onCreateRoot () {
        let startPoint;
        let startOffset;
        let pointInstance;

        let updated;

        this.createTool({
            start: (type, x, y, event) => {
                if (type === ToolType.Point) {
                    let el = event.currentTarget.instance;
                    pointInstance = el.point.origin;
                    startPoint = pointInstance.clone();

                    let deleteKeyDown = event.ctrlKey || event.metaKey;
                    if (deleteKeyDown) {
                        _Scene.Undo.recordNode( this.node.uuid );
                        updated = true;

                        let points = this.target.points;
                        points.splice(points.indexOf(pointInstance), 1);

                        return;
                    }
                }
                else if (type === ToolType.Center) {
                    startOffset = this.target.offset;
                }
                else if (type === ToolType.Line) {
                    _Scene.Undo.recordNode( this.node.uuid );
                    updated = true;

                    let canvasSize = cc.view.getCanvasSize();
                    y = canvasSize.height - y;

                    let p = this.node.convertToNodeSpaceAR(cc.v2(x, y)).sub(this.target.offset);
                    
                    let el = event.currentTarget.instance;
                    let start = el.startSvgPoint.point.origin;
                    let end = el.endSvgPoint.point.origin;

                    let points = this.target.points; 
                    let nextIndex = points.indexOf(start) + 1;

                    // allign point to line
                    let dx = start.x - end.x;  
                    let dy = start.y - end.y;  
                    let u = (p.x - start.x)*(start.x - end.x) + (p.y - start.y)*(start.y - end.y);  
                    u = u/((dx*dx)+(dy*dy));  
                  
                    p.x = start.x + u*dx;
                    p.y = start.y + u*dy;

                    _Scene.adjustVec2(p);

                    this.target.points.splice(nextIndex, 0, p);

                    return;
                }

                updated = false;
            },

            update: (type, dx, dy, event) => {
                if (dx === 0 && dy === 0) {
                    return;
                }
                updated = true;

                let node = this.node;
                _Scene.Undo.recordNode( node.uuid );

                dy = -dy;
                let t = cc.affineTransformClone( node.getWorldToNodeTransform() );
                t.tx = t.ty = 0;

                if (type === ToolType.Point) {
                    let deleteKeyDown = event.ctrlKey || event.metaKey;
                    if (deleteKeyDown) {
                        return;
                    }

                    let d = cc.v2(cc.pointApplyAffineTransform(dx, dy, t)).add(startPoint);
                    _Scene.adjustVec2(d);

                    pointInstance.x = d.x;
                    pointInstance.y = d.y;
                }
                else if (type === ToolType.Center) {
                    let d = cc.v2(cc.pointApplyAffineTransform(dx, dy, t)).add(startOffset);
                    _Scene.adjustVec2(d);

                    this.target.offset = d;
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

        // center drag area
        let dragArea = root.dragArea = root.polygon()
            .fill( { color: 'rgba(0,128,255,0.2)' } )
            .stroke( 'none' )
            .style( 'pointer-events', 'fill' )
            .style( 'cursor', 'move' )
            .hide()
            ;

        Editor.GizmosUtils.addMoveHandles( dragArea, creatToolCallbacks(ToolType.Center) );

        // lines
        let linesGroup = root.linesGroup = root.group();
        let linesPool = [];

        linesGroup.style('pointer-events', 'none').style('cursor', 'copy');

        function createLine () {
            return Tools.lineTool( linesGroup, cc.v2(0,0), cc.v2(0,0), '#7fc97a', null, creatToolCallbacks(ToolType.Line));
        }

        // points
        let pointsGroup = root.pointsGroup = root.group();
        let pointsPool = [];

        pointsGroup.hide();

        function createPoint () {
            let svg = Tools.circleTool(pointsGroup, 5, {color: '#7fc97a'}, null, 'pointer', creatToolCallbacks(ToolType.Point));
            svg.on('mouseover', function (event) {
                let deleteKeyDown = event.ctrlKey || event.metaKey;
                if (deleteKeyDown) {
                    svg.fill({color: '#f00'});
                    svg.l1.stroke({color: '#f00'});
                    svg.l2.stroke({color: '#f00'});
                }
            });

            svg.on('mouseout', function (event) {
                svg.fill({color: '#7fc97a'});
                svg.l1.stroke({color: '#7fc97a'});
                svg.l2.stroke({color: '#7fc97a'});
            });

            return svg;
        }

        // plot
        root.plot = function (points) {
            let ps = [];
            for (let i = 0, l = points.length; i < l; i++) {
                // next index
                let ni = i === l - 1 ? 0 : i + 1;
                let p = points[i];

                // svg point
                let sp = pointsPool[i];
                if (!sp) {
                    sp = pointsPool[i] = createPoint();
                }

                sp.point = p;
                sp.show();
                sp.center(p.x, p.y);

                // pre generate next svg point
                let nsp = pointsPool[ni];
                if (!nsp) {
                    nsp = pointsPool[ni] = createPoint();
                }

                // line
                let line = linesPool[i];
                if (!line) {
                    line = linesPool[i] = createLine();
                }

                let start = p;
                let end = points[ni];
                line.show();
                line.plot(start.x, start.y, end.x, end.y);
                line.startSvgPoint = sp;
                line.endSvgPoint = nsp;

                sp.l1 = line;
                nsp.l2 = line;

                ps.push([p.x, p.y]);
            }

            dragArea.plot(ps);

            for (let i = points.length, l = pointsPool.length; i < l; i++) {
                pointsPool[i].hide();
                linesPool[i].hide();
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

        let points = this.target.points;
        let offset = this.target.offset;
        let node = this.node;
        let t  = cc.affineTransformClone( node.getNodeToWorldTransformAR() );

        let wpoints = [];

        for (let i = 0, l = points.length; i < l; i++) {
            let p = points[i].add(offset);
            let wp = cc.pointApplyAffineTransform(p, t);
            wp = snapPixelWihVec2( this._view.worldToPixel(wp) );
            wp.origin = points[i];
            wpoints.push(wp);
        }

        this._root.plot(wpoints);
    }

    enterEditing () {
        if (this._targetEditing) {
            return;
        }

        let root = this._root;
        root.pointsGroup.show();
        root.dragArea.show();
        root.linesGroup.style('pointer-events', 'stroke');

        this._targetEditing = true;
    }

    leaveEditing () {
        if (!this._targetEditing) {
            return;
        }

        let root = this._root;
        root.pointsGroup.hide();
        root.dragArea.hide();
        root.linesGroup.style('pointer-events', 'none');

        this._targetEditing = false;
    }

    hide () {
        Editor.Gizmo.prototype.hide.call(this);
        this.target.editing = false;
    }
}

module.exports = PolygonColliderGizmo;
