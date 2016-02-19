var body;

cc.Class({
    extends: cc.Component,
    
    editor: {
        requireComponent: Box2D_Body,
    },

    properties: {
        speed: 0,
    },

    onLoad: function () {
        body = this.getComponent('Box2D_Body');
        var callback = new CallbackEvent();
        callback.target = this;
        callback.componentName = this.__classname__;
        callback.functionName = 'onTargetEnter';
        body.onPreSolve = callback;
    },
    
    onTargetEnter: function (contact) {
        var targetBody = contact.targetBody;
        var angle = this.node.convertToWorldRotation();
        var radian = angle / 360 * 2 * Math.PI;
        var force = cc.pRotateByAngle(new cc.Vec2(1, 0), cc.Vec2.ZERO, -radian);
        force.x *= this.speed;
        force.y *= this.speed;
        targetBody.addForce(force);
    },
});
