/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Joint.js
 * Describe : The base class of joints.
 *************************************************/

require('Box2D_Body');

Joint = cc.Class({

    extends: cc.Component,

    editor: {
        requireComponent: Box2D_Body,
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
        localAnchor: {
            default: new cc.Vec2(0, 0),
            notify: function () {
            },
        },
        targetBody: {
            default: null,
            type: Box2D_Body,
            notify: function () {
            },
        },
        targetAnchor: {
            default: new cc.Vec2(0, 0),
            notify: function () {
            },
        },
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
        this.localBody = this.getComponent(Box2D_Body).body;
        if (!this.targetBody) {
            this.targetBody = Box2D_Engine.instance.world.GetGroundBody();
        } else {
            this.targetBody = this.targetBody.body;
        }
        if (this.localBody === this.targetBody) {
            Logger.error('LocalBody and targetBody should not be same.');
        }

        if (this.breakForce > 0) {
            this.getComponent(Box2D_Body).addContactEvent(ContactType.POST_CONTACT,
                this.onPostContact.bind(this));
        }
    },

    onPostContact: function (contact) {
        if (contact.impulse.normalImpulses[0] >= this.breakForce) {
            this.destroy();
        }
    },

    onDestroy: function () {
        Box2D_Engine.instance.world.DestroyJoint(this.joint);
        this.getComponent(Box2D_Body).removeContactEvent(ContactType.POST_CONTACT,
            this.onPostContact);
    },
});
