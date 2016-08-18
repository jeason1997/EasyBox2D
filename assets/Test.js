cc.Class({
    extends: cc.Component,

    properties: {
        radius: 5,
        fun: {
            default: [],
            type: cc.Component.EventHandler,
        },
    },

    // use this for initialization
    onLoad: function () {
        var eventHandler = new cc.Component.EventHandler();
     eventHandler.target = this;
     eventHandler.component = "Test";
     eventHandler.handler = "操你妈";
 
 
        this.fun.push(eventHandler);
    },
    
    操你妈: function(){
        cc.log('中文');
    },
    
    hahah: function(str) {
        cc.log(str);
    },
    
    fuck: function() {
      cc.log('this is a fuck');  
    },
    
    test: function () {
        cc.Component.EventHandler.emitEvents(this.fun, "我操你妈");
    },
});
