/* 1. 锚点以及偏移量问题修复，目前锚点只能为（0.5，0.5），否则会出异常
 * 2. 当父节点有缩放后，再旋转，子对象的图形会出问题
 用 Node.prototype.getWorldOrientedBounds = function (size, out_bl, out_tl, out_tr, out_br) {
    size = size || this.getContentSize();
    var width  = size.width;
    var height = size.height;

    out_bl = out_bl || new cc.Vec2();
    out_tl = out_tl || new cc.Vec2();
    out_tr = out_tr || new cc.Vec2();
    out_br = out_br || new cc.Vec2();

    var rect = new cc.Rect(0, 0, width, height);
    var mat = this.getNodeToWorldTransform();
    cc.engine.obbApplyAffineTransform(mat, rect, out_bl, out_tl, out_tr, out_br);

    return [out_bl, out_tl, out_tr, out_br];
};



 * 6. 千万别将刚体放在canvas里，canvas里获取node位置有BUG，比如（480， 320）的位置，读取后是（640    
            ---------------  0.8 已修复
 * 7. 实现Engine 的 instance
 * 8. 通过动画改变刚体位置时，最好不要加入其它刚体作为他的子物体，否则。。。。（明天试试不是动画，只是单纯地改变位置会不会出问题）
 * 9. 添加Destroy Body 跟 Joint 
 * 12.添加顶点删除功能
 * 13.锁定X,Y轴
 * 14.建议scheduleOnce添加延迟帧执行的方法（已经解决，最后的参数为0即可，因为schedule不管参数多少，最快在下一帧执行）
 * 15.Engine只能位于层级管理里的最顶层，不然会出现使用body时engine未初始化的问题。
 * 16.设置多边形编辑为，点击“编辑”出现一些子节点可以编辑，结束编辑后删除子节点。
 * 17.添加贝塞尔多边形编辑
 * 18.edge不支持缩放
 * 19.修复将Node放到canvas里，导致debugdraw比例不对的问题
 
 * 20.模拟器原生jsb有个BUG：
 一个节点上挂两个组件，一个sprite一个destory,里面就一句destory代码：
 在web下一切正常，在模拟器下，会出现以下BUG：
    1.如果这个node的组件顺序为sprite在上，destroy在下，那么正常，运行游戏后Node消失

    2.如果顺序反过来，即destroy在上，那么会出现的后果就是，运行后该node并没被destroy

    待官方修复

 */