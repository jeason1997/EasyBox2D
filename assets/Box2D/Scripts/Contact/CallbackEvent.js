window.CallbackEvent = cc.Class({
    name: 'CallbackEvent',
    properties: {
        target: {
            default: null,
            displayName: 'i18n:Box2D.CallbackEvent.target',
            tooltip: 'i18n:Box2D.CallbackEvent.target_tooltip',
            type: cc.Node,
        },
        componentName: {
            default: '',
            displayName: 'i18n:Box2D.CallbackEvent.componentName',
            tooltip: 'i18n:Box2D.CallbackEvent.componentName_tooltip',
        },
        functionName: {
            default: '',
            displayName: 'i18n:Box2D.CallbackEvent.functionName',
            tooltip: 'i18n:Box2D.CallbackEvent.functionName_tooltip',
        },
    }
});