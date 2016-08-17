(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/color-picker-preview.tmpl').then(
      content => {
        viewEL.innerHTML = content;
        let eventEL = viewEL.querySelector('#event');

        // g-01
        ['.g-01'].forEach(g => {
          let target = viewEL.querySelector(`${g} ui-color-picker`);

          let text = viewEL.querySelector(`div.text`);
          text.innerHTML = target.value;

          target.addEventListener('change', event => {
            text.innerHTML = event.detail.value;
            panel._updateEventText(eventEL, 'change');
          });

          target.addEventListener('confirm', event => {
            text.innerHTML = event.detail.value;
            panel._updateEventText(eventEL, 'confirm');
          });

          target.addEventListener('cancel', event => {
            text.innerHTML = event.detail.value;
            panel._updateEventText(eventEL, 'cancel');
          });

          target.addEventListener('hide', () => {
            panel._updateEventText(eventEL, 'hide');
          });
        });
      }
    );
  };
})();
