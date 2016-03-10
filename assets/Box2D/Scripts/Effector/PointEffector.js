var body;

cc.Class({
    extends: cc.Component,
    
    editor: {
        requireComponent: Body,
    },

    properties: {
        forceMagnitude: 10,
    },

    // use this for initialization
    onLoad: function () {
        body = this.getComponent('Body');
        body.bodyType = BodyType.STATIC;
        
        var callback = new CallbackEvent();
        callback.target = this;
        callback.componentName = this.__classname__;
        callback.functionName = 'onTargetEnter';
        body.onPreSolve = callback;
    },
    
    onTargetEnter: function (contact) {
        contact.setEnabled(false);
        
        var targetBody = contact.targetBody;
        var p = new cc.Vec2(body.body.GetPosition());
        var force = p.sub(targetBody.body.GetPosition());
        
        force.x *= this.forceMagnitude;
        force.y *= this.forceMagnitude;
        targetBody.addForce(force);
    },
});
