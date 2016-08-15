/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_CircleShape.js
 * Describe :
 *************************************************/

require('Shape');

window.CircleShape = cc.Class({

    extends: Shape,

    editor: {
        menu: 'i18n:Box2D.Shape.CircleShape.menu',
        inspector: 'packages://box2d/inspector/circleShape.js',
        executeInEditMode: true,
    },

    properties: {
        radius: 100,
        shapeType: {
            default: ShapeType.CIRCLE,
            type: ShapeType,
            readonly: true,
        },
        sameAsNode: {
            default: true,
            displayName: 'i18n:Box2D.Shape.CircleShape.sameAsNode',
            tooltip: 'i18n:Box2D.Shape.CircleShape.sameAsNode_tooltip',
            notify: function() {
                this.updateDebugDraw();
            }
        },
        diameter: {
            default: PTM_RATIO,
            displayName: 'i18n:Box2D.Shape.CircleShape.diameter',
            tooltip: 'i18n:Box2D.Shape.CircleShape.diameter_tooltip',
            notify: function() {
                this.updateDebugDraw();
            }
        },
        offset: {
            default: new cc.Vec2(0, 0),
            displayName: 'i18n:Box2D.Shape.CircleShape.offset',
            tooltip: 'i18n:Box2D.Shape.CircleShape.offset_tooltip',
            notify: function() {
                this.updateDebugDraw();
            }
        },
        _canvas: null,
    },

    getShape: function() {

        var scale = this.node.convertToWorldScale();
        
        if (this.sameAsNode) {
            this.diameter = this.node.width * scale.x;
        }
        
        var shape = new b2CircleShape(this.diameter / 2 / PTM_RATIO);
        shape.SetLocalPosition(new b2Vec2(this.offset.x / PTM_RATIO, this.offset.y / PTM_RATIO));

        return shape;
    },
    
    updateDebugDraw: function() {
        if (CC_EDITOR) {
            var diameter = this.diameter;
            if (this.sameAsNode) {
                var scale = this.node.convertToWorldScale();
                diameter = this.node.width * scale.x;
            }
            var scaleX = this.node._sgNode.scaleX;
            this._canvas.clear();
            this._canvas.drawDot(this.offset,
                diameter / 2 / scaleX, new cc.Color(127, 229, 127, 76));
            this._canvas.drawCircle(this.offset,
                diameter / 2 / scaleX, 0, 20, true, 5 / scaleX, new cc.Color(127, 229, 127, 255));
        }
    },
});