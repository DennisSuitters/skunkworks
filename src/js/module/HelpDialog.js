import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';
import func from '../core/func';

export default class HelpDialog {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;

    context.memo('help.helpDialog.show', this.options.langInfo.help['helpDialog.show']);
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const footer = [
      '<p style="position:relative;text-align:center;margin:0;padding:0;">',
        '<a href="http://summernote.org/" target="_blank" rel="noopener noreferrer">Summernote @@VERSION@@</a> · ',
        '<a href="https://github.com/summernote/summernote/skunkworks" target="_blank" rel="noopener noreferrer">Project</a> · ',
        '<a href="https://github.com/summernote/summernote/skunkworks/issues" target="_blank" rel="noopener noreferrer">Issues</a>',
      '</p>',
    ].join('');

    this.$dialog = this.ui.dialog({
      className: 'note-help-modal' + (this.options.dialogsAnim != '' ? ' note-' + this.options.dialogsAnim : ''),
      title: this.lang.options.help,
      body: this.createShortcutList(),
      footer: footer,
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
      const $row = $('<div></div>');
      $row.append(
            $('<label class="note-help-label"><kbd>' + key + '</kdb></label>')
          )
          .append(
            $('<span class="note-help-text"></span>').html(this.context.memo('help.' + command) || command)
          )
          .append(
            $('<br>')
          );
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

      this.ui.onDialogHidden(this.$dialog, () => {
        if(deferred.state() === 'pending') {
          deferred.reject();
        }
      });

      $('.note-help-modal .note-close').focus();

      this.ui.showDialog(this.$dialog);
    }).promise();
  }

  show() {
    this.context.invoke('editor.saveRange');
    this.showHelpDialog().then(() => {
      this.context.invoke('editor.restoreRange');
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
}
