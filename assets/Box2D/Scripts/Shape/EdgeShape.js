/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_EdgeShape.js
 * Describe : 
 *************************************************/

require('Shape');

window.EdgeShape = cc.Class({

    extends: Shape,

    editor: {
        menu: 'i18n:Box2D.Shape.Box2D_EdgeShape.menu',
    },

    properties: {
        shapeType: {
            default: ShapeType.EDGE,
            type: ShapeType,
            readonly: true,
            visible: false,
        },
        
        vertexes: {
            default: [],
            type: [cc.Vec2],
            visible: true,
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

    getShape: function () {

        var vets = new Array(this.vertexes.length);

        for (var i = 0; i < this.vertexes.length; ++i) {
            var v = new b2Vec2((this.vertexes[i].x + this.offset.x) / PTM_RATIO,
                (this.vertexes[i].y + this.offset.y) / PTM_RATIO);
            vets[i] = v;
        }

        var shapes = new Array(vets.length - 1);
        for (i = 0; i < vets.length - 1; ++i) {
            var shape = new b2PolygonShape();
            shape.SetAsEdge(vets[i], vets[i + 1]);
            shapes[i] = shape;
        }
        return shapes;
    },
});
