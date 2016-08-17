(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/checkbox-preview.tmpl').then(
      content => {
        viewEL.innerHTML = content;
        let eventEL = viewEL.querySelector('#event');

        // g-01
        ['.g-01', '.g-02'].forEach(g => {
          let target = viewEL.querySelector(`${g} ui-checkbox`);

          target.addEventListener('change', () => {
            panel._updateEventText(eventEL, 'change');
          });

          target.addEventListener('confirm', () => {
            panel._updateEventText(eventEL, 'confirm');
          });

          target.addEventListener('cancel', () => {
            panel._updateEventText(eventEL, 'cancel');
          });
        });

        let target = viewEL.querySelector(`.g-02 [disabled]`);
        let btn = viewEL.querySelector(`.g-02 #focus`);
        btn.addEventListener('click', () => {
          Editor.UI.focus(target);
        });
      }
    );
  };
})();
