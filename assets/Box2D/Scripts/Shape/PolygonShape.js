/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_EdgeShape.js
 * Describe : 
 *************************************************/

require('Shape');

window.PolygonShape = cc.Class({
    
    extends: Shape,
    
    editor: {
        menu: 'i18n:Box2D.Shape.Box2D_PolygonShape.menu',
        executeInEditMode: false,
    },

    properties: {
        shapeType: {
            default: ShapeType.POLYGON,
            type: ShapeType,
            readonly: true,
            visible: false,
        },
        removePathInGame: {
            default: false,  
        },
        vertexes: {
            default: [],
            type: cc.Node,
            notify: function () {
                if (this.vertexes.length > this.node.childrenCount) {
                    for (var i = this.node.childrenCount; i < this.vertexes.length; ++i) {
                        var child = cc.instantiate(this.linePrefab);
                        child.name = 'P_' + i;
                        this.vertexes[i] = child;
                        this.node.addChild(child);
                        if (i > 0) {
                            this.node.children[i - 1].getComponent(EdgeLine).nextPoint = child;
                            child.getComponent(EdgeLine).lastPoint = this.node.children[i - 1];
                        }
                    }
                }
                else {
                    for (var j = this.node.childrenCount - 1; j >= this.vertexes.length; --j) {
                        if (j > 0)
                            this.node.children[j - 1].getComponent(EdgeLine).nextPoint = null;
                        this.node.removeChild(this.node.children[j]);
                    }
                }
            },
        },
        linePrefab: {
            default: null,
            type: cc.Prefab,
        }
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
        
        var shape = new b2PolygonShape();
        shape.SetAsVector(vets, vets.length);
        return shape;
    },
});
