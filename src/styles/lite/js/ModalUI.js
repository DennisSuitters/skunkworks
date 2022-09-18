import $ from 'jquery';

class ModalUI {
  constructor($node /*, options */) {
    this.$modal = $node;
    this.$backdrop = $('<div class="note-modal-backdrop"></div>');
  }

  show() {
    this.$backdrop.appendTo(document.body).show();
    this.$modal.addClass('note-open').show();
    this.$modal.trigger('note.modal.show');
    this.$modal.off('click', '.note-close').on('click', '.note-close', this.hide.bind(this));
    this.$modal.on('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.hide();
      }
    });
    this.$modal.on('click', (event) => {
      if(event.target.classList.contains('note-open')){
        this.hide();
      }
    });
  }

  hide() {
    this.$modal.removeClass('note-open').hide();
    this.$backdrop.hide();
    this.$modal.trigger('note.modal.hide');
    this.$modal.off('keydown');
  }
}

export default ModalUI;
