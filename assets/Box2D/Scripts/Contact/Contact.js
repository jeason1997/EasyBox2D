window.ContactType = cc.Enum({
    BEGIN_CONTACT: 0,
    PRE_CONTACT: 1,
    POST_CONTACT: 2,
    END_CONTACT: 3,
});

window.Contact = cc.Class({
    
    name: 'Contact',
    
    // constructor: contact
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
