cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: false,
    },
    
    properties: {
        p1: new cc.Vec2(0, 0),
        p2: new cc.Vec2(100, 100),
    },
    
    onLoad: function () {
        this.draw = new cc.DrawNode();
        cc.Canvas.instance.node.parent._sgNode.addChild(this.draw);
    },
    
    update: function(dt) {
        Physics.rayCast(this.p1, this.p2, this.back.bind(this));
    },
    
    back: function(fixture, point, normal, fraction) {
        this.draw.clear();
        this.draw.drawDot(new cc.Vec2(point.x * PTM_RATIO, point.y * PTM_RATIO), 
        5, new cc.Color(0, 255, 0, 150));
    },
});
