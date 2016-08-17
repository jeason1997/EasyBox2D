(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/progress-preview.tmpl').then(
      content => {
        viewEL.innerHTML = content;
        // let eventEL = viewEL.querySelector('#event');

        let progressEL = viewEL.querySelector('.g-01 ui-progress');

        let btnAdd = viewEL.querySelector('.g-01 #add');
        let btnSub = viewEL.querySelector('.g-01 #sub');

        btnAdd.addEventListener('confirm', () => {
          progressEL.value += Editor.Math.randomRange(10,30);
        });
        btnSub.addEventListener('confirm', () => {
          progressEL.value -= Editor.Math.randomRange(10,30);
        });


        let progressEL2 = viewEL.querySelector('.g-02 ui-progress');

        let btnAdd2 = viewEL.querySelector('.g-02 #add');
        let btnSub2 = viewEL.querySelector('.g-02 #sub');

        btnAdd2.addEventListener('confirm', () => {
          progressEL2.value += Editor.Math.randomRange(10,30);
        });
        btnSub2.addEventListener('confirm', () => {
          progressEL2.value -= Editor.Math.randomRange(10,30);
        });
      }
    );
  };
})();
