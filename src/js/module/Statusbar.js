import $ from 'jquery';

export default class Statusbar {
  constructor(context) {
    this.$document = $(document);
    this.$statusbar = context.layoutInfo.statusbar;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.options = context.options;
  }

  initialize() {
    if (this.options.airMode) {
      this.destroy();
      return;
    }

    if (this.options.stickyStatus) {
      this.$statusbar.addClass('sticky-statusbar');
    }

  }

  destroy() {
    this.$statusbar.off();
  }
}
