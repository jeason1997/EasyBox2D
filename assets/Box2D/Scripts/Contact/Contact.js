require('Box2D_Body');

Contact = cc.Class({
    name: 'Contact',
    
    ctor: function () {
        this.contact = arguments[0];
    },
    
    properties: {
        targetBody: null,
        impulse: null,
        oldManifold: null,
    },
    
    setEnabled: function (e) {
        this.contact.SetEnabled(e);
    },
});
