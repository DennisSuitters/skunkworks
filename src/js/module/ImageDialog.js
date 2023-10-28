import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';
import func from '../core/func';

export default class ImageDialog {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;

    context.memo('help.imageDialog.show', this.options.langInfo.help['imageDialog.show']);
  }

  initialize() {
    let imageLimitation = '';
    if (this.options.maximumImageFileSize) {
      const unit = Math.floor(Math.log(this.options.maximumImageFileSize) / Math.log(1024));
      const readableSize = (this.options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
      imageLimitation = `<small>${this.lang.image.maximumFileSize + ' : ' + readableSize}</small>`;
    }

    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = [
      (this.options.disableUpload === false ?
        '<label for="note-dialog-image-file-' + this.options.id + '" class="note-form-label">' + this.lang.image.selectFromFiles + '<div class="note-form-help">' + this.lang.image.fileNote + '</div></label>' +
        '<div class="note-form-group note-group-select-from-files">' +
          '<input id="note-dialog-image-file-' + this.options.id + '" class="note-image-input note-input" type="file" name="files" accept="' + this.options.acceptImageFileTypes + '" multiple="multiple"/>' +
          imageLimitation +
        '</div>'
      :
        ''
      ),
      '<label for="note-dialog-image-url-' + this.options.id + '" class="note-form-label">' + this.lang.image.url + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-image-url-' + this.options.id + '" class="note-image-url note-input" type="text"/>',
        (this.options.fileExplorer !== '' ?
          '<button class="note-btn" onclick="' + this.options.fileExplorer + '(`note-dialog-image-url-' + this.options.id + '`);">' + this.lang.image.fileBrowser + '</button>'
        :
          ''
        ),
      '</div>',
      '<label for="note-dialog-image-title-' + this.options.id + '" class="note-form-label">' + this.lang.image.title + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-image-title-' + this.options.id + '" class="note-image-title note-input" type="text"/>',
      '</div>',
      '<label for="note-dialog-image-alt-' + this.options.id + '" class="note-form-label">' + this.lang.image.alt + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-image-alt-' + this.options.id + '" class="note-image-alt note-input" type="text"/>',
      '</div>',
      '<label for="note-dialog-image-class-' + this.options.id + '" class="note-form-label">' + this.lang.image.class + '</label>',
      '<div class="note-form-group">',
        '<input id="note-dialog-image-class-' + this.options.id + '" class="note-image-class note-input" type="text"/>',
      '</div>',
    ].join('');
    const footer = '<input type="button" href="#" class="note-btn note-btn-primary note-image-btn" value="' + this.lang.image.insert + '" disabled>';

    this.$dialog = this.ui.dialog({
      className: 'note-image-modal' + (this.options.dialogsAnim != '' ? ' note-' + this.options.dialogsAnim : ''),
      title: this.lang.image.insert,
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
   * @param {Object} layoutInfo
   */
  show() {
    const imageInfo = this.context.invoke('editor.getImageInfo');


    this.context.invoke('editor.saveRange');
    this.showImageDialog(imageInfo).then((data) => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange');

      if (typeof data === 'string') { // image url
        // If onImageLinkInsert set,
        if (this.options.callbacks.onImageLinkInsert) {
          this.context.triggerEvent('image.link.insert', data);
        } else {
          this.context.invoke('editor.insertImage', data);
        }
      } else { // array of files
        this.context.invoke('editor.insertImagesOrCallback', data);
      }
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }

  /**
   * show image dialog
   *
   * @param {jQuery} $dialog
   * @return {Promise}
   */
   showImageDialog() {
     return $.Deferred((deferred) => {
       const $imageInput = this.$dialog.find('.note-image-input');
       const $imageUrl = this.$dialog.find('.note-image-url');
       const $imageTitle = this.$dialog.find('.note-image-title');
       const $imageAlt = this.$dialog.find('.note-image-alt');
       const $imageClass = this.$dialog.find('.note-image-class');
       const $imageBtn = this.$dialog.find('.note-image-btn');

       this.ui.onDialogShown(this.$dialog, () => {
         this.context.triggerEvent('dialog.shown');

         // Cloning imageInput to clear element.
         $imageInput.replaceWith($imageInput.clone().on('change', (event) => {
           deferred.resolve(event.target.files || event.target.value);
         }).val(''));

         $imageUrl.on('input paste propertychange', () => {
           this.ui.toggleBtn($imageBtn, $imageUrl.val());
         }).val('');

         if (!env.isSupportTouch) {
           $imageUrl.trigger('focus');
         }

         $imageBtn.click((event) => {
           event.preventDefault();
           deferred.resolve($imageUrl.val());
         });

         this.bindEnterKey($imageUrl, $imageBtn);
       });

       this.ui.onDialogHidden(this.$dialog, () => {
         $imageInput.off();
         $imageUrl.off();
         $imageBtn.off();

         if (deferred.state() === 'pending') {
           deferred.reject();
         }
       });

       this.ui.showDialog(this.$dialog);
     });
   }
}
