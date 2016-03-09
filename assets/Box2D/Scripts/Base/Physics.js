// Editor Mode
window.CC_EDITOR = (cc.engine !== undefined);

// 物理世界里的一米对应屏幕上的像素
window.PTM_RATIO = 32;

// Box2D Defined
var Box2D = require('box2dweb-commonjs');
b2AABB = Box2D.b2AABB;
b2World = Box2D.b2World;
b2AABB = Box2D.b2AABB;
b2Body = Box2D.b2Body;
b2BodyDef = Box2D.b2BodyDef;
b2CircleShape = Box2D.b2CircleShape;
b2Fixture = Box2D.b2Fixture;
b2FixtureDef = Box2D.b2FixtureDef;
b2Vec2 = Box2D.b2Vec2;
b2DebugDraw = Box2D.b2DebugDraw;
b2MassData = Box2D.b2MassData;
b2PolygonShape = Box2D.b2PolygonShape;
b2PrismaticJointDef = Box2D.b2PrismaticJointDef;
b2RevoluteJointDef = Box2D.b2RevoluteJointDef;
b2DistanceJointDef = Box2D.b2DistanceJointDef;
b2Transform = Box2D.b2Transform;
b2ContactListener = Box2D.b2ContactListener;
b2MouseJointDef = Box2D.b2MouseJointDef;
b2FilterData = Box2D.b2FilterData;
b2EdgeShape = Box2D.b2EdgeShape;
b2LineJointDef = Box2D.b2LineJointDef;
b2WeldJointDef = Box2D.b2WeldJointDef;
b2GearJointDef = Box2D.b2GearJointDef;
b2PrismaticJointDef = Box2D.b2PrismaticJointDef;
b2FrictionJointDef = Box2D.b2FrictionJointDef;
b2PulleyJointDef = Box2D.b2PulleyJointDef;

// Category
Category = cc.Enum({
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

Ray = cc.Class({
    
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

window.Physics = {
    rayCast: function(point1, point2, callback) {
        var p1 = new b2Vec2(point1.x / PTM_RATIO, point1.y / PTM_RATIO);
        var p2 = new b2Vec2(point2.x / PTM_RATIO, point2.y / PTM_RATIO);
        Box2D_Engine.instance.world.RayCast(callback, p1, p2);
        
        // Debugdraw
        if (Box2D_Engine.instance.physicsDebugger.openDebug && Box2D_Engine.instance.physicsDebugger.drawRay) {
            Box2D_Engine.instance.physicsDebugger.getDebugDraw().GetSprite().drawSegment(point1, point2);
        }
    },
};