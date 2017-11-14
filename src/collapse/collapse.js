(function() {
  "use strict";

  var Collapse = function Collapse(element) {
    this.element_ = element;
    this.init();
  };

  window["Collapse"] = Collapse;

  Collapse.prototype.CssClasses_ = {
    JS_COLLAPSE: "js-collapse",
    ITEM: "list-item",
    IS_VISIBLE: "collapse--open"
  };

  Collapse.prototype.init = function() {
    if (this.element_) {
      this.outline_ = this.element_.parentNode;
      this.container_ = this.element_.nextElementSibling;
      this.element_.addEventListener("click", this.handleForClick_.bind(this));
    }
  };

  Collapse.prototype.handleForClick_ = function(evt) {
    this.toggle(evt);
  };

  Collapse.prototype.show = function(evt) {
    var collapses = document.getElementsByClassName(
      this.CssClasses_.JS_COLLAPSE
    );
    var items = this.container_.querySelectorAll("." + this.CssClasses_.ITEM);
    var count = items.length;
    var height = items[0].getBoundingClientRect().height * count;

    for (var i = 0; i < collapses.length; i++) {
      if (
        collapses[i]["Collapse"].element_ !== this.element_ &&
        collapses[i]["Collapse"].outline_.classList.contains(
          this.CssClasses_.IS_VISIBLE
        )
      ) {
        collapses[i]["Collapse"].hide();
      }
    }

    window.requestAnimationFrame(
      function() {
        this.container_.style.height = height + "px";
        this.outline_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );
  };

  Collapse.prototype.hide = function(evt) {
    window.requestAnimationFrame(
      function() {
        this.container_.style.height = "0px";
        this.outline_.classList.remove(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );
  };

  Collapse.prototype.toggle = function(evt) {
    if (this.outline_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };

  Collapse.prototype["toggle"] = Collapse.prototype.toggle;

  componentHandler.register({
    constructor: Collapse,
    classAsString: "Collapse",
    cssClass: "js-collapse",
    widget: true
  });
})();
