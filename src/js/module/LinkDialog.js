import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';
import func from '../core/func';

export default class LinkDialog {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;

    context.memo('help.linkDialog.show', this.options.langInfo.help['linkDialog.show']);
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;

    let linkChoices='';
    for(let i = 0; i < this.options.linkList.length; i++) {
      let linkOpts = this.options.linkList[i];
      linkChoices += `<option value="` + linkOpts[0] + `|` + linkOpts[1] + `">` + linkOpts[2] + `</option>`;
    }

    const body = [
      (linkChoices !== '' ?
        '<label for="note-dialog-link-list-' + this.options.id + '" class="note-form-label">' + this.lang.link.linkList + '</label>' +
        '<div class="note-form-group">' +
          '<select id="note-dialog-link-list-' + this.options.id + '" class="note-link-list note-input">' +
            '<option value="|">Select a Link</option>' +
            linkChoices +
          '</select>' +
        '</div>'
      : ''
      ),
      '<label for="note-dialog-link-url-' + this.options.id + '" class="note-form-label">' + this.lang.link.url + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-link-url-' + this.options.id + '" class="note-link-url note-input" type="text" value="https://"/>',
      '</div>',
      '<label for="note-dialog-link-txt-' + this.options.id + '" class="note-form-label">' + this.lang.link.textToDisplay + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-link-txt-' + this.options.id + '" class="note-link-text note-input" type="text">',
      '</div>',
      '<label for="note-dialog-link-title-' + this.options.id + '" class="note-form-label">' + this.lang.link.title + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-link-title' + this.options.id + '" class="note-link-title note-input" type="text">',
      '</div>',
      '<label for="note-dialog-link-rel-' + this.options.id + '" class="note-form-label">' + this.lang.link.rel + '</label>',
      '<div class="note-form-group">',
        '<select id="note-dialog-link-rel-' + this.options.id + '" class="note-link-rel note-input">',
          '<option value="" selected>Do not use Rel attribute (For Same Site Links)</option>',
          '<option value="noreferrer noopener">NoReferrer NoOpener (Suggested for external links that open in new tabs or windows)</option>',
          '<option value="alternate">Alternate</option>',
          '<option value="author">Author</option>',
          '<option value="bookmark">Bookmark</option>',
          '<option value="external">External</option>',
          '<option value="Help">Help</option>',
          '<option value="license">License</option>',
          '<option value="next">Next</option>',
          '<option value="nofollow">NoFollow</option>',
          '<option value="noreferrer">NoReferrer</option>',
          '<option value="noopener">NoOperner</option>',
          '<option value="prev">Prev</option>',
          '<option value="search">Search</option>',
          '<option value="tag">Tag</option>',
        '</select>',
      '</div>',
      !this.options.disableLinkTarget
        ? $('<div></div>').append(this.ui.checkbox({
          for: 'note-dialog-new-window-' + this.options.id,
          id: 'note-checkbox-open-in-new-window-' + this.options.id,
          className: 'note-checkbox-open-in-new-window',
          text: this.lang.link.openInNewWindow,
          checked: false,
        }).render()).html()
        : '',
      $('<div></div>').append(this.ui.checkbox({
        for: 'note-dialog-link-use-protocol-' + this.options.id,
        id: 'note-checkbox-use-protocol-' + this.options.id,
        className: 'note-checkbox-use-protocol',
        text: this.lang.link.useProtocol,
        checked: true,
      }).render()).html(),
    ].join('');
    const footer = '<input type="button" href="#" class="note-btn note-btn-primary note-link-btn" value="' + this.lang.link.insert + '" disabled>';

    this.$dialog = this.ui.dialog({
      className: 'note-link-modal' + (this.options.dialogsAnim != '' ? ' note-' + this.options.dialogsAnim : ''),
      title: this.lang.link.insert,
      body: body,
      footer: footer,
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', (event) => {
      if (event.keyCode === key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }

  /**
   * toggle update button
   */
  toggleLinkBtn($linkBtn, $linkText, $linkUrl) {
    this.ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
  }

  /**
   * Show link dialog and set event handlers on dialog controls.
   *
   * @param {Object} linkInfo
   * @return {Promise}
   */
  showLinkDialog(linkInfo) {
    return $.Deferred((deferred) => {
      const $linkList = this.$dialog.find('.note-link-list');
      const $linkUrl = this.$dialog.find('.note-link-url');
      const $linkText = this.$dialog.find('.note-link-text');
      const $linkTitle = this.$dialog.find('.note-link-title');
      const $linkRel = this.$dialog.find('.note-link-rel');
      const $linkBtn = this.$dialog.find('.note-link-btn');
      const $openInNewWindow = this.$dialog.find('.note-checkbox-open-in-new-window input[type=checkbox]');
      const $useProtocol = this.$dialog.find('.note-checkbox-use-protocol input[type=checkbox]');

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');

        // If no url was given and given text is valid URL then copy that into URL Field
        if (!linkInfo.url && func.isValidUrl(linkInfo.text)) {
          linkInfo.url = linkInfo.text;
        }

        $linkList.on('change', () => {
          const linkSplit = $linkList.val().split('|');
          $linkText.val(linkSplit[0]);
          $linkTitle.val(linkSplit[0]);
          $linkUrl.val(linkSplit[1]);
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        });

        $linkText.on('input paste propertychange', () => {
          // If linktext was modified by input events,
          // cloning text from linkUrl will be stopped.
          linkInfo.text = $linkText.val();
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        }).val(linkInfo.text);

        $linkUrl.on('input paste propertychange', () => {
          // Display same text on `Text to display` as default
          // when linktext has no text
          if (!linkInfo.text) {
            $linkText.val($linkUrl.val());
          }
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        }).val(linkInfo.url);

        $linkTitle.val(linkInfo.title);

        if (!env.isSupportTouch) {
          $linkUrl.trigger('focus');
        }

        this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        this.bindEnterKey($linkUrl, $linkBtn);
        this.bindEnterKey($linkText, $linkBtn);

        const isNewWindowChecked = linkInfo.isNewWindow !== undefined ? linkInfo.isNewWindow : this.context.options.linkTargetBlank;

        if ($openInNewWindow.prop('checked')) {
          if (linkInfo.rel) {
            $linkRel.val(linkInfo.rel);
          }
        }

        const useProtocolChecked = linkInfo.url ? false : this.context.options.useProtocol;

        $useProtocol.prop('checked', useProtocolChecked);

        $linkBtn.one('click', (event) => {
          event.preventDefault();

          deferred.resolve({
            range: linkInfo.range,
            url: $linkUrl.val(),
            text: $linkText.val(),
            title: $linkTitle.val(),
            rel: $linkRel.val(),
            isNewWindow: $openInNewWindow.is(':checked'),
            checkProtocol: $useProtocol.is(':checked'),
          });
          this.ui.hideDialog(this.$dialog);
        });
      });

      this.ui.onDialogHidden(this.$dialog, () => {
        // detach events
        $linkText.off();
        $linkUrl.off();
        $linkBtn.off();

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });

      this.ui.showDialog(this.$dialog);
    }).promise();
  }

  /**
   * @param {Object} layoutInfo
   */
  show() {
    const linkInfo = this.context.invoke('editor.getLinkInfo');

    this.context.invoke('editor.saveRange');
    this.showLinkDialog(linkInfo).then((linkInfo) => {
      this.context.invoke('editor.restoreRange');
      this.context.invoke('editor.createLink', linkInfo);
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
}
