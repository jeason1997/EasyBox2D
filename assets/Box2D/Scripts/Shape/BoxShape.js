/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_BoxShape.js
 * Describe :
 *************************************************/

require('Shape');

window.BoxShape = cc.Class({

    extends: Shape,

    editor: {
        menu: 'i18n:Box2D.Shape.BoxShape.menu',
        executeInEditMode: true,
    },

    properties: {
        shapeType: {
            default: ShapeType.BOX,
            type: ShapeType,
            readonly: true,
            visible: false,
        },
        sameAsNode: {
            default: true,
            displayName: 'i18n:Box2D.Shape.BoxShape.sameAsNode',
            tooltip: 'i18n:Box2D.Shape.BoxShape.sameAsNode_tooltip',
            notify: function() {
                this.updateDebugDraw();
            }
        },
        box: {
            default: new cc.Vec2(PTM_RATIO, PTM_RATIO),
            displayName: 'i18n:Box2D.Shape.BoxShape.box',
            tooltip: 'i18n:Box2D.Shape.BoxShape.box_tooltip',
            notify: function() {
                this.updateDebugDraw();
            }
        },
        offset: {
            default: new cc.Vec2(0, 0),
            displayName: 'i18n:Box2D.Shape.BoxShape.offset',
            tooltip: 'i18n:Box2D.Shape.BoxShape.offset_tooltip',
            notify: function() {
                this.updateDebugDraw();
            }
        },
        _canvas: null,
    },

    getShape: function() {

        var scale = this.node.convertToWorldScale();
        
        if (this.sameAsNode) {
            this.box.x = this.node.width * scale.x;
            this.box.y = this.node.height * scale.y;
        }
        
        var shape = new b2PolygonShape();
        shape.SetAsOrientedBox(this.box.x / 2 / PTM_RATIO, this.box.y / 2 / PTM_RATIO,
            new b2Vec2(this.offset.x / PTM_RATIO, this.offset.y / PTM_RATIO), 0);

        return shape;
    },
    
    updateDebugDraw: function() {
        if (CC_EDITOR) {
            if (this.sameAsNode) {
                var scale = this.node.convertToWorldScale();
                this.box.x = this.node.width * scale.x;
                this.box.y = this.node.height * scale.y;
            }
            var scaleX = this.node._sgNode.scaleX;
            var scaleY = this.node._sgNode.scaleY;
            this._canvas.clear();
            this._canvas.drawRect(
                new cc.Vec2(-this.box.x / 2 / scaleX + this.offset.x, -this.box.y / 2 / scaleY + this.offset.y),
                new cc.Vec2(this.box.x / 2 / scaleX + this.offset.x, this.box.y / 2 / scaleY + this.offset.y),
                new cc.Color(127, 229, 127, 76),
                5,
                new cc.Color(127, 229, 127, 255));
        }
    },
 });