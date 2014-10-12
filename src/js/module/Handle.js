define('summernote/module/Handle', function () {
  /**
   * Handle
   */
  var Handle = function () {
    this.getNodeRect = function ($node, isAirMode) {
      var pos = isAirMode ? $node.offset() : $node.position();

      // include margin
      return {
        left: pos.left,
        top: pos.top,
        width: $node.outerWidth(true),
        height: $node.outerHeight(true)
      };
    };

    /**
     * update handle
     * @param {jQuery} $handle
     * @param {Object} styleInfo
     * @param {Boolean} isAirMode
     */
    this.update = function ($handle, styleInfo, isAirMode) {
      var $selection = $handle.find('.note-control-selection');

      // image selection
      if (styleInfo.image) {
        var rect = this.getNodeRect($(styleInfo.image), isAirMode);
        $selection.css({
          display: 'block',
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        }).data('target', styleInfo.image); // save current image element.
        var sizingText = rect.width + 'x' + rect.height;
        $selection.find('.note-control-selection-info').text(sizingText);
      } else {
        $selection.hide();
      }

      // table cell selection
      $('.note-selected').removeClass('note-selected');
      if (styleInfo.cells && styleInfo.cells.length) {
        $.each(styleInfo.cells, function (idx, cell) {
          $(cell).addClass('note-selected');
        });
      }
    };

    this.hide = function ($handle) {
      $handle.children().hide();
    };
  };

  return Handle;
});
