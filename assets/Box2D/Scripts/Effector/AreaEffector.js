var body;

cc.Class({
    extends: cc.Component,
    
    editor: {
        requireComponent: Box2D_Body,
    },

    properties: {
        forceAngle: 0,
        forceMagnitude: 10,
    },

    // use this for initialization
    onLoad: function () {
        body = this.getComponent('Box2D_Body');
        body.bodyType = BodyType.STATIC;
        
        var callback = new CallbackEvent();
        callback.target = this;
        callback.componentName = this.__classname__;
        callback.functionName = 'onTargetEnter';
        body.onPreSolve = callback;
        
    },
    
    onTargetEnter: function (contact) {
        // 关闭碰撞反应
        contact.setEnabled(false);
        
        var targetBody = contact.targetBody;
        var radian = this.forceAngle / 360 * 2 * Math.PI;
        var force = cc.pRotateByAngle(new cc.Vec2(0, 1), cc.Vec2.ZERO, -radian);
        force.x *= this.forceMagnitude;
        force.y *= this.forceMagnitude;
        targetBody.addForce(force);
    },
});