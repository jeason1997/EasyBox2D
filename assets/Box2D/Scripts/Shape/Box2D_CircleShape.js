/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_CircleShape.js
 * Describe :
 *************************************************/

require('Box2D_Shape');

Box2D_CircleShape = cc.Class({

    extends: Box2D_Shape,

    editor: {
        menu: 'i18n:Box2D.Shape.CircleShape.menu',
        executeInEditMode: true,
    },

    properties: {
        shapeType: {
            default: ShapeType.CIRCLE,
            type: ShapeType,
            readonly: true,
            visible: false,
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

    getShapeData: function() {

        var scale = this.node.convertToWorldScale();

        if (this.sameAsNode) {
            this.diameter = this.node.width * scale.x;
        }

        this.shapeData = new ShapeData(
            this.shapeType,
            new b2Vec2(this.offset.x / PTM_RATIO, this.offset.y / PTM_RATIO),
            this.diameter / 2 / PTM_RATIO,
            null
        );

        return this.shapeData;
    },

    getShape: function() {

        var data = this.getShapeData();
        var shape;
        shape = new b2CircleShape(data.radius);
        shape.SetLocalPosition(data.offset);

        return shape;
    },

    start: function() {
        if (CC_EDITOR) {
            this._canvas = new cc.DrawNode();
            this.node._sgNode.addChild(this._canvas);
            this.node.on('size-changed', function(event) {
                this.updateDebugDraw();
            }, this);
            this.node.on('scale-changed', function(event) {
                this.updateDebugDraw();
            }, this);
            this.updateDebugDraw();
        }
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