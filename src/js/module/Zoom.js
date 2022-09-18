import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';

export default class Zoom {

  constructor(context) {
    this.context = context;
    this.$editable = context.layoutInfo.editable;
    this.zoom = 1;
  }

  in() {
    this.zoom += 0.1;
    this.setZoom();
  }

  out() {
    this.zoom -= 0.1;
    this.setZoom();
  }

  reset() {
    this.zoom = 1;
    this.setZoom();
  }

  setZoom() {
    this.$editable.css('transform', `scale(${this.zoom})`);
    this.context.layoutInfo.toolbar.find('.note-txt-zoom-value').html(Math.trunc(this.zoom * 100) + '%');
    this.context.invoke('editor.restoreRange');
  }
}
