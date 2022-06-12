import $ from 'jquery';

class DropdownUI {
  constructor($node, options) {
    this.$button = $node;
    this.options = $.extend({}, {
      target: options.container,
    }, options);
    this.setEvent();
  }

  setEvent() {
    this.$button.on('click', (e) => {
      this.toggle();
      e.stopImmediatePropagation();
    });
  }

  clear() {
    var $parent = $('.note-btn-group.note-open');
    $parent.find('.note-btn.note-active').removeClass('note-active');
    $parent.removeClass('note-open');
  }

  show() {
    this.$button.addClass('note-active');
    this.$button.parent().addClass('note-open');

    var $dropdown = this.$button.next();
    var offset = $dropdown.offset();
    var width = $dropdown.outerWidth();
    var windowWidth = $(window).width();
    var targetMarginRight = parseFloat($(this.options.target).css('margin-right'));

    if (offset.left + width > windowWidth - targetMarginRight) {
      $dropdown.css('margin-left', windowWidth - targetMarginRight - (offset.left + width));
    } else {
      $dropdown.css('margin-left', '');
    }
  }

  hide() {
    this.$button.removeClass('note-active');
    this.$button.parent().removeClass('note-open');
  }

  toggle() {
    var isOpened = this.$button.parent().hasClass('note-open');

    this.clear();

    if (isOpened) {
      this.hide();
    } else {
      this.show();
    }
  }
}

$(document).on('click.note-dropdown-menu', function(e) {
  if (!$(e.target).closest('.note-btn-group').length) {
    $('.note-btn-group.note-open .note-btn.note-active').removeClass('note-active');
    $('.note-btn-group.note-open').removeClass('note-open');
  }
});

$(document).on('click.note-dropdown-menu', function(e) {
  $(e.target).closest('.note-dropdown-menu').parent().removeClass('note-open');
  $(e.target).closest('.note-dropdown-menu').parent().find('.note-btn.note-active').removeClass('note-active');
});

export default DropdownUI;
