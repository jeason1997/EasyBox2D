require('Joint');

RevoluteJoint = cc.Class({

    extends: Joint,

    properties: {
        autoConfigureTargetdAnchor: {
            default: false,
        },
        enableLimit: {
            default: false,
        },
        lowerAngle: {
            default: 0,  
        },
        upperAngle: {
            default: 0,
        },
        referenceAngle: {
            default: 0,
        },
        enableMotor: {
            default: false,
        },
        motorSpeed: {
            default: 0,
        },
        maxMotorTorque: {
            default: 0,
        },
        breakTorque: {
            default: -1,
        },
    },


    start: function () {
        this.initJoint();
        
        var jointDef = new b2RevoluteJointDef();
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
        jointDef.enableLimit = this.enableLimit;
        jointDef.enableMotor = this.enableMotor;
        jointDef.lowerAngle = this.lowerAngle / 360 * (2 * Math.PI);
        jointDef.upperAngle = this.upperAngle / 360 * (2 * Math.PI);
        jointDef.referenceAngle = this.referenceAngle / 360 * (2 * Math.PI);
        jointDef.maxMotorTorque = this.maxMotorTorque;
        jointDef.motorSpeed = this.motorSpeed;
        
        this.joint = Box2D_Engine.instance.world.CreateJoint(jointDef);
    },
});
