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
        executeInEditMode: false,
    },

    properties: {
        shapeType: {
            default: ShapeType.CIRCLE,
            type: ShapeType,
            readonly: true,
            override: true,
        },
        sameAsNode: {
            default: true,
            displayName: 'i18n:Box2D.Shape.CircleShape.sameAsNode',
            tooltip: 'i18n:Box2D.Shape.CircleShape.sameAsNode_tooltip',
            notify: function(){
                
            }
        },
        diameter: {
            default: PTM_RATIO,
            displayName: 'i18n:Box2D.Shape.CircleShape.diameter',
            tooltip: 'i18n:Box2D.Shape.CircleShape.diameter_tooltip',
            notify: function(){
                
            }
        },
        offset: {
            default: new cc.Vec2(0, 0),
            displayName: 'i18n:Box2D.Shape.CircleShape.offset',
            tooltip: 'i18n:Box2D.Shape.CircleShape.offset_tooltip',
            notify: function(){
                
            }
        },
    },
    
    getShapeData: function () {
        
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

    getShape: function () {
        
        var data = this.getShapeData();
        var shape;
        shape = new b2CircleShape(data.radius);
        shape.SetLocalPosition(data.offset);
        
        return shape;
    },
});
