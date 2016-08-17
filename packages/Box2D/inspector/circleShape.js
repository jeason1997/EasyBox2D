Vue.component('circleShape', {
    template: `
    <h2>Box2D For CocosCreator</h2>
    <a target="_blank" rel="nofollow" href="http://jeason1997.github.io/EasyBox2D/">
        <img src={{imgPath}} width="294" height="166" />
    </a>
    <p>
        <ui-button class="red" @confirm="_onBtnPress">Editor Shape</ui-button>        
    </p>
    <ui-label class="orange circle">属性</ui-label>
    <ui-section class="big" text="Box2D">
        <ui-prop v-prop="target.shapeType"></ui-prop>
        <ui-prop v-prop="target.sameAsNode"></ui-prop>
        <div v-if="target.sameAsNode.value === false">
            <ui-prop v-prop="target.diameter"></ui-prop>        
        </div>
        <ui-prop v-prop="target.offset"></ui-prop>
    </ui-section>
  `,

    data: function () {
        return {
            imgPath: Editor.url('packages://box2d/res/inspector/circleShape.gif'),
        }
    },

    props: {
        target: {
            twoWay: true,       // 双向绑定
            type: Object,
        },
    },

    methods: {
        T: Editor.T,
        _onBtnPress: function (t) {
            cc.log(t);
        },
    }
});
/*
<ui-prop v-prop="target.target"></ui-prop>
    <ui-prop v-prop="target.interactable"></ui-prop>
    <ui-prop v-prop="target.transition"></ui-prop>
    <div v-if="target.transition.value === 1">
        <ui-prop indent=1 v-prop="target.normalColor"></ui-prop>
        <ui-prop indent=1 v-prop="target.pressedColor"></ui-prop>
        <ui-prop indent=1 v-prop="target.hoverColor"></ui-prop>
        <ui-prop indent=1 v-prop="target.disabledColor"></ui-prop>
        <ui-prop indent=1 v-prop="target.duration"></ui-prop>
    </div>
    < div v-if="target.transition.value === 2" >
        <ui-prop indent=1 v-prop="target.normalSprite"></ui-prop>
        <ui-prop indent=1 v-prop="target.pressedSprite"></ui-prop>
        <ui-prop indent=1 v-prop="target.hoverSprite"></ui-prop>
        <ui-prop indent=1 v-prop="target.disabledSprite"></ui-prop>
    </div >
    < cc - array - prop :target.sync = "target.clickEvents" >
    </cc - array - prop >
*/