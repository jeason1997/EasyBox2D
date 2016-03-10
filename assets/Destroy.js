cc.Class({
    extends: cc.Component,

    onLoad: function () {
       
            this.getComponent(Body).addContactEvent(ContactType.POST_CONTACT,
                this.onPostContact.bind(this));
        
    },

    onPostContact: function (contact) {
        if (contact.impulse.normalImpulses[0] >= 100) {
            this.node.destroy();
        }
    },
});
