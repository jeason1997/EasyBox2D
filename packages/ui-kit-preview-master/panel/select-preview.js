(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/select-preview.tmpl').then(
      content => {
        viewEL.innerHTML = content;
        let eventEL = viewEL.querySelector('#event');

        ['.g-01'].forEach(g => {
          let target = viewEL.querySelector(`${g} ui-select`);

          target.addEventListener('confirm', event => {
            panel._updateEventText(eventEL, 'confirm');

            let text = viewEL.querySelector(`${g} span.text`);
            text.style.display = '';
            text.innerHTML = event.detail.text;
            setTimeout(() => {
              text.style.display = 'none';
            }, 200);
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
