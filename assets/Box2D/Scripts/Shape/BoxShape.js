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
    },

    properties: {
        shapeType: {
            default: ShapeType.BOX,
            type: ShapeType,
            readonly: true,
            visible: false,
        },
        
        _size: cc.Vec2.ONE,
        size: {
            get: function() {
                return this._size;
            },
            set: function (value) {
                this._size = value;
                this._size.x = value.x < 0 ? 0 : value.x;
                this._size.y = value.y < 0 ? 0 : value.y;
            }
        },
        
        _offset: cc.Vec2.ZERO,
        offset: {
            get: function() {
                return this._offset;
            },
            set: function (value) {
                this._offset = value;
            }
        },
    },

    getShape: function() {

        var scale = this.node.convertToWorldScale();
        
        var shape = new b2PolygonShape();
        shape.SetAsOrientedBox(this.size.x / 2 / PTM_RATIO, this.size.y / 2 / PTM_RATIO,
            new b2Vec2(this.offset.x / PTM_RATIO, this.offset.y / PTM_RATIO), 0);

        return shape;
    },
 });