/*************** 项目排期（按优先级排序） ******************
 * （进行中）修改EdgeShape在Editor下的LinePrefab添加方式为通过uuid加载
 * 添加EdgeShape以及PolygonShape的DebugDraw
 * 增加一个Node上可以添加多个Shape组合的属性（初步实现）
 * Edge以及Polygon增加可以通过缩放Node而进行缩放的特性
 * 添加EdgeShape以及PolygonShape顶点删除功能
 * 添加贝塞尔多曲线编辑Edge以及Polygon
 * 修复当父节点有缩放后，再旋转，子对象的图形会出问题（修改Scale为getWorldOrientedBounds，官方说Scale不准）
 * 在上一步完成后，修复DebugDraw时，如果将刚体放到Canvas下，会出现比例不对的BUG
 * 添加刚体可以锁定X/Y轴的功能
 * 优化Engine只能放在场景层级最顶端，否则会出现Body先加载，导致找不到Engine的缺陷
 * 锚点以及偏移量问题修复，目前Node的锚点只能为（0.5，0.5），否则会出异常
 * 实现Spring Joint，以及优化各种Joint的接口
 * 将Effector里的Area,Constant,Point,Surface修复下
 * 将合并组件里的Wheel实现
 * 为所有组件添加必要API
 * 为所有可用组件添加编辑器菜单，并完善i18n文件
 * 编写初步文档以及API
 * 编写Demo
 * 
 * ------------发布0.9beta------------------
 * 实现Engine的instance功能，场景中只能有一个Engine
 * 实现Bouyancy,Platform
 * 实现组合组件里的TopDwonCar
 * 设置多边形编辑为，点击“编辑”出现一些子节点可以编辑，结束编辑后删除子节点。
 * 为PackagePanel添加检测升级按钮，实现在菜单中检测插件版本，并升级到最新版
 * 尝试在Package的JS里加入写入文件的方法，然后实现在属性面板中编辑物理类型时，能通过Panel的JS写入到Enum中
 * 修复通过动画改变刚体位置时，如果有其他的刚体作为他的子物体，某种情况会出现异常
 * 完善文档以及API
 * 完善Demo
 * 
 * ------------发布1.0----------------------
 * 修复原生JSB无法正常Destory Node的BUG（是官方问题，待官方修复）
 * 待官方插件接口开放充足，在属性面板为各个组件添加一个Git示例
 * 
 ************************************************************/

/*
    Node.prototype.getWorldOrientedBounds = function (size, out_bl, out_tl, out_tr, out_br) {
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
*/
 