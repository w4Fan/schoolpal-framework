(function() {
  "use strict";

  var Collapse = function Collapse(element) {
    this.element_ = element;
    this.init();
  };

  window["Collapse"] = Collapse;

  Collapse.prototype.CssClasses_ = {
    ITEM: "list-item",
    IS_VISIBLE: "collapse--open",
    IS_ANIMATING: "collapse--animating"
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

  Collapse.prototype.removeAnimationEndListener_ = function(evt) {
    evt.target.parentNode.classList.remove(
      Collapse.prototype.CssClasses_.IS_ANIMATING
    );
  };

  Collapse.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Collapse.prototype.show = function(evt) {
    if (this.element_) {
      var items = this.container_.querySelectorAll("." + this.CssClasses_.ITEM);
      var count = items.length;
      var height = items[0].getBoundingClientRect().height * count;

      window.requestAnimationFrame(
        function() {
          this.outline_.classList.add(this.CssClasses_.IS_ANIMATING);
          this.container_.style.height = height + "px";
          this.outline_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this)
      );

      this.addAnimationEndListener_();
    }
  };

  Collapse.prototype.hide = function(evt) {
    if (this.element_) {
      this.outline_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.container_.style.height = "0px";
      this.outline_.classList.remove(this.CssClasses_.IS_VISIBLE);

      this.addAnimationEndListener_();
    }
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
    classAsString: 'Collapse',
    cssClass: 'js-collapse',
    widget: true
  });
})();
