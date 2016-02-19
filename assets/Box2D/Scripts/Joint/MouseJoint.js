require('Box2D_Body');

MouseJoint = cc.Class({

    extends: cc.Component,

    editor: {
        requireComponent: Box2D_Body,
    },

    properties: {
        localBody: {
            default: null,
            visible: false,
        },
        dragForce: 500,
        dampingRatio: 0.7,
        frequencyHz: 5,
        joint: {
            default: null,
            visible: false,
        },
    },

    // use this for initialization
    start: function () {
        var self = this;

        this.localBody = this.getComponent(Box2D_Body).body;

        // this.node.on('touchstart', this.mouseDown, this);
        this.node.on('mousedown', this.mouseDown, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                // If return false, it will capture the next event - onTouchMoved && onTouchEnded
                return true;
            },
            onTouchMoved: function (touch, event) {
                if (self.joint) {
                    var p = new b2Vec2(touch.getLocationX() / PTM_RATIO, touch.getLocationY() / PTM_RATIO);
                    self.joint.SetTarget(p);
                }
            },
            onTouchEnded: function (touch, event) {
                if (self.joint) {
                    Box2D_Engine.instance.world.DestroyJoint(self.joint);
                    self.joint = null;
                }
            }
        }, this.node);
    },

    mouseDown: function (event) {
        if (this.joint) {
            Box2D_Engine.instance.world.DestroyJoint(this.joint);
            this.joint = null;
        }
        
        // 待修复，用touch取代mouse
        // var touch = event.touch;
        var touch = event;
        
        var md = new b2MouseJointDef();
        md.bodyA = Box2D_Engine.instance.world.GetGroundBody();
        md.bodyB = this.localBody;
        md.target.Set(touch.getLocationX() / PTM_RATIO, touch.getLocationY() / PTM_RATIO);
        md.dampingRatio = this.dampingRatio;
        md.frequencyHz = this.frequencyHz;
        md.collideConnected = this.enableCollision;
        md.maxForce = this.dragForce * this.localBody.GetMass();
        this.joint = Box2D_Engine.instance.world.CreateJoint(md);
        this.localBody.SetAwake(true);
    },

    onDestroy: function () {
        Box2D_Engine.instance.world.DestroyJoint(this.joint);
    },
});
