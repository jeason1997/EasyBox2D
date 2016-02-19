var sceneWorld = null;
var timeStep = 0.016;
var velocityIterations = 6;
var positionIterations = 2;

Editor.registerPanel('Box2D.panel', {
    'physics:run' (worldData) {

        var b2Vec2 = Box2D.Common.Math.b2Vec2,
            b2AABB = Box2D.Collision.b2AABB,
            b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
            b2Fixture = Box2D.Dynamics.b2Fixture,
            b2World = Box2D.Dynamics.b2World,
            b2MassData = Box2D.Collision.Shapes.b2MassData,
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
            b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
            b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

        sceneWorld = new b2World(worldData.gravity, worldData.allowSleep);
        timeStep = worldData.timeStep;
        velocityIterations = worldData.velocityIterations;
        positionIterations = worldData.positionIterations;

        //setup debug draw
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(this.$.canvas.getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        sceneWorld.SetDebugDraw(debugDraw);

        var bodyList = worldData.bodyList;
        for (i = 0; i < bodyList.length; ++i) {
            var fixDef = new b2FixtureDef();
            fixDef.density = bodyList[i].fixtureDef.density;
            fixDef.friction = bodyList[i].fixtureDef.friction;
            fixDef.restitution = bodyList[i].fixtureDef.restitution;

            var shape;
            if (bodyList[i].shapeData.radius) {
                shape = new b2CircleShape(bodyList[i].shapeData.radius);
                shape.SetLocalPosition(bodyList[i].shapeData.offset);
            } else if (bodyList[i].shapeData.box) {
                shape = new b2PolygonShape();
                shape.SetAsBox(bodyList[i].shapeData.box.x, bodyList[i].shapeData.box.y);
            }
            fixDef.shape = shape;

            var bodyDef = bodyList[i].bodyDef;

            sceneWorld.CreateBody(bodyDef).CreateFixture(fixDef);
        }
    },

    ready() {
        var b2Vec2 = Box2D.Common.Math.b2Vec2,
            b2AABB = Box2D.Collision.b2AABB,
            b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
            b2Fixture = Box2D.Dynamics.b2Fixture,
            b2World = Box2D.Dynamics.b2World,
            b2MassData = Box2D.Collision.Shapes.b2MassData,
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
            b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
            b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

        window.setInterval(update, 1000 / 60);
        //update

        function update() {
            if (sceneWorld) {
                sceneWorld.Step(timeStep, velocityIterations, positionIterations);
                sceneWorld.DrawDebugData();
                sceneWorld.ClearForces();
            }
        };

    },
});