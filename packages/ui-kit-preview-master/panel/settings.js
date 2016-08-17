(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/settings.tmpl').then(
      content => {
        viewEL.innerHTML = content;

        for ( let name in Editor.UI.Settings ) {
          let el = viewEL.querySelector(`#${name}`);
          el.value = Editor.UI.Settings[name];
          el.addEventListener('confirm', e => {
            Editor.UI.Settings[name] = e.detail.value;
          });
        }
      }
    );
  };
})();
