/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_Engine.js
 * Describe : 
 *************************************************/

require('Contact');

var PhysicsDebugger = cc.Class({
    
    name: 'PhysicsDebugger',
    
    ctor: function () {
    },
    
    properties: {
        openDebug: false,
        lineThickness: 2,
        drawShape: false,
        drawJoint: false,
        drawAABB: false,
        drawRay: false,
        drawPair: false,
        drawCenterOfMass: false,
        drawController: false,
        _debugDraw: null,
    },
    
    getDebugDraw: function () {
        if (!this._debugDraw) {
            var sprite = new cc.DrawNode();
            cc.Canvas.instance.node.parent._sgNode.addChild(sprite);
            var debugDraw = new b2DebugDraw();
            debugDraw.SetDrawScale(PTM_RATIO);
            debugDraw.SetSprite(sprite);
		    debugDraw.SetFillAlpha(0.3);
		    debugDraw.SetLineThickness(this.lineThickness);
            debugDraw.SetFlags(
                (this.drawShape ? b2DebugDraw.e_shapeBit : 0) |
                (this.drawJoint ? b2DebugDraw.e_jointBit : 0) |
                (this.drawAABB ? b2DebugDraw.e_aabbBit : 0) |
                (this.drawPair ? b2DebugDraw.e_pairBit : 0) |
                (this.drawCenterOfMass ? b2DebugDraw.e_centerOfMassBit : 0) |
                (this.drawController ? b2DebugDraw.e_controllerBit : 0));
            this._debugDraw = debugDraw;
        }
        return this._debugDraw;
    },
    
    clone: function () {
        return new PhysicsDebugger();
    },
});

window.Box2D_Engine = cc.Class({

    extends: cc.Component,
    
    editor: {
        menu: 'i18n:Box2D.Engine.menu',
        disallowMultiple: true,
    },

    statics: {
        _instance: null,
    },

    properties: {
        playInEditor: {
            default: false,
            displayName: 'i18n:Box2D.Engine.playInEditor',
            tooltip: 'i18n:Box2D.Engine.playInEditor_tooltip',
            notify: function () {
                if (CC_EDITOR) {
                    Editor.Panel.open('Box2D.panel');
                }
            },
        },
        startEngine: {
            default: true,
            displayName: 'i18n:Box2D.Engine.startEngine',
            tooltip: 'i18n:Box2D.Engine.startEngine_tooltip',
        },
        gravity: {
            default: new cc.Vec2(0, -9.8),
            displayName: 'i18n:Box2D.Engine.gravity',
            tooltip: 'i18n:Box2D.Engine.gravity_tooltip',
            notify: function () {
                if (this.world) {
                    this.world.m_gravity = this.gravity;
                }
            },
        },
        allowSleep: {
            default: true,
            displayName: 'i18n:Box2D.Engine.allowSleep',
            tooltip: 'i18n:Box2D.Engine.allowSleep_tooltip',
            notify: function () {
                if (this.world) {
                    this.world.m_allowSleep = this.allowSleep;
                }
            },
        },
        timeStep: {
            default: 0.016,
            displayName: 'i18n:Box2D.Engine.timeStep',
            tooltip: 'i18n:Box2D.Engine.timeStep_tooltip',
        },
        velocityIterations: {
            default: 6,
            displayName: 'i18n:Box2D.Engine.velocityIterations',
            tooltip: 'i18n:Box2D.Engine.velocityIterations_tooltip',
        },
        positionIterations: {
            default: 2,
            displayName: 'i18n:Box2D.Engine.positionIterations',
            tooltip: 'i18n:Box2D.Engine.positionIterations_tooltip',
        },
        physicsDebugger: {
            default: new PhysicsDebugger(),
            type: PhysicsDebugger,
        },
        world: {
            default: null,
            visible: false,
        },
    },

    onLoad: function () {

        if (Box2D_Engine._instance) {
            Logger.error('The scene should only have one active Engine at the same time.');
            this.destroy();
            return;
        }
        Box2D_Engine._instance = this;

        this.world = new b2World(this.gravity, this.allowSleep);

        var contact = new b2ContactListener();
        var self = this;
        contact.BeginContact = function (contact) {
            self.doContact(ContactType.BEGIN_CONTACT, contact);
        };
        contact.EndContact = function (contact) {
            self.doContact(ContactType.END_CONTACT, contact);
        };
        contact.PreSolve = function (contact, oldManifold) {
            self.doContact(ContactType.PRE_CONTACT, contact, oldManifold);
        };
        contact.PostSolve = function (contact, impulse) {
            self.doContact(ContactType.POST_CONTACT, contact, impulse);
        };
        this.world.SetContactListener(contact);
        
        // DebugDraw
        this.world.SetDebugDraw(this.physicsDebugger.getDebugDraw());
    },

    update: function (dt) {
        if (this.startEngine) {
            this.world.Step(this.timeStep, this.velocityIterations, this.positionIterations);
            if (this.physicsDebugger.openDebug)
                this.world.DrawDebugData();
            this.world.ClearForces();
        }
    },

    doContact: function (contactType, contact, arg) {
        var bodyA = contact.m_fixtureA.GetBody().GetUserData();
        var bodyB = contact.m_fixtureB.GetBody().GetUserData();
        var c = new Contact(contact);
        var eventA;
        var eventB;

        switch (contactType) {
            case ContactType.BEGIN_CONTACT:
                eventA = bodyA.onBeginContact;
                eventB = bodyB.onBeginContact;
                break;
            case ContactType.PRE_CONTACT:
                eventA = bodyA.onPreSolve;
                eventB = bodyB.onPreSolve;
                c.oldManifold = arg;
                break;
            case ContactType.POST_CONTACT:
                eventA = bodyA.onPostSolve;
                eventB = bodyB.onPostSolve;
                c.impulse = arg;
                break;
            case ContactType.END_CONTACT:
                eventA = bodyA.onEndContact;
                eventB = bodyB.onEndContact;
                break;
        }
        
        // Body A
        for (var i = 0; i < eventA.length; ++i) {
            eventA[i](c);
        }
        
        // Body B
        for (i = 0; i < eventB.length; ++i) {
            eventB[i](c);
        }
    },
});

Object.defineProperty(Box2D_Engine, 'instance', {
    get: function () {
        if (!Box2D_Engine._instance) {
            var node = new cc.Node('Box2D_Engine');
            Box2D_Engine._instance = node.addComponent(Box2D_Engine);
        }
        return Box2D_Engine._instance;
    },
});