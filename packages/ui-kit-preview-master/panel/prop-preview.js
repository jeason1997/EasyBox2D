(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/prop-preview.tmpl').then(
      content => {
        viewEL.innerHTML = content;
        // let eventEL = viewEL.querySelector('#event');

        let target = viewEL.querySelector(`.g-01 ui-prop[name="Slidable"]`);
        let inputEL = target.querySelector('ui-num-input');
        let slideEL = target.querySelector('ui-slider');

        // TODO: for slide cancel?
        // let val1 = inputEL.value;
        // let val2 = slideEL.value;

        target.addEventListener('slide-change', event => {
          inputEL.value = inputEL.value + event.detail.dx;
          slideEL.value = slideEL.value - event.detail.dy  * 0.001;
        });
      }
    );
  };
})();
