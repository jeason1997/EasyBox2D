// Debug
window.Logger = cc.Class();

Logger.assert = function (arg) {
    if (!arg) {
         throw "Assertion Failed";
      }
};
    
Logger.log = function (arg) {
    if (CC_EDITOR) {
        cc.log(arg);
    }
    else {
        console.log(arg);
    }
};
    
Logger.warn = function (arg) {
    if (CC_EDITOR) {
        cc.warn(arg);
    }
    else {
        console.warn(arg);
    }
};
    
Logger.error = function (arg) {
    if (CC_EDITOR) {
        cc.error(arg);
    }
    else {
        console.error(arg);
    }
};