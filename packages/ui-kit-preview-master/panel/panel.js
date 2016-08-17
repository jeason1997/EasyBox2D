'use strict';

Editor.Panel.extend({
  style: `
    :host {
      display: flex;
      flex-direction: column;
    }

    h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }

    .toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;

      padding: 10px;
    }

    #view {
      flex: 1;

      padding: 10px;
      padding-top: 0px;

      overflow-y: auto;
      overflow-x: hidden;
    }

    div.section {
      border-bottom: 1px solid #666;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    div.section:last-child {
      border-bottom: 0px;
    }

    div.group {
      min-width: 420px;
      margin-bottom: 5px;

      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }

    span {
      margin-right: 0.25em;
    }
  `,

  template: `
    <div class="toolbar">
      <ui-select id="select">
        <option value="settings">settings</option>

        <optgroup label="Controls">
          <option value="button-preview">ui-button</option>
          <option value="checkbox-preview">ui-checkbox</option>
          <option value="color-preview">ui-color</option>
          <option value="color-picker-preview">ui-color-picker</option>
          <option value="input-preview">ui-input</option>
          <option value="num-input-preview">ui-num-input</option>
          <option value="select-preview">ui-select</option>
          <option value="slider-preview">ui-slider</option>
          <option value="text-area-preview">ui-text-area</option>
        </optgroup>

        <optgroup label="Containers">
          <option value="box-container-preview">ui-box-container</option>
          <option value="prop-preview">ui-prop</option>
          <option value="section-preview">ui-section</option>
          <option value="shadow-preview">ui-shadow</option>
        </optgroup>

        <optgroup label="Views">
          <option value="hint-preview">ui-hint</option>
          <option value="loader-preview">ui-loader</option>
          <option value="markdown-preview">ui-markdown</option>
          <option value="progress-preview">ui-progress</option>
        </optgroup>

        <optgroup label="Misc">
          <option value="icon-preview">icons</option>
          <option value="layout-preview">layout</option>
        </optgroup>
      </ui-select>
      <span>Ctrl/Cmd + F: show current focus</span>
    </div>
    <div id="view" class="scroll"></div>
  `,

  listeners: {
  },

  ready () {
    this.$ = {
      select: this.shadowRoot.querySelector('#select'),
      view: this.shadowRoot.querySelector('#view'),
    };

    this.addEventListener('keydown', event => {
      if (event.metaKey || event.ctrlKey) {
        if (Editor.KeyCode(event.keyCode) === 'f') {
          if ( Editor.UI.focusedElement ) {
            console.log(Editor.UI.focusedElement._curFocus);
          } else {
            console.log(null);
          }
        }
      }
    });

    this.$.select.addEventListener('confirm', event => {
      let value = event.target.value;

      this.profiles.local.scrollTop = 0;
      this.profiles.local.select = value;
      this.profiles.local.save();

      this.showPreview(value);
    });

    this.$.select.value = this.profiles.local.select;
    this.showPreview(this.profiles.local.select);
  },

  close () {
    this.profiles.local.scrollTop = this.$.view.scrollTop;
    this.profiles.local.save();
  },

  showPreview (name) {
    Editor
      .import(`packages://ui-kit-preview/panel/${name}.js`)
      .then(initFn => {
        initFn(this);
        setTimeout(() => {
          this.$.view.scrollTop = this.profiles.local.scrollTop;
        }, 10);
      });
  },

  _updateEventText (eventEL, name) {
    clearTimeout(this._timeoutID);

    if ( !this._events ) {
      this._events = [];
    }
    if ( this._events.length >= 5 ) {
      this._events.pop();
    }
    this._events.push(name);

    eventEL.innerHTML = `event: ${this._events.join(',')}`;

    this._timeoutID = setTimeout(() => {
      eventEL.innerHTML = 'event: ---';
      this._events = [];
    }, 200);
  },
});
