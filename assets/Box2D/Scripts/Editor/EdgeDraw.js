/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : EdgeDraw.js
 * Describe : 
 *************************************************/

window.EdgeDraw = cc.Class({

    statics: {
        _linePrefab: null,
        _linePrefabPath: 'db://assets/Box2D/Resources/Prefab/Line.prefab',
    },
});

EdgeDraw.updateEdge = function (shape) {
    if (shape.vertexes.length > shape.node.childrenCount) {
        for (var i = shape.node.childrenCount; i < shape.vertexes.length; ++i) {
            var child = cc.instantiate(EdgeDraw._getLinePrefab());
            child.name = 'P_' + i;
            shape.vertexes[i] = child;
            shape.node.addChild(child);
            if (i > 0) {
                shape.node.children[i - 1].getComponent(EdgeLine).nextPoint = child;
                child.getComponent(EdgeLine).lastPoint = shape.node.children[i - 1];
            }
        }
    }
    else {
        for (var j = shape.node.childrenCount - 1; j >= shape.vertexes.length; --j) {
            if (j > 0)
                shape.node.children[j - 1].getComponent(EdgeLine).nextPoint = null;
            shape.node.removeChild(shape.node.children[j]);
        }
    }
    return shape.vertexes;
};

EdgeDraw._getLinePrefab = function () {
    if (!EdgeDraw._linePrefab) {
        Editor.assetdb.queryUuidByUrl(EdgeDraw._linePrefabPath, function (uuid) {
            cc.AssetLibrary.loadAsset(uuid, function (err, res) {
                if (err) { cc.error(err); }
                else {
                    EdgeDraw._linePrefab = res;
                }
            });
        });
    }
    return EdgeDraw._linePrefab;
};

// 由于Creator的资源加载只能异步，所以有可能导在调用_getLinePrefab后，返回的是Null值，
// 因此，在脚本一开始，就默认调用一次此函数，加载一次，确保下次调用时，不会返回Null
if (CC_EDITOR) {
    EdgeDraw._getLinePrefab();
};