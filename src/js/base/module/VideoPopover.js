import $ from 'jquery';
import lists from '../core/lists';
import dom from '../core/dom';

export default class VideoPopover {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.options = context.options;
    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': () => {
        this.update();
      },
      'summernote.disable summernote.dialog.shown': () => {
        this.hide();
      },
      'summernote.blur': (we, event) => {
        if (event.originalEvent && event.originalEvent.relatedTarget) {
          if (!this.$popover[0].contains(event.originalEvent.relatedTarget)) {
            this.hide();
          }
        } else {
          this.hide();
        }
      },
    };
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.video);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-video-popover',
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.note-popover-content');

    this.context.invoke('buttons.build', $content, this.options.popover.video);

    this.$popover.on('mousedown', (event) => { event.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  update() {
    // Prevent focusing on editable when invoke('code') is executed
    if (!this.context.invoke('editor.hasFocus')) {
      this.hide();
      return;
    }

    const rng = this.context.invoke('editor.getLastRange');
    if (rng.isCollapsed() && rng.isOnVideo()) {
      const video = dom.ancestor(rng.sc, dom.isVideo);
//      const src = $(video).attr('src');
//      this.$popover.find('iframe').attr('src', src).text(src);

      const pos = dom.posFromPlaceholder(video);
      const containerOffset = $(this.options.container).offset();
      pos.top -= containerOffset.top;
      pos.left -= containerOffset.left;

      this.$popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top,
      });
    } else {
      this.hide();
    }
  }

  hide() {
    this.$popover.hide();
  }
}
