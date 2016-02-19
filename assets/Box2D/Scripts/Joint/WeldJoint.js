require('Joint');

WeldJoint = cc.Class({

    extends: Joint,

    properties: {
        autoConfigureTargetdAnchor: {
            default: false,
        },
        referenceAngle: {
            default: 0
        },
    },

    start: function () {
        this.initJoint();

        var jointDef = new b2WeldJointDef();
        jointDef.bodyA = this.localBody;
        jointDef.bodyB = this.targetBody;
        jointDef.localAnchorA = this.localAnchor;
        if (this.autoConfigureTargetdAnchor) {
            var pos_1 = this.localBody.GetPosition();
            var pos_2 = this.targetBody.GetPosition();
            jointDef.localAnchorB = new b2Vec2(pos_1.x - pos_2.x, pos_1.y - pos_2.y);
        }
        else {
            jointDef.localAnchorB = this.targetAnchor;
        }
        jointDef.collideConnected = this.enableCollision;
        jointDef.referenceAngle = this.referenceAngle / 360 * (2 * Math.PI);

        this.joint = Box2D_Engine.instance.world.CreateJoint(jointDef);
    },
});

