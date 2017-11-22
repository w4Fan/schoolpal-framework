(function() {
  "use strict";

  var DataTable = function DataTable(element) {
    this.element_ = element;
    this.init();
  };

  window["DataTable"] = DataTable;

  DataTable.prototype.CssClasses_ = {
    DATA_TABLE: "data-table",
    SELECTABLE: "data-table--selectable",
    SELECT_ELEMENT: "data-table__select",
    IS_SELECTED: "is-selected",
    IS_UPGRADED: "is-upgraded"
  };

  DataTable.prototype.selectRow_ = function(checkbox, row, opt_rows) {
    if (row) {
      return function() {
        if (checkbox.checked) {
          var otherRow = Array.prototype.filter.call(
            row.parentNode.children,
            child => {
              return (
                child !== row &&
                child.classList.contains(this.CssClasses_.IS_SELECTED)
              );
            }
          );

          if (otherRow.length) {
            var el = otherRow[0].querySelector("td").querySelector(".checkbox");

            el["Checkbox"].uncheck();
            otherRow[0].classList.remove(this.CssClasses_.IS_SELECTED);
          }

          row.classList.add(this.CssClasses_.IS_SELECTED);
        } else {
          row.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      }.bind(this);
    }

    if (opt_rows) {
      return function() {
        var i;
        var el;
        if (checkbox.checked) {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector("td").querySelector(".checkbox");
            el["Checkbox"].check();
            opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
          }
        } else {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector("td").querySelector(".checkbox");
            el["Checkbox"].uncheck();
            opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
          }
        }
      }.bind(this);
    }
  };

  DataTable.prototype.createCheckbox_ = function(row, opt_rows) {
    var label = document.createElement("label");
    var labelClasses = [
      "checkbox",
      "js-checkbox",
      this.CssClasses_.SELECT_ELEMENT
    ];
    label.className = labelClasses.join(" ");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox__input");

    if (row) {
      checkbox.checked = row.classList.contains(this.CssClasses_.IS_SELECTED);
      checkbox.addEventListener("change", this.selectRow_(checkbox, row));
    } else if (opt_rows) {
      checkbox.addEventListener(
        "change",
        this.selectRow_(checkbox, null, opt_rows)
      );
    }

    label.appendChild(checkbox);
    componentHandler.upgradeElement(label, "Checkbox");
    return label;
  };

  DataTable.prototype.init = function() {
    if (this.element_) {
      var firstHeader = this.element_.querySelector("th");
      var rows = Array.prototype.slice.call(
        this.element_.querySelectorAll("tbody tr")
      );

      if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
        var th = document.createElement("th");

        th.style.width = "66px";
        firstHeader.parentElement.insertBefore(th, firstHeader);

        for (var i = 0; i < rows.length; i++) {
          var firstCell = rows[i].querySelector("td");
          if (firstCell) {
            var td = document.createElement("td");
            if (rows[i].parentNode.nodeName.toUpperCase() === "TBODY") {
              var rowCheckbox = this.createCheckbox_(rows[i]);
              td.appendChild(rowCheckbox);
            }
            rows[i].insertBefore(td, firstCell);
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    }
  };

  componentHandler.register({
    constructor: DataTable,
    classAsString: "DataTable",
    cssClass: "js-data-table"
  });
})();
