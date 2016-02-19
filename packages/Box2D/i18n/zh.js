module.exports.Editor = {
 'menu_box2d': '物理组件/打开物理面板',
 'menu_ingame': '物理组件/打开游戏面板',
 'box2dPanel': '物理演示',
 'inGamePanel': '游戏',
};

module.exports.Engine = {
  'menu': '物理组件/基本/引擎',
  'playInEditor': '在编辑器里演示',
  'playInEditor_tooltip': '点击即可在编辑器里演示物理效果（这其实是个按钮）',
  'startEngine': '启动引擎',
  'startEngine_tooltip': '是否启动物理模拟',
  'gravity': '重力',
  'gravity_tooltip': '',
  'allowSleep': '允许睡眠',
  'allowSleep_tooltip': '若允许，则已睡眠的刚体将不参与物理模拟，以节省效率',
  'timeStep': '模拟帧率',
  'timeStep_tooltip': '一般为60帧，即1/60秒',
  'velocityIterations': '速率迭代次数',
  'velocityIterations_tooltip': '',
  'positionIterations': '位置迭代次数',
  'positionIterations_tooltip': '',
};

module.exports.Body = {
  'menu': '物理组件/基本/刚体',
  'noshape_error': '该刚体上没有任何形状，请先添加形状再添加刚体 !',
  'bodyType': '刚体类型',
  'bodyType_tooltip': '分为‘静态’‘可运动’‘动态’',
  'isSensor': '触发器',
  'isSensor_tooltip': '触发器不参与碰撞反应，但能进行碰撞检测',
  'density': '密度',
  'density_tooltip': '',
  'friction': '摩擦力',
  'friction_tooltip': '',
  'restitution': '反弹系数',
  'restitution_tooltip': '反弹系数表示刚体碰撞后反弹的能力，也即是碰撞时损耗能量的大小。\n系数越大，反弹越强，损耗越小。一般为 0 - 1 之间的值，但可超过这个范围。',
  'onBeginContact': '碰撞检测——开始碰撞',
  'onBeginContact_tooltip': '碰撞开始时会触发该监听',
  'onEndContact': '碰撞检测——结束碰撞',
  'onEndContact_tooltip': '碰撞结束后会触发该监听',
  'onPreSolve': '碰撞检测——准备碰撞',
  'onPreSolve_tooltip': '即将碰撞时会触发该监听',
  'onPostSolve': '碰撞检测——正在碰撞',
  'onPostSolve_tooltip': '碰撞过程中会一直触发该监听',
};

module.exports.CallbackEvent = {
  'target': '目标节点',
  'target_tooltip': '要监听该碰撞事件的目标',
  'componentName': '组件名',
  'componentName_tooltip': '要触发回调的组件的名字',
  'functionName': '函数名',
  'functionName_tooltip': '要触发回调的函数的名字',
};

module.exports.Shape = {
  'addshape_error': 'Shape 基类不允许被添加为组件 !',
  'shapeType': '形状类型',
};

module.exports.Shape.BoxShape = {
  'menu': '物理组件/形状/矩形形状',
  'sameAsNode': '自动设置矩形大小',
  'sameAsNode_tooltip': '自动根据节点的尺寸设置矩形的大小',
  'box': '矩形（宽x高）',
  'box_tooltip': '若选择‘自动设置大小’，则此项无效',
  'offset': '偏移量',
  'offset_tooltip': '矩形框相对节点中心点（不是锚点）的偏移量',
};

module.exports.Shape.CircleShape = {
  'menu': '物理组件/形状/圆形形状',
  'sameAsNode': '自动设置圆形大小',
  'sameAsNode_tooltip': '自动根据节点的宽设置圆形的大小',
  'diameter': '直径',
  'diameter_tooltip': '若选择‘自动设置大小’，则此项无效',
  'offset': '偏移量',
  'offset_tooltip': '圆形框相对节点中心点（不是锚点）的偏移量',
};

module.exports.Shape.PolygonShape = {
  'menu': '物理组件/形状/多边形形状',
  'offset': '偏移量',
  'offset_tooltip': '矩形框相对节点中心点（不是锚点）的偏移量',
};

module.exports.Shape.EdgeShape = {
  'menu': '物理组件/形状/边缘形状',
  'offset': '偏移量',
  'offset_tooltip': '边缘框相对节点中心点（不是锚点）的偏移量',
};

module.exports.Joint = {
};

module.exports.Joint.Box2D_DistanceJoint = {
};