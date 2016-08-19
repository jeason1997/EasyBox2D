'use strict';

let Circle = require('G:/EasyBox2D/packages/Box2D/gizmos/GizmoTool');

class CircleShape extends Editor.Gizmo {

    onCreateRoot() {

        this.bigCircle = new Circle(this._root.group())
            .color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)')
            .stytle(2, null, 'move')
            ;

        this.smallCircle = new Circle(this.bigCircle)
            .color('rgba(0,128,255,1)', 'rgba(0,128,255,1)')
            .stytle(1, null, 'pointer')
            .radius(3)
            ;

        Editor.GizmosUtils.addMoveHandles(this.bigCircle.shape, this.move());
        Editor.GizmosUtils.addMoveHandles(this.smallCircle.shape, this.resize());
    }

    move() {
        return {
            start: function (x, y, event) {
                this.startRadius = this.target.radius;
                this.pressx = x;
                this.pressy = y;
                this.updated = false;
            }.bind(this),
            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0) {
                    return;
                }
                this.updated = true;

                // 获取 gizmo 依附的节点
                let node = this.node;

                // 记录节点信息的 undo 信息，注意参数为节点的 uuid
                _Scene.Undo.recordNode(node.uuid);

                // 获取 svg view 坐标系下点
                let x = this.pressx + dx, y = this.pressy + dy;
                // 获取节点世界坐标系下点
                let pos = this._view.pixelToWorld(cc.v2(x, y));

                this.target.offset = pos;

                // 更新 gizmo view 
                this._view.repaintHost();

            }.bind(this),
            end: function (event) {
                // 判断是否有操作过 gizmo, 没有则跳过处理
                if (this.updated) {
                    // 如果 gizmo 有修改需要进入 animation 编辑的属性，需要调用此接口来更新数据
                    // _Scene.AnimUtils.recordNodeChanged(this.node);

                    // 推送修改到 undo 下，结束 undo
                    _Scene.Undo.commit();
                }
            }.bind(this)
        };
    }

    resize() {
        return {
            start: function (x, y, event) {
                this.startRadius = this.target.radius;
                this.pressx = x;
                this.pressy = y;
                this.updated = false;
            }.bind(this),
            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0) {
                    return;
                }
                this.updated = true;

                // 获取 gizmo 依附的节点
                let node = this.node;

                // 记录节点信息的 undo 信息，注意参数为节点的 uuid
                _Scene.Undo.recordNode(node.uuid);

                // 获取 svg view 坐标系下点
                let x = this.pressx + dx, y = this.pressy + dy;
                // 获取节点世界坐标系下点
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                // 转换坐标点到节点下
                pos = node.convertToNodeSpaceAR(pos);
                // 计算 radius
                let radius = pos.mag();
                // js 在做一些计算后会出现小数位过长的情况， Editor.Math.toPrecision 会帮助做一些小数位的截取
                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                this.target.radius = Editor.Math.toPrecision(radius, minDifference);

                // 更新 gizmo view 
                this._view.repaintHost();
            }.bind(this),
            end: function (event) {
                // 判断是否有操作过 gizmo, 没有则跳过处理
                if (this.updated) {
                    // 如果 gizmo 有修改需要进入 animation 编辑的属性，需要调用此接口来更新数据
                    // _Scene.AnimUtils.recordNodeChanged(this.node);

                    // 推送修改到 undo 下，结束 undo
                    _Scene.Undo.commit();
                }
            }.bind(this)
        };
    }

    onUpdate() {
        if (this.target.editing) {
            this.enterEditing();
        }
        else {
            this.leaveEditing();
        }

        let node = this.node;
        let radius = this.target.radius;

        let p = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.offset)));

        let p1 = node.convertToWorldSpace(cc.v2(0, 0));
        let p2 = node.convertToWorldSpace(cc.v2(radius, 0));
        let d = p1.sub(p2).mag();

        // 移动 svg 工具到坐标
        this.bigCircle.radius(d);
        this.bigCircle.position(p.x, p.y);
        this.smallCircle.position(d, 0);
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.bigCircle.color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)');
        this.smallCircle.shape.show();

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.bigCircle.shape.fill('none');
        this.smallCircle.shape.hide();

        this._targetEditing = false;
    }

    // 如果需要自定义 Gizmo 显示的时机，重写 visible 函数即可
    visible() {
        return true;
    }

    // Gizmo 创建在哪个 Layer 中 : foreground, scene, background
    // 默认创建在 scene Layer
    layer() {
        return 'scene';
    }

    // 如果 Gizmo 需要参加 点击测试，重写 rectHitTest 函数即可
    //    rectHitTest (rect, testRectContains) {
    //        return false;
    //    }
}

module.exports = CircleShape;