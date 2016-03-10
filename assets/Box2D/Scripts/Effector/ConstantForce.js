var body;

cc.Class({
    extends: cc.Component,
    
    editor: {
        requireComponent: Body,
    },

    properties: {
        _force: new cc.Vec2(0, 0),
        force: {
            set: function (value) {
                this._force = value;
            },
            get: function () {
                if (this.relativeForce && !CC_EDITOR) {
                    var angle = this.node.convertToWorldRotation();
                    var radian = angle / 360 * 2 * Math.PI;
                    return cc.pRotateByAngle(this._force, cc.Vec2.ZERO, -radian);
                }
                return this._force;
            },
        },
        relativeForce: false,
        torque: 0,
    },

    // use this for initialization
    onLoad: function () {
        body = this.getComponent('Box2D_Body');
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // 待优化，调节到与Engine的Setp同步
        body.addForce(this.force);
        body.addTorque(this.torque);
    },
});
