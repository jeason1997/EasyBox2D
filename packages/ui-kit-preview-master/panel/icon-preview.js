(() => {
  'use strict';

  return function init ( panel ) {
    let viewEL = panel.$.view;

    Editor.import('packages://ui-kit-preview/panel/icon-preview.tmpl').then(
      content => {
        viewEL.innerHTML = content;

        let group = viewEL.querySelector('.g-01');
        [
          'icon-popup',
          'icon-menu',
          'icon-ok',
          'icon-lock',
          'icon-down-dir',
          'icon-up-dir',
          'icon-left-dir',
          'icon-right-dir',
          'icon-circle-thin',
          'icon-circle-empty',
          'icon-fold-up',
          'icon-fold',
          'icon-braille',
          'icon-cw',
          'icon-trash-empty',
          'icon-arrows-cw',
          'icon-ccw',
          'icon-play-outline',
          'icon-play',
          'icon-stop-outline',
          'icon-stop',
          'icon-pause-outline',
          'icon-pause',
          'icon-fast-fw-outline',
          'icon-fast-fw',
          'icon-rewind-outline',
          'icon-rewind',
          'icon-eject-alt-outline',
          'icon-eject-alt',
          'icon-record-outline',
          'icon-record',
          'icon-cancel',
          'icon-eye',
          'icon-block',
          'icon-doc-text',
          'icon-link-ext',
          'icon-list-add',
          'icon-plus',
          'icon-minus',
        ].forEach( name => {
          let span = document.createElement('span');
          span.innerHTML = `
            <i class="${name}"></i>
            ${name}
          `;
          span.style.width = '200px';
          group.appendChild(span);
        });
      }
    );
  };
})();
