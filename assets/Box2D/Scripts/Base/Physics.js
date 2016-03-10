/**************** Global ********************/

// Editor Mode
window.CC_EDITOR = (cc.engine !== undefined);

// PTM_RATIO Defined
window.PTM_RATIO = 32;

// Physics Defined
window.Physics = {
    
};

/********************************************/





/**************** Box2D ********************/

// Box2D Defined
var Box2D = require('box2dweb-commonjs');
window.b2AABB = Box2D.b2AABB;
window.b2World = Box2D.b2World;
window.b2AABB = Box2D.b2AABB;
window.b2Body = Box2D.b2Body;
window.b2BodyDef = Box2D.b2BodyDef;
window.b2CircleShape = Box2D.b2CircleShape;
window.b2Fixture = Box2D.b2Fixture;
window.b2FixtureDef = Box2D.b2FixtureDef;
window.b2Vec2 = Box2D.b2Vec2;
window.b2DebugDraw = Box2D.b2DebugDraw;
window.b2MassData = Box2D.b2MassData;
window.b2PolygonShape = Box2D.b2PolygonShape;
window.b2PrismaticJointDef = Box2D.b2PrismaticJointDef;
window.b2RevoluteJointDef = Box2D.b2RevoluteJointDef;
window.b2DistanceJointDef = Box2D.b2DistanceJointDef;
window.b2Transform = Box2D.b2Transform;
window.b2ContactListener = Box2D.b2ContactListener;
window.b2MouseJointDef = Box2D.b2MouseJointDef;
window.b2FilterData = Box2D.b2FilterData;
window.b2EdgeShape = Box2D.b2EdgeShape;
window.b2LineJointDef = Box2D.b2LineJointDef;
window.b2WeldJointDef = Box2D.b2WeldJointDef;
window.b2GearJointDef = Box2D.b2GearJointDef;
window.b2PrismaticJointDef = Box2D.b2PrismaticJointDef;
window.b2FrictionJointDef = Box2D.b2FrictionJointDef;
window.b2PulleyJointDef = Box2D.b2PulleyJointDef;

/********************************************/





/**************** Physics *******************/

////////////////// Enum //////////////////////
window.Physics.Category = cc.Enum({
    TYPE_1: 1,
    TYPE_2: 2,
    TYPE_3: 4,
    TYPE_4: 8,

    TYPE_5: 16,
    TYPE_6: 32,
    TYPE_7: 64,
    TYPE_8: 128,

    TYPE_9: 256,
    TYPE_10: 512,
    TYPE_11: 1024,
    TYPE_12: 2048,

    TYPE_13: 4096,
    TYPE_14: 8192,
    TYPE_15: 16384,
    TYPE_16: 32768,
});


////////////////// Class /////////////////////
window.Physics.Ray = cc.Class({
    // constructor1: start, end
    // constructor2: start, direction, distant
    ctor: function () {
        // constructor1
        if (arguments[2] === undefined) {
            this.start = arguments[0];
            this.end = arguments[1];
            
            //this.direction = ;
            //this.distance = ;
        }
        // constructor2
        else {
            this.start = arguments[0];
            this.direction = arguments[1];
            this.distant = arguments[2];
            
            //this.end = ;
        }
    },

    properties: {
        start: b2Vec2(0, 0),
        end: b2Vec2(0, 0),
        direction: b2Vec2(0, 0),
        distant: 0,
    },
});


//////////////// Function ////////////////////
window.Physics.RayCast = function(point1, point2, callback) {
    var p1 = new b2Vec2(point1.x / PTM_RATIO, point1.y / PTM_RATIO);
    var p2 = new b2Vec2(point2.x / PTM_RATIO, point2.y / PTM_RATIO);
    Engine.instance.world.RayCast(callback, p1, p2);
        
    // Debugdraw
    if (Engine.instance.physicsDebugger.openDebug && Engine.instance.physicsDebugger.drawRay) {
        Engine.instance.physicsDebugger.getDebugDraw().GetSprite().drawSegment(point1, point2);
    }
};

/********************************************/