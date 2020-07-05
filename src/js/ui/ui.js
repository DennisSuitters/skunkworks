import $ from 'jquery';
import renderer from '../base/renderer';
import TooltipUI from './TooltipUI';
import DropdownUI from './DropdownUI';
import ModalUI from './ModalUI';

const editor = renderer.create('<div class="note-editor note-frame"></div>');
const toolbar = renderer.create('<div class="note-toolbar" role="toolbar"></div>');
const editingArea = renderer.create('<div class="note-editing-area"></div>');
const codable = renderer.create('<textarea class="note-codable" aria-multiline="true"></div>');
const editable = renderer.create('<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"></div>');
const statusbar = renderer.create([
  '<div class="note-statusbar" role="status">',
    '<output class="note-status-output" aria-live="polite"></output>',
    '<div class="note-resizebar" aria-label="resize">',
      '<div class="note-icon-bar"></div>',
      '<div class="note-icon-bar"></div>',
      '<div class="note-icon-bar"></div>',
      '<div class="note-powered"><a href="https://summernote.org/">Powered by Summernote</a></div>',
    '</div>',
  '</div>',
].join(''));

const airEditor = renderer.create('<div class="note-editor note-airframe"></div>');
const airEditable = renderer.create([
  '<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"></div>',
  '<output class="note-status-output" role="status" aria-live="polite"></output>',
].join(''));

const buttonGroup = renderer.create('<div class="note-btn-group">');
const button = renderer.create('<button type="button" class="note-btn" tabindex="-1">', function($node, options) {
  // set button type
  if (options && options.tooltip) {
    $node.attr({
      'aria-label': options.tooltip,
    });
    $node.data('_lite_tooltip', new TooltipUI($node, {
      title: options.tooltip,
      container: options.container,
    })).on('click', (e) => {
      $(e.currentTarget).data('_lite_tooltip').hide();
    });
  }
  if (options.contents) {
    $node.html(options.contents);
  }

  if (options && options.data && options.data.toggle === 'dropdown') {
    $node.data('_lite_dropdown', new DropdownUI($node, {
      container: options.container,
    }));
  }

  if (options && options.codeviewKeepButton) {
    $node.addClass('note-codeview-keep');
  }
});

const dropdown = renderer.create('<div class="note-dropdown-menu" role="list">', function($node, options) {
  const markup = Array.isArray(options.items) ? options.items.map(function(item) {
    const value = (typeof item === 'string') ? item : (item.value || '');
    const content = options.template ? options.template(item) : item;
    const $temp = $('<a class="note-dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + value + '"></a>');

    $temp.html(content).data('item', item);

    return $temp;
  }) : options.items;

  $node.html(markup).attr({ 'aria-label': options.title });

  $node.on('click', '> .note-dropdown-item', function(event) {
    const $a = $(this);

    const item = $a.data('item');
    const value = $a.data('value');

    if (item.click) {
      item.click($a);
    } else if (options.itemClick) {
      options.itemClick(event, item, value);
    }
  });
  if (options && options.codeviewKeepButton) {
    $node.addClass('note-codeview-keep');
  }
});

const dropdownCheck = renderer.create('<div class="note-dropdown-menu note-check" role="list">', function($node, options) {
  const markup = Array.isArray(options.items) ? options.items.map(function(item) {
    const value = (typeof item === 'string') ? item : (item.value || '');
    const content = options.template ? options.template(item) : item;

    const $temp = $('<a class="note-dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + item + '"></a>');
    $temp.html([icon(options.checkClassName), ' ', content]).data('item', item);
    return $temp;
  }) : options.items;

  $node.html(markup).attr({ 'aria-label': options.title });

  $node.on('click', '> .note-dropdown-item', function(event) {
    const $a = $(this);

    const item = $a.data('item');
    const value = $a.data('value');

    if (item.click) {
      item.click($a);
    } else if (options.itemClick) {
      options.itemClick(event, item, value);
    }
  });
  if (options && options.codeviewKeepButton) {
    $node.addClass('note-codeview-keep');
  }
});

const dropdownButtonContents = function(contents, options) {
  return contents + ' ' + icon(options.icons.caret, 'span');
};

const dropdownButton = function() {
  return buttonGroup().render();
};

const dropdownCheckButton = function() {
  return buttonGroup().render();
};

const paragraphDropdownButton = function() {
  return buttonGroup().render();
};

const tableDropdownButton = function() {
  return buttonGroup().render();
};

const palette = renderer.create('<div class="note-color-palette"></div>', function($node, options) {
  const contents = [];
  for (let row = 0, rowSize = options.colors.length; row < rowSize; row++) {
    const eventName = options.eventName;
    const colors = options.colors[row];
    const colorsName = options.colorsName[row];
    const buttons = [];
    for (let col = 0, colSize = colors.length; col < colSize; col++) {
      const color = colors[col];
      const colorName = colorsName[col];
      buttons.push([
        '<button type="button" class="note-btn note-color-btn"',
        'style="background-color:', color, '" ',
        'data-event="', eventName, '" ',
        'data-value="', color, '" ',
        'data-title="', colorName, '" ',
        'aria-label="', colorName, '" ',
        'data-toggle="button" tabindex="-1"></button>',
      ].join(''));
    }
    contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
  }
  $node.html(contents.join(''));

  $node.find('.note-color-btn').each(function() {
    $(this).data('_lite_tooltip', new TooltipUI($(this), {
      container: options.container,
    }));
  });
});

const colorDropdownButton = function() {
  return buttonGroup().render();
};

const dialog = renderer.create('<div class="note-modal" aria-hidden="false" tabindex="-1" role="dialog"></div>', function($node, options) {
  if (options.fade) {
    $node.addClass('fade');
  }
  $node.attr({
    'aria-label': options.title,
  });
  $node.html([
    '<div class="note-modal-content">',
      (options.title ? '<div class="note-modal-header"><button type="button" class="note-close" aria-label="Close" aria-hidden="true"><i class="note-icon-close"></i></button><h4 class="note-modal-title">' + options.title + '</h4></div>' : ''),
      '<div class="note-modal-body">' + options.body + '</div>',
      (options.footer ? '<div class="note-modal-footer">' + options.footer + '</div>' : ''),
    '</div>',
  ].join(''));

  $node.data('modal', new ModalUI($node, options));
});

const videoDialog = function() {
  return dialog().render();
};

const imageDialog = function() {
  return dialog().render();
};

const linkDialog = function() {
  return dialog().render();
};

const popover = renderer.create([
  '<div class="note-popover bottom">',
    '<div class="note-popover-arrow"></div>',
    '<div class="note-popover-content note-children-container"></div>',
  '</div>',
].join(''), function($node, options) {
  const direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';

  $node.addClass(direction).hide();

  if (options.hideArrow) {
    $node.find('.note-popover-arrow').hide();
  }
});

const checkbox = renderer.create('<div class="note-checkbox"></div>', function($node, options) {
  $node.html([
    '<input type="checkbox"' + (options.id ? ' id="' + options.id + '"' : ''),
    (options.checked ? ' checked' : ''),
    ' aria-checked="' + (options.checked ? 'true' : 'false') + '"/>',
    '<label' + (options.id ? ' for="' + options.id + '"' : '') + '>',
      (options.text ? options.text : ''),
    '</label>',
  ].join(''));
});

const icon = function(iconClassName, tagName) {
  tagName = tagName || 'i';
  return '<' + tagName + ' class="' + iconClassName + '"></' + tagName + '>';
};

const ui = function(options) {
  return {
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    airEditor: airEditor,
    airEditable: airEditable,
    buttonGroup: buttonGroup,
    button: button,
    dropdown: dropdown,
    dropdownCheck: dropdownCheck,
    dropdownButton: dropdownButton,
    dropdownButtonContents: dropdownButtonContents,
    dropdownCheckButton: dropdownCheckButton,
    paragraphDropdownButton: paragraphDropdownButton,
    tableDropdownButton: tableDropdownButton,
    colorDropdownButton: colorDropdownButton,
    palette: palette,
    dialog: dialog,
    videoDialog: videoDialog,
    imageDialog: imageDialog,
    linkDialog: linkDialog,
    popover: popover,
    checkbox: checkbox,
    icon: icon,
    options: options,

    toggleBtn: function($btn, isEnable) {
      $btn.toggleClass('note-disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    },

    toggleBtnActive: function($btn, isActive) {
      $btn.toggleClass('note-active', isActive);
    },

    check: function($dom, value) {
      $dom.find('.note-checked').removeClass('note-checked');
      $dom.find('[data-value="' + value + '"]').addClass('note-checked');
    },

    onDialogShown: function($dialog, handler) {
      $dialog.one('note.modal.show', handler);
    },

    onDialogHidden: function($dialog, handler) {
      $dialog.one('note.modal.hide', handler);
    },

    showDialog: function($dialog) {
      $dialog.data('modal').show();
    },

    hideDialog: function($dialog) {
      $dialog.data('modal').hide();
    },

    /**
     * get popover content area
     *
     * @param $popover
     * @returns {*}
     */
    getPopoverContent: function($popover) {
      return $popover.find('.note-popover-content');
    },

    /**
     * get dialog's body area
     *
     * @param $dialog
     * @returns {*}
     */
    getDialogBody: function($dialog) {
      return $dialog.find('.note-modal-body');
    },

    createLayout: function($note) {
      const $editor = (options.airMode ? airEditor([
        editingArea([
          codable(),
          airEditable(),
        ]),
      ]) : (options.toolbarPosition === 'bottom'
        ? editor([
          editingArea([
            codable(),
            editable(),
          ]),
          toolbar(),
          statusbar(),
        ])
        : editor([
          toolbar(),
          editingArea([
            codable(),
            editable(),
          ]),
          statusbar(),
        ])
      )).render();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editingArea: $editor.find('.note-editing-area'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar'),
      };
    },

    removeLayout: function($note, layoutInfo) {
      $note.html(layoutInfo.editable.html());
      layoutInfo.editor.remove();
      $note.off('summernote'); // remove summernote custom event
      $note.show();
    },
  };
};

export default ui;
