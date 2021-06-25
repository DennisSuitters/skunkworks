import $ from 'jquery';
import env from '../core/env';

export default class HelpDialog {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = [
      '<p class="note-text-center">',
        '<a href="http://summernote.org/" target="_blank" rel="nopener noreferrer">Summernote @@VERSION@@</a> · ',
        '<a href="https://github.com/summernote/summernote" target="_blank" rel="nopener noreferrer">Project</a> · ',
        '<a href="https://github.com/summernote/summernote/issues" target="_blank" rel="nopener noreferrer">Issues</a>',
      '</p>',
    ].join('');

    this.$dialog = this.ui.dialog({
      title: this.lang.options.help,
      fade: this.options.dialogsFade,
      body: this.createShortcutList(),
      footer: body,
      callback: ($node) => {
        $node.find('.note-modal-body').css({
          'max-height': 300,
          'overflow': 'scroll',
        });
      },
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  createShortcutList() {
    const keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
    return Object.keys(keyMap).map((key) => {
      const command = keyMap[key];
      const $row = $('<div><div class="note-help-list-item"></div></div>');
      $row.append($('<label class="note-help"><kbd class="note-help">' + key + '</kdb></label>').css({
        'width': 150,
        'margin-right': 5,
      })).append($('<span class="note-help"/>').html(this.context.memo('help.' + command) || command));
      return $row.html();
    }).join('');
  }

  /**
   * show help dialog
   *
   * @return {Promise}
   */
  showHelpDialog() {
    return $.Deferred((deferred) => {
      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');
        deferred.resolve();
      });
      this.ui.showDialog(this.$dialog);
    }).promise();
  }

  show() {
    this.context.invoke('editor.saveRange');
    this.showHelpDialog().then(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
}
