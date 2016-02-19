/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_BoxShape.js
 * Describe : 
 *************************************************/

require('Box2D_Shape');

Box2D_BoxShape = cc.Class({
    
    extends: Box2D_Shape,
    
    editor: {
        menu: 'i18n:Box2D.Shape.BoxShape.menu',
        executeInEditMode: false,
    },

    properties: {
        shapeType: {
            default: ShapeType.BOX,
            type: ShapeType,
            readonly: true,
            override: true,
        },
        sameAsNode: {
            default: true,
            displayName: 'i18n:Box2D.Shape.BoxShape.sameAsNode',
            tooltip: 'i18n:Box2D.Shape.BoxShape.sameAsNode_tooltip',
            notify: function(){
                
            }
        },
        box: {
            default: new cc.Vec2(PTM_RATIO, PTM_RATIO),
            displayName: 'i18n:Box2D.Shape.BoxShape.box',
            tooltip: 'i18n:Box2D.Shape.BoxShape.box_tooltip',
            notify: function(){
                
            }
        },
        offset: {
            default: new cc.Vec2(0, 0),
            displayName: 'i18n:Box2D.Shape.BoxShape.offset',
            tooltip: 'i18n:Box2D.Shape.BoxShape.offset_tooltip',
            notify: function(){
                
            }
        },
    },
    
    getShapeData: function () {
        
        var scale = this.node.convertToWorldScale();
        
        if (this.sameAsNode) {
            this.box.x = this.node.width * scale.x;
            this.box.y = this.node.height * scale.y;
        }
        
        this.shapeData = new ShapeData(
            this.shapeType, 
            new b2Vec2(this.offset.x / PTM_RATIO, this.offset.y / PTM_RATIO), 
            null,
            // half width, half height
            new b2Vec2(this.box.x / 2 / PTM_RATIO, this.box.y / 2 / PTM_RATIO)
        );
        
        return this.shapeData;
    },
    
    getShape: function () {
        
        var data = this.getShapeData();
        var shape;
        shape = new b2PolygonShape();
        shape.SetAsBox(data.box.x, data.box.y);
        
        return shape;
    },
});
