define([
  'summernote/core/dom',
  'summernote/core/range',
  'summernote/core/list'
], function (dom, range, list) {

  /**
   * Table
   * @class
   */
  var Table = function () {
    var GridData = function (tableNode) {
      var rows = list.from(tableNode.getElementsByTagName('TR')).filter(function (row) {
        return dom.ancestor(row, dom.isTable) === tableNode;
      });

      /**
       * two-dimension array
       * @type {Array[]}
       */
      var data = [];

      $.each(rows, function (rowIdx, row) {
        var cells = list.from(row.childNodes).filter(dom.isCell);
        var colIdx = 0;

        if (!data[rowIdx]) {
          data[rowIdx] = [];
        }

        $.each(cells, function (cellIdx, cell) {
          if (!data[rowIdx][colIdx]) {
            var colSpan = parseInt(cell.getAttribute('colSpan'), 10) || 1;
            var rowSpan = parseInt(cell.getAttribute('rowSpan'), 10) || 1;

            $.each(list.range(rowSpan), function (rowOffsetIdx, rowOffset) {
              $.each(list.range(colSpan), function (colOffsetIdx, colOffset) {
                data[rowIdx + rowOffset][colIdx + colOffset] = cell;
              });
            });
            colIdx += 1;
          }
        });
      });

      this.pos = function (cell) {
        var rowIdx = rows.indexOf(cell.parentNode);
        var colIdx = data[rowIdx].indexOf(cell);

        return {
          row: rowIdx,
          col: colIdx
        };
      };

      /**
       * @param {Node} startCell
       * @param {Node} endCell
       * @return {TableRange}
       */
      this.createTableRange = function (startCell, endCell) {
        var startPos = this.pos(startCell);
        var endPos = this.pos(endCell);

        return {
          start: {
            row: Math.min(startPos.row, endPos.row),
            col: Math.min(startPos.col, endPos.col)
          },
          end: {
            row: Math.max(startPos.row, endPos.row),
            col: Math.max(startPos.col, endPos.col)
          }
        };
      };

      /**
       * @param {Node} startCell
       * @param {Node} endCell
       * @return {Node[]}
       */
      this.cellsBetween = function (startCell, endCell) {
        var cells = [];
        var tableRange = this.createTableRange(startCell, endCell);

        $.each(list.range(tableRange.start.row, tableRange.end.row + 1), function (idx, rowIdx) {
          $.each(list.range(tableRange.start.col, tableRange.end.col + 1), function (idx, colIdx) {
            cells.push(data[rowIdx][colIdx]);
          });
        });

        return cells;
      };
    };

    /**
     * handle tab key
     *
     * @param {WrappedRange} rng
     * @param {Boolean} isShift
     */
    this.tab = function (rng, isShift) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var tableNode = dom.ancestor(cell, dom.isTable);
      var cells = dom.listDescendant(tableNode, dom.isCell);

      var nextCell = list[isShift ? 'prev' : 'next'](cells, cell);
      if (nextCell) {
        range.create(nextCell, 0).select();
      }
    };

    /**
     * create empty table element
     *
     * @param {Number} rowCount
     * @param {Number} colCount
     * @return {Node}
     */
    this.createTable = function (colCount, rowCount) {
      var tds = [], tdHTML;
      for (var idxCol = 0; idxCol < colCount; idxCol++) {
        tds.push('<td>' + dom.blank + '</td>');
      }
      tdHTML = tds.join('');

      var trs = [], trHTML;
      for (var idxRow = 0; idxRow < rowCount; idxRow++) {
        trs.push('<tr>' + tdHTML + '</tr>');
      }
      trHTML = trs.join('');
      return $('<table class="table table-bordered">' + trHTML + '</table>')[0];
    };

    this.cellsBetween = function (startCell, endCell) {
      var gridData = new GridData(dom.ancestor(startCell, dom.isTable));
      return gridData.cellsBetween(startCell, endCell);
    };
  };

  return Table;
});

