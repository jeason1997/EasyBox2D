/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_Shape.js
 * Describe : 
 *************************************************/

require('Physics');
require('Body');

window.ShapeType = cc.Enum({
    BOX: 0,
    CIRCLE: 1,
    POLYGON: 2,
    EDGE: 3,
});

/**
 * @class Box2D_Shape
 * @extends cc.Component
 */
window.Shape = cc.Class({
    
    extends: cc.Component,
    
    editor: {
        requireComponent: Body,
    },

    properties: {
        ShapeData: {
            default: null,
            visible: false,
        },
        body: {
            default: null,
            type: Body,
            visible: false,
        },
    },

    getShape: function () {
    },
});
