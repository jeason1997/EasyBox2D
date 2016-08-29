/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Joint.js
 * Describe : The base class of joints.
 *************************************************/

require('Body');

window.Joint = cc.Class({

    extends: cc.Component,

    editor: {
        requireComponent: Body,
    },

    properties: {
        enableCollision: {
            default: false,
            notify: function () {
            },
        },
        localBody: {
            default: null,
            visible: false,
        },
        localAnchor: cc.v2(0, 0),
        targetBody: {
            default: null,
            type: Body,
        },
        targetAnchor: cc.v2(0, 0),
        breakForce: {
            default: -1,
            notify: function () {
                if (!CC_EDITOR) {
                    if (this.breakForce > 0) {
                        this.getComponent(Box2D_Body).addContactEvent(ContactType.POST_CONTACT,
                            this.onPostContact.bind(this));
                    } else {
                        this.getComponent(Box2D_Body).removeContactEvent(ContactType.POST_CONTACT,
                            this.onPostContact);
                    }
                }
            },
        },
        joint: {
            default: null,
            visible: false,
        },
    },

    initJoint: function () {
        this.localBody = this.getComponent(Body).body;
        if (!this.targetBody) {
            this.targetBody = Engine.instance.world.GetGroundBody();
        } else {
            this.targetBody = this.targetBody.body;
        }
        if (this.localBody === this.targetBody) {
            Logger.error('LocalBody and targetBody should not be same.');
        }

        if (this.breakForce > 0) {
            this.getComponent(Body).addContactEvent(ContactType.POST_CONTACT,
                this.onPostContact.bind(this));
        }
    },

    onPostContact: function (contact) {
        if (contact.impulse.normalImpulses[0] >= this.breakForce) {
            this.destroy();
        }
    },

    onDestroy: function () {
        Engine.instance.world.DestroyJoint(this.joint);
        this.getComponent(Body).removeContactEvent(ContactType.POST_CONTACT,
            this.onPostContact);
    },
});
