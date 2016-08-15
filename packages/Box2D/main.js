'use strict';

var fs = require("fs");
var filePath = 'db://assets/Box2D/Scripts/Contact/Category.js';

var generateEnum = function (phyType) {
    var type = '\n';
    var properties = '';
    for (var i = 0; i < phyType.length && i < 16; ++i) {
        if (phyType[i] === '') {
            phyType[i] = 'TYPE_' + (i + 1);
        }
        type += '\t' + phyType[i] + ': ' + Math.pow(2, i) + ',\n';
        properties += '\t\t' + phyType[i] + ': ' + 'false,\n';
    }

    var str = "window.Physics.Category = cc.Enum({" + type + "});\n\n" + 
    "window.Physics.CollsionTarget = cc.Class({\n" + 
    "\tname: 'CollsionTarget',\n" +
    "\tctor: function () {},\n" + 
    "\tproperties: {\n" +
    properties +
    "\t},\n" +
    "\tclone: function () { return new Physics.CollsionTarget(); },\n" + 
    "});";
    
    return str;
};

var saveFile = function (content) {
    /*
    Editor.assetdb.watchOFF();
    Editor.assetdb.saveExists(filePath, content, (err, result) => {
        if (err) {
            Editor.assetdb.error(
                `Failed to update asset ${url}, messages: ${err.stack}`
                );
            return;
        }
        let meta = result.meta;
        let diff = result.subMetas;
        Editor.sendToAll('asset-db:asset-changed', {
            uuid: meta.uuid,
            type: meta.assetType(),
        });
        if (diff.deleted.length > 0) {
            Editor.sendToAll('asset-db:assets-deleted', diff.deleted);
        }
        if (diff.added.length > 0) {
            Editor.sendToAll('asset-db:assets-created', diff.added);
        }
    });
    if (!Editor.focused) {
        Editor.assetdb.watchON();
    }
    */
    
    // 或者直接IPC一句话就搞定（其实内部也是通过IPC完成的）
    Editor.Ipc.sendToMain( 'asset-db:save-exists', filePath, content );
};

module.exports = {

    load() {
    },

    unload() {
    },

    messages: {
        open() {
            Editor.Panel.open('box2d');
        },
        generateEnum(arg, arg2) {
            saveFile(generateEnum(arg2));
        },
    },
};