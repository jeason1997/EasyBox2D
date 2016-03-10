/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_Body.js
 * Describe :
 *************************************************/

require('Physics');
require('Engine')

var BodyType = cc.Enum({
    STATIC: 0,
    KINEMATIC: 1,
    DYNAMIC: 2
});

var BodyData = function(fixtureDef, bodyDef, shapeData) {
    this.fixtureDef = fixtureDef;
    this.bodyDef = bodyDef;
    this.shapeData = shapeData;
};

window.ContactType = cc.Enum({
    BEGIN_CONTACT: 0,
    PRE_CONTACT: 1,
    POST_CONTACT: 2,
    END_CONTACT: 3,
});

window.Body = cc.Class({

    extends: cc.Component,

    editor: {
        menu: 'i18n:Box2D.Body.menu',
        executeInEditMode: false,
        disallowMultiple: true,
    },

    properties: {
        tag: '',
        bodyType: {
            default: BodyType.DYNAMIC,
            displayName: 'i18n:Box2D.Body.bodyType',
            tooltip: 'i18n:Box2D.Body.bodyType_tooltip',
            type: BodyType,
            notify: function() {
                if (this.body) {
                    switch (this.bodyType) {
                        case BodyType.STATIC:
                            this.body.m_type = b2Body.b2_staticBody;
                            break;
                        case BodyType.KINEMATIC:
                            this.body.m_type = b2Body.b2_kinematicBody;
                            break;
                        case BodyType.DYNAMIC:
                            this.body.m_type = b2Body.b2_dynamicBody;
                            break;
                    }
                }
            },
        },
        isSensor: {
            default: false,
            displayName: 'i18n:Box2D.Body.isSensor',
            tooltip: 'i18n:Box2D.Body.isSensor_tooltip',
            notify: function() {}
        },
        density: {
            default: 1.0,
            displayName: 'i18n:Box2D.Body.density',
            tooltip: 'i18n:Box2D.Body.density_tooltip',
            notify: function() {},
        },
        friction: {
            default: 0.3,
            displayName: 'i18n:Box2D.Body.friction',
            tooltip: 'i18n:Box2D.Body.friction_tooltip',
            notify: function() {},
        },
        restitution: {
            default: 0.5,
            displayName: 'i18n:Box2D.Body.restitution',
            tooltip: 'i18n:Box2D.Body.restitution_tooltip',
            notify: function() {},
        },
        gravityScale: {
            default: 1,
            notify: function() {},
        },
        Category: {
            default: Physics.Category.TYPE_1,
            type: Physics.Category,
        },
        CollisionWith: {
            default: [],
            type: ['Boolean'],
        },
        onBeginContact: {
            default: [],
            visible: false,
        },
        onPreSolve: {
            default: [],
            visible: false,
        },
        onPostSolve: {
            default: [],
            visible: false,
        },
        onEndContact: {
            default: [],
            visible: false,
        },
        body: {
            default: null,
            visible: false,
        },
        bodyData: {
            default: null,
            visible: false,
        }
    },

    onLoad: function() {
        // 表明当前是否由物理引擎来设置该node的属性
        // 主要是因为下面有'node.on'监听函数来监听属性的变化，如果是由开发者手动
        // 设置node的属性，则body对象也应该更新属性，但如果是由物理引擎设置的，
        // 就没必要设置后再去设置body的属性
        this.setPropertiesByEngien = false;

        this.node.on('position-changed', function(event) {
            if (!this.setPropertiesByEngien) {
                this.body.SetPosition(new b2Vec2(this.node.convertToWorldSpaceAR().x / PTM_RATIO,
                    this.node.convertToWorldSpaceAR().y / PTM_RATIO));
            }
        }, this);

        this.node.on('rotation-changed', function(event) {
            if (!this.setPropertiesByEngien) {
                this.body.SetAngle(-(3.14 / 180) * this.node.convertToWorldRotation());
            }
        }, this);

        this.createBody();
    },

    createBody: function() {
        var data = this.getBodyData();
        this.body = Engine.instance.world.CreateBody(data.bodyDef);
        for (var i = 0; i < data.fixtureDef.length; ++i) {
            this.body.CreateFixture(data.fixtureDef[i]);
        }
        this.body.SetUserData(this);
    },

    getBodyData: function() {
        // Fixture
        var fixtureList = new Array();

        // Shape
        var shape = this.getComponent(Shape);
        if (shape) {
            shape.body = this;
            if (shape.shapeType === ShapeType.EDGE) {
                var shapes = shape.getShape();
                for (var i = 0; i < shapes.length; ++i) {
                    var fixDef = new b2FixtureDef();
                    fixDef.density = this.density;
                    fixDef.friction = this.friction;
                    fixDef.restitution = this.restitution;
                    fixDef.isSensor = this.isSensor;

                    var maskBits = 0;
                    for (var j = 1; j < this.CollisionWith.length && j <= 16; ++j) {
                        if (this.CollisionWith[j])
                            maskBits += Math.pow(2, j - 1);
                    }
                    if (maskBits == 0) maskBits = 65535;
                    var filter = new b2FilterData();
                    filter.categoryBits = this.Category;
                    filter.maskBits = maskBits;
                    fixDef.filter = filter;

                    fixDef.shape = shapes[i];
                    fixtureList.push(fixDef);
                }
            } else {
                var fixDef = new b2FixtureDef();
                fixDef.density = this.density;
                fixDef.friction = this.friction;
                fixDef.restitution = this.restitution;
                fixDef.isSensor = this.isSensor;

                var maskBits = 0;
                for (var i = 1; i < this.CollisionWith.length && i <= 16; ++i) {
                    if (this.CollisionWith[i])
                        maskBits += Math.pow(2, i - 1);
                }
                if (maskBits == 0) maskBits = 65535;
                var filter = new b2FilterData();
                filter.categoryBits = this.Category;
                filter.maskBits = maskBits;
                fixDef.filter = filter;

                fixDef.shape = shape.getShape();
                fixtureList.push(fixDef);
            }
        } else {
            Logger.error('Body mush take at least one shape.');
            this.destroy();
            return;
        }

        // BodyDef
        var bodyDef = new b2BodyDef();
        switch (this.bodyType) {
            case BodyType.STATIC:
                bodyDef.type = b2Body.b2_staticBody;
                break;
            case BodyType.KINEMATIC:
                bodyDef.type = b2Body.b2_kinematicBody;
                break;
            case BodyType.DYNAMIC:
                bodyDef.type = b2Body.b2_dynamicBody;
                break;
        }

        // 将节点的本地坐标换算成节点的世界坐标
        bodyDef.position = new b2Vec2(this.node.convertToWorldSpaceAR().x / PTM_RATIO,
            this.node.convertToWorldSpaceAR().y / PTM_RATIO);
        bodyDef.angle = -(3.14 / 180) * this.node.convertToWorldRotation();

        this.bodyData = new BodyData(fixtureList, bodyDef, shape.shapeData);

        return this.bodyData;
    },

    update: function(dt) {

        this.setPropertiesByEngien = true;

        // 将世界坐标换算成节点的相对本地坐标
        if (this.node.parent.parent !== null) {
            this.node.position = this.node.parent.convertToNodeSpaceAR(new cc.Vec2(
                this.body.GetPosition().x * PTM_RATIO,
                this.body.GetPosition().y * PTM_RATIO));
            this.node.rotation = this.node.parent.convertToNodeRotation(-this.body.GetAngle() * (180 / 3.14));
        }
        // 根节点不必考虑转换
        else {
            this.node.position = new cc.Vec2(
                this.body.GetPosition().x * PTM_RATIO,
                this.body.GetPosition().y * PTM_RATIO);
            this.node.rotation = -this.body.GetAngle() * (180 / 3.14);
        }

        this.setPropertiesByEngien = false;
    },

    addForce: function(force, position) {
        if (!position) {
            position = this.node.position;
        }
        position.x = position.x / PTM_RATIO;
        position.y = position.y / PTM_RATIO;
        this.body.ApplyForce(force, position);
    },

    addImpulse: function(impulse, position) {
        if (!position) {
            position = this.node.position;
        }
        position.x = position.x / PTM_RATIO;
        position.y = position.y / PTM_RATIO;
        this.body.ApplyImpulse(impulse, position);
    },

    addTorque: function(torque) {
        this.body.ApplyTorque(torque);
    },

    addContactEvent: function(contactType, callback) {
        switch (contactType) {
            case ContactType.BEGIN_CONTACT:
                this.onBeginContact.push(callback);
                break;
            case ContactType.PRE_CONTACT:
                this.onPreSolve.push(callback);
                break;
            case ContactType.POST_CONTACT:
                this.onPostSolve.push(callback);
                break;
            case ContactType.END_CONTACT:
                this.onEndContact.push(callback);
                break;
        }
    },

    removeContactEvent: function(contactType, callback) {
        switch (contactType) {
            case ContactType.BEGIN_CONTACT:
                var index = this.onBeginContact.indexOf(callback)
                if (index >= 0)
                    this.onBeginContact.splice(index, 1);
                break;
            case ContactType.PRE_CONTACT:
                var index = this.onPreSolve.indexOf(callback)
                if (index >= 0)
                    this.onPreSolve.splice(index, 1);
                break;
            case ContactType.POST_CONTACT:
                var index = this.onPostSolve.indexOf(callback)
                if (index >= 0)
                    this.onPostSolve.splice(index, 1);
                break;
            case ContactType.END_CONTACT:
                var index = this.onEndContact.indexOf(callback)
                if (index >= 0)
                    this.onEndContact.splice(index, 1);
                break;
        }
    },

    setBodyCategory: function(categoryBits, maskBits) {
        var fixtureList = this.body.GetFixtureList();
        while (fixtureList) {
            fixtureList.m_filter.categoryBits = categoryBits;
            fixtureList.m_filter.maskBits = maskBits;
            fixtureList = fixtureList.m_next;
        }
    },
});