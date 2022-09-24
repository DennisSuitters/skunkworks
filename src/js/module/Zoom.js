export default class Zoom {

  constructor(context) {
    this.context = context;
    this.$editable = context.layoutInfo.editable;
    this.zoom = 1;
  }

  in() {
    this.zoom += 0.1;
    if(this.zoom > 5) this.zoom = 5;
    this.setZoom();
  }

  out() {
    this.zoom -= 0.1;
    if(this.zoom < 0) this.zoom = 0;
    this.setZoom();
  }

  value() {
    this.zoom = parseFloat(Number(this.context.layoutInfo.toolbar.find('.note-txt-zoom-value').val()) / 100);;
    if(this.zoom > 5) this.zoom = 5;
    if(this.zoom < 0) this.zoom = 0;
    this.$editable.css('transform', `scale(${this.zoom})`);
    this.context.layoutInfo.toolbar.find('.note-txt-zoom-value').val(Math.trunc(this.zoom * 100));
  }

  reset() {
    this.zoom = 1;
    this.setZoom();
  }

  setZoom() {
    this.$editable.css('transform', `scale(${this.zoom})`);
    this.context.layoutInfo.toolbar.find('.note-txt-zoom-value').val(Math.trunc(this.zoom * 100));
    this.context.invoke('editor.restoreRange');
  }
}
