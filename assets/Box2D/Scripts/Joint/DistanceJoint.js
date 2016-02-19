/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_DistanceJoint.js
 * Describe : 
 *************************************************/

require('Joint');

DistanceJoint = cc.Class({

    extends: Joint,

    properties: {
        autoConfigureLength: {
            default: false,
        },
        jointLength: {
            default: 1,
            notify: function () {
            },
        },
        frequencyHz: {
            default: 4,
            notify: function () {
            },
        },
        dampingRation: {
            default: 0.5,
            notify: function () {
            },
        },
    },

    start: function () {
        this.initJoint();

        var jointDef = new b2DistanceJointDef();
        jointDef.bodyA = this.localBody;
        jointDef.bodyB = this.targetBody;
        jointDef.localAnchorA = this.localAnchor;
        jointDef.localAnchorB = this.targetAnchor;
        if (this.autoConfigureLength) {
            this.jointLength = cc.pDistance(this.localBody.GetPosition(), 
                this.targetBody.GetPosition());
        }
        jointDef.length = this.jointLength;
        jointDef.dampingRation = this.dampingRation;
        jointDef.frequencyHz = this.frequencyHz;
        jointDef.collideConnected = this.enableCollision;
        this.joint = Box2D_Engine.instance.world.CreateJoint(jointDef);
    },
});
