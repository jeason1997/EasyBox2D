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
        localAnchor: {
            default: new cc.Vec2(0, 0),
            notify: function () {
                this.updateDebugDraw();
            },
        },
        targetBody: {
            default: null,
            type: Body,
            notify: function () {
                this.updateDebugDraw();
            },
        },
        targetAnchor: {
            default: new cc.Vec2(0, 0),
            notify: function () {
                this.updateDebugDraw();
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
    
    updateDebugDraw: function() {
        if (CC_EDITOR) {
            if (!this._canvas) {
                this._canvas = new cc.DrawNode();
                this.node._sgNode.addChild(this._canvas);
            }
        
            var local = this.node.position;
            var target;
            if (this.targetBody) {
                target = this.targetBody.node.position;
            } else {
                target = cc.Vec2.ZERO;
            }
            
            this._canvas.clear();
            this._canvas.drawSegment(local, target, 2, new cc.Color(127, 229, 127, 255));
        }
    },
});
