(function() {
  "use strict";

  var Drawer = function Drawer(element) {
    this.element_ = element;
    this.init();
  };

  window["Drawer"] = Drawer;

  Drawer.prototype.CssClasses_ = {
    IS_VISIBLE: "drawer--open",
    IS_ANIMATING: "drawer--animating"
  };

  Drawer.prototype.init = function() {
    if (this.element_) {
      var forElId =
        this.element_.getAttribute("for") ||
        this.element_.getAttribute("data-for");
      var forEl = null;

      if (forElId) {
        forEl = document.getElementById(forElId);
        if (forEl) {
          this.forElement_ = forEl;
          forEl.addEventListener("click", this.handleForClick_.bind(this));
        }
      }
    }
  };

  Drawer.prototype.handleForClick_ = function(evt) {
    this.toggle(evt);
  };

  Drawer.prototype.removeAnimationEndListener_ = function(evt) {
    console.log('removeAnimationEndListener_')
    evt.target.parentNode.classList.remove(
      Drawer.prototype.CssClasses_.IS_ANIMATING
    );
  };

  Drawer.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Drawer.prototype.show = function(evt) {
    if (this.element_) {
      window.requestAnimationFrame(
        function() {
          this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
          this.element_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this)
      );

      this.addAnimationEndListener_();
    }
  };

  Drawer.prototype.hide = function(evt) {
    if (this.element_) {
      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.element_.classList.remove(this.CssClasses_.IS_VISIBLE);

      this.addAnimationEndListener_();
    }
  };

  Drawer.prototype.toggle = function(evt) {
    if (this.element_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };

  Drawer.prototype["toggle"] = Drawer.prototype.toggle;

  componentHandler.register({
    constructor: Drawer,
    classAsString: 'Drawer',
    cssClass: 'js-drawer',
    widget: true
  });
})();
