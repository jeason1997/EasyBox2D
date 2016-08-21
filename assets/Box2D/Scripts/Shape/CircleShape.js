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
        //inspector: 'packages://box2d/inspector/circleShape.js',
    },

    properties: {
        
        shapeType: {
            default: ShapeType.CIRCLE,
            type: ShapeType,
            readonly: true,
        },
        
        editing: false,
        
        _radius: 50,
        radius: {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value < 0 ? 0 : value;
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
        var shape = new b2CircleShape(this.radius / PTM_RATIO);
        shape.SetLocalPosition(new b2Vec2(this.offset.x / PTM_RATIO, this.offset.y / PTM_RATIO));

        return shape;
    },
});