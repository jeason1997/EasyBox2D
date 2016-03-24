/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_EdgeShape.js
 * Describe : 
 *************************************************/

require('Shape');
require('EdgeDraw');

window.EdgeShape = cc.Class({

    extends: Shape,

    editor: {
        menu: 'i18n:Box2D.Shape.Box2D_EdgeShape.menu',
        executeInEditMode: false,
    },

    properties: {
        shapeType: {
            default: ShapeType.EDGE,
            type: ShapeType,
            readonly: true,
            visible: false,
        },
        close: {
            default: false,
        },
        removePathInGame: {
            default: false,
        },
        vertexes: {
            default: [],
            type: cc.Node,
            notify: function () {
                if (CC_EIDTOR)
                    this.vertexes = EdgeDraw.updateEdge(this);
            },
        },
    },

    onLoad: function () {
        if (this.removePathInGame) {
            this.node.removeAllChildren();
        }
    },

    getShape: function () {

        var vets = new Array(this.vertexes.length);

        for (var i = 0; i < this.vertexes.length; ++i) {
            var pos = this.vertexes[i].position;
            var v = new b2Vec2(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
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
