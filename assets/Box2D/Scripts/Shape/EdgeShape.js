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
    
    getShapeData: function () {
        
        var vets = new Array(this.vertexes.length);
        for (var i = 0; i < this.vertexes.length; ++i) {
            var pos = this.vertexes[i].position;
            var v = new b2Vec2(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
            vets[i] = v;
        }
       
        this.shapeData = new ShapeData(this.shapeType, null, null, null, vets);
        
        return this.shapeData;
    },
    
    getShape: function () {
        
        var data = this.getShapeData();
      
        var shapes = new Array(data.vertexes.length - 1);
        for (i = 0; i < data.vertexes.length - 1; ++i) {
            var shape = new b2PolygonShape();
            shape.SetAsEdge(data.vertexes[i], data.vertexes[i + 1]);
            shapes[i] = shape;
        }
        return shapes;
    },
});
