require('Joint');

window.PulleyJoint = cc.Class({

    extends: Joint,

    properties: {
        groundAnchorA: {
            default: null,
            type: cc.Node,
        },
        groundAnchorB: {
            default: null,
            type: cc.Node,
        },
        autoConfigureLength: {
            default: false,
        },
        lengthA: {
            default: 0,
        },
        lengthB: {
            default: 0,
        },
        maxLengthA: {
            default: 0,
        },
        maxLengthB: {
            default: 0,
        },
        ratio: {
            default: 1,
        },
    },

    // use this for initialization
    start: function () {
        this.initJoint();

        var jointDef = new b2PulleyJointDef();
        jointDef.bodyA = this.localBody;
        jointDef.bodyB = this.targetBody;
        jointDef.localAnchorA = this.localAnchor;
        jointDef.localAnchorB = this.targetAnchor;
        jointDef.collideConnected = this.enableCollision;
        jointDef.groundAnchorA = new b2Vec2(this.groundAnchorA.position.x / PTM_RATIO,
            this.groundAnchorA.position.y / PTM_RATIO);
        jointDef.groundAnchorB = new b2Vec2(this.groundAnchorB.position.x / PTM_RATIO,
            this.groundAnchorB.position.y / PTM_RATIO);
        jointDef.lengthA = this.lengthA;
        jointDef.lengthB = this.lengthB;
        jointDef.maxLengthA = this.maxLengthA;
        jointDef.maxLengthB = this.maxLengthB;
        jointDef.ratio = this.ratio;
        this.joint = Engine.instance.world.CreateJoint(jointDef);
    },
});
