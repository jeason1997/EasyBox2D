require('RevoluteJoint');
require('PrismaticJoint');

var GearJointType = cc.Enum({
    REVOLUTE: 0,
    PRISMATIC: 1,
});

window.GearJoint = cc.Class({

    extends: cc.Component,

    properties: {
        joint1_Type: {
            default: GearJointType.REVOLUTE,
            type: GearJointType,
        },
        revoluteJoint1: {
            default: null,
            type: RevoluteJoint,
        },
        prismaticJoint1: {
            default: null,
            type: PrismaticJoint,
        },
        joint2_Type: {
            default: GearJointType.REVOLUTE,
            type: GearJointType,
        },
        revoluteJoint2: {
            default: null,
            type: RevoluteJoint,
        },
        prismaticJoint2: {
            default: null,
            type: PrismaticJoint,
        },
        ratio: {
            default: 1,
        },
        joint: {
            default: null,
            visible: false,
        },
    },

    start: function () {
        // 延迟一帧执行：由于GearJoint需要引用到其他joint，为了防止
        // 其他joint的Node顺序在该Node之下导致引用的时候，joint
        // 还未生成，所以GearJonit的创建函数必须比其他任何Jonit都慢
        this.scheduleOnce(function() {
            this.createJoint();
        }, 1 / 60);
    },

    createJoint: function () {
        var jointDef = new b2GearJointDef();
        jointDef.bodyA = Box2D_Engine.instance.world.GetGroundBody();
        if (this.joint1_Type === GearJointType.REVOLUTE) {
            jointDef.joint1 = this.revoluteJoint1.joint;
        }
        else {
            jointDef.joint1 = this.prismaticJoint1.joint;
        }
        if (this.joint2_Type === GearJointType.REVOLUTE) {
            jointDef.joint2 = this.revoluteJoint2.joint;
        }
        else {
            jointDef.joint2 = this.prismaticJoint2.joint;
        }
        jointDef.ratio = this.ratio;
        jointDef.collideConnected = this.enableCollision;

        this.joint = Box2D_Engine.instance.world.CreateJoint(jointDef);
    },
});

