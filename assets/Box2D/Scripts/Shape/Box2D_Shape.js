/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_Shape.js
 * Describe : 
 *************************************************/

require('Physics');
require('Box2D_Body');

ShapeType = cc.Enum({
    BOX: 0,
    CIRCLE: 1,
    POLYGON: 2,
    EDGE: 3,
});

/**
 * @class ShapeData
 * @describe
 */
ShapeData = function(shapeType, offset, radius, box, vertexes){
    this.shapeType = shapeType;
    this.offset = offset;
    this.radius = radius;
    this.box = box;
    this.vertexes = vertexes;
};

/**
 * @class Box2D_Shape
 * @extends cc.Component
 */
Box2D_Shape = cc.Class({
    
    extends: cc.Component,
    
    editor: {
        // Just execute in editmode, if user add this component
        // to the Node, it will remove it self.
        executeInEditMode: true,
    },

    properties: {
        shapeType: {
            default: null,
            displayName: 'i18n:Box2D.Shape.shapeType',
        },
        ShapeData: {
            default: null,
            visible: false,
        },
        body: {
            default: null,
            type: Box2D_Body,
            visible: false,
        },
    },

    onLoad: function () {
        if (CC_EDITOR)
            Debug.error(Editor.T('Box2D.Shape.addshape_error'));
        this.destroy();
    },
    
    getShapeData: function () {
        
    },
    
    getShape: function () {
    },
});
