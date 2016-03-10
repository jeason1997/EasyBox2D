cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        var body = this.getComponent('Body');
        body.addContactEvent(ContactType.POST_CONTACT, function(contact) {
            if(contact.impulse.normalImpulses[0] > 100) {
                this.node.destroy();
            }
        }.bind(this));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
