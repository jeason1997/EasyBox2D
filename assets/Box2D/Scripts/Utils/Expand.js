// Expand the cc.Node function
cc.Node.prototype.convertToWorldRotation = function (rotation) {
    var rot = rotation ? rotation : this.rotation;
    var parent = this.parent;
    while(parent.parent){
        rot += parent.rotation;
        parent = parent.parent;
    }
    return rot;
};

cc.Node.prototype.convertToNodeRotation = function (rotation) {
    rotation -= this.rotation;
    var parent = this.parent;
    while(parent.parent){
        rotation -= parent.rotation;
        parent = parent.parent;
    }
    return rotation;
};

cc.Node.prototype.convertToWorldPosition = function (position) {
    var pos = position ? position : this.position;
    var parent = this.parent;
    while (parent.parent) {
        pos.x += parent.position.x;
        pos.y += parent.position.y;
        parent = parent.parent;
    }
    return pos;
};

cc.Node.prototype.convertToNodePosition = function (position) {
    position -= this.position;
    var parent = this.parent;
    while(parent.parent){
        position.x -= parent.position.x;
        position.y -= parent.position.y;
        parent = parent.parent;
    }
    return position;
};

cc.Node.prototype.convertToWorldScale = function () {
    var scaleX = this.scaleX;
    var scaleY = this.scaleY;
    var parent = this.parent;
    while (parent.parent) {
        scaleX *= parent.scaleX;
        scaleY *= parent.scaleY;
        parent = parent.parent;
    }
    return new cc.Vec2(scaleX, scaleY);
};