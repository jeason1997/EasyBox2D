cc.Class({
    extends: cc.Component,

    properties: {
        texture: {
            default: null,
        },
        endXPosition: {
            default: 500,
            notify: function () {
                this.createBridge();
            },
        },
        block: {
            default: new cc.Vec2(50, 20),
            notify: function () {
                this.createBridge();
            },
        },
        interval: {
            default: 0,
            notify: function () {
                this.createBridge();
            },
        },
        allowBlockCollsion: {
            default: false,
        },
        friction: {
            default: 0.3,
        },
        elastic: {
            default: 15,
        },
        breakForce: {
            default: -1,
        },
    },

    // use this for initialization
    createBridge: function () {
        var blockCount = this.endXPosition / (this.block.x + this.interval);
        
        this.node.removeAllChildren();
        for (var i = 0; i < blockCount; ++i) {
            var block = new cc.Node();
            block.name = 'Block_' + i;
            block.width = this.block.x;
            block.height = this.block.y;
            block.x = this.endXPosition / blockCount * i + this.block.x / 2;
            block.parent = this.node;
            
            var shape = block.addComponent(Box2D_BoxShape);
            
                var body = block.addComponent(Box2D_Body);
                
                var joint = block.addComponent(RevoluteJoint);
                // 第一个Body的节点连接GroundBody
                if (i > 0)
                {
                    joint.targetBody = this.node.children[i - 1].getComponent(Box2D_Body);
                    joint.enableLimit = true;
                    joint.lowerAngle = -this.elastic;
                    joint.upperAngle = this.elastic;
                    joint.autoConfigureTargetdAnchor = false;
                    joint.localAnchor = new cc.Vec2(-(this.block.x + this.interval) / 2, 0);
                    joint.targetAnchor = new cc.Vec2((this.block.x + this.interval) / 2, 0)
                    joint.enableCollison = this.allowBlockCollsion;
                    joint.breakForce = this.breakForce;
                }
                // 最后一个Body加多一个节点来连接GroundBody
                if (i >= blockCount - 1) {
                    block.addComponent(RevoluteJoint);
                }
            
        }
        
    },
});
