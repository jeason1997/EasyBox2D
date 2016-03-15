cc.Class({
    extends: cc.Component,
    
    editor: {
        executeInEditMode: true,
    },

    onLoad: function () {
        
        
        if (CC_EDITOR)
        {
            Editor.assetdb.queryUuidByUrl( 'db://assets/Box2D/Prefab/Line.prefab', function (uuid) {
                cc.AssetLibrary.loadAsset(uuid, function (err, res) {
                if (err) {
                    cc.error(err);
                }
                else {
                    cc.log('Load Success : ' + res);
                    var child = cc.instantiate(res);
                    child.name = 'P';
                    this.node.addChild(child);
                }
            }.bind(this));
            }.bind(this));
        
            
        }
        
        
        

    },
    
});
