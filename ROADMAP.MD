#项目排期（按优先级排序）

 * 尝试在属性面板以及Gizmo里使用Paper, 尝试在属性面板里使用Canvas,Webgl
 * 为Joint添加DebugDraw
 * 修改碰撞监听函数为Creator新版自带的EventHandle
 * `BUG`获取Shape时，现在可以获取多个Shape了，但EdgeShape还不能正常获得
 * 一个Node身上只能有一个Body组件，这样可以避免许多问题，U3D也是这样做的。(而且Body应该放在最上，U3D如果上层还有Collider，会出错，我们直接无视上层Shape)
 * 调整BoxShape的Gizmo为拖动顶点时，会根据当前长度动态改变当前位置（类似U3D的那种）
 * 模仿Uniyt3D的物理材质这一属性，可以将物理属性导出为资源，供多个刚体共同引用
 * （大更新）将直接从Shape处获取属性改为跟Node的Transform相关，这样就可以在Node Scale后，Shape仍然正确（像U3D，Go缩放后，Colliser也缩放，但Collider的Radius仍然没变）
 * 继上：缩放Node也会缩放Edeg跟Polygon的顶点以及Circle的半径等
 * `BUG`由于获取Shape只是获取它的offer,所以如果Shape在子物体身上又没offer，位置会不对
 * `优化`添加Shape时，模式大小应该跟Node对应上，如果默认Node size为0，则赋予Shape大小默认值
 * 添加贝塞尔多曲线编辑Edge
 * 将Distance Joint 跟 Spring Joint 改为 弹簧 与 绳子 节点
 * 添加刚体可以锁定X/Y轴的功能
 * 添加Shaper的Gizmo着色处理，静态动态物体的颜色不同。
 * 优化Engine只能放在场景层级最顶端，否则会出现Body先加载，导致找不到Engine的缺陷
 * 实现Spring Joint，以及优化各种Joint的接口
 * 将Effector里的Area,Constant,Point,Surface修复下
 * 将合并组件里的Wheel实现
 * 初次添加Engine组件时，Engine的Category从JSON配置文件里读取并初始化，而不是一个空的数组
 * Body的Category Target Mask实现
 * 为所有组件添加必要API
 * 为所有可用组件添加编辑器菜单，并完善i18n文件
 * 编写初步文档以及API
 * 编写Demo
 -------------
 >发布0.9beta
 
 * 实现Engine的instance功能，场景中只能有一个Engine
 * 实现Bouyancy,Platform
 * 实现组合组件里的TopDwonCar
 * 为PackagePanel添加检测升级按钮，实现在菜单中检测插件版本，并升级到最新版
 * 完善文档以及API
 * 完善Demo
 -------------
 >发布1.0
 
 * 同上，待属性面板支持修改后，将Engine的Category的运行方式由notify（每输入一次字符都会通知一次很饭）修改为按按钮发送修改事件。
 * 添加凹多边形支持
 * 添加根据图片纹理自动生成多边形顶点
 -------------
 ``` javascript
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
```