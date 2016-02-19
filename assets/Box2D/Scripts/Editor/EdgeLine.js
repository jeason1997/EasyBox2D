EdgeLine = cc.Class({
    extends: cc.Component,
    
    editor: {
        executeInEditMode: true,  
    },

    properties: {
        lastPoint: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        nextPoint: {
            default: null,
            type: cc.Node,
            visible: false,
        },
    },


    onLoad: function () {
        // 加了后此节点只在编辑器模式下显示，允许后就消失了
        //this.node._objFlags |= cc.Object.Flags.DontSave;
        
        pathClose = this.node.parent.getComponent(Box2D_Shape).close;
        
        this.node.on('position-changed', function ( event ) {
            
            if (this.lastPoint) {
                // Update position to this point.
                this.lastPoint.getComponent(EdgeLine).lineToPoint();
            }
            else if (pathClose) {
                // Path close
                this.node.parent.children[this.node.parent.childrenCount - 1].position = this.node.position;
            }
        
            this.lineToPoint();
            
        }, this);
        
        if (!this.nextPoint) {
            this.node.width = 0;
        }
    },
    
    lineToPoint: function () {
        
        if (this.nextPoint) {
            // Update this point's position to the nextPoint
            var p1 = this.node.position;
            var p2 = this.nextPoint.position;
            var x = p2.x - p1.x;
            var y = p2.y - p1.y;
            var rot = Math.atan2(x, y) / (2 * Math.PI) * 360 - 90;
            this.node.rotation = rot;
            
            this.node.width = cc.pDistance(p1, p2);
        } 
        else {
            // Last point's path's length much be zero.
            this.node.width = 0;
            // Path close
            if (pathClose)
                this.node.parent.children[0].position = this.node.position;
        }
    },
});
