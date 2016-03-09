require('Joint');

window.PrismaticJoint = cc.Class({
    extends: Joint,

    properties: {
        autoConfigureAxisA: {
            default: false,
        },
        localAxisA: {
            default: new cc.Vec2(0, 0),
        },
        enableLimit: {
            default: false,
        },
        lowerTranslation: {
            default: 0,  
        },
        upperTranslation: {
            default: 0,
        },
        enableMotor: {
            default: false,
        },
        motorSpeed: {
            default: 0,
        },
        maxMotorForce: {
            default: 0,
        },
        referenceAngle: {
            default: 0,
        },
    },

    start: function () {
        this.initJoint();

        var jointDef = new b2PrismaticJointDef();
        jointDef.bodyA = this.localBody;
        jointDef.bodyB = this.targetBody;
        jointDef.localAnchorA = this.localAnchor;
        jointDef.localAnchorB = this.targetAnchor;
        if (this.autoConfigureAxisA) {
            //
        }
        else {
            jointDef.localAxisA = this.localAxisA;
        }
        jointDef.collideConnected = this.enableCollision;
        jointDef.enableLimit = this.enableLimit;
        jointDef.enableMotor = this.enableMotor;
        jointDef.lowerTranslation = this.lowerTranslation;
        jointDef.upperTranslation = this.upperTranslation;
        jointDef.maxMotorForce = this.maxMotorForce;
        jointDef.motorSpeed = this.motorSpeed;
        jointDef.referenceAngle = this.referenceAngle / 360 * (2 * Math.PI);
        
        this.joint = Box2D_Engine.instance.world.CreateJoint(jointDef);
    },
});
