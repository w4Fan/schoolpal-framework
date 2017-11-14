(function() {
  "use strict";

  var Dialog = function Dialog(element) {
    this.element_ = element;
    this.isOpen_ = false;
    this.init();
  };

  window["Dialog"] = Dialog;

  Dialog.prototype.CssClasses_ = {
    IS_VISIBLE: "dialog--open",
    IS_ANIMATING: "dialog--animating",
    BACKDROP: "dialog__backdrop",
    ACCEPT_BTN: "dialog__footer__button--accept",
    CANCEL_BTN: "dialog__footer__button--cancel"
  };

  Dialog.prototype.init = function() {
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

    this.acceptBtn = this.element_.querySelector(
      "." + this.CssClasses_.ACCEPT_BTN
    );
    this.cancelBtn = this.element_.querySelector(
      "." + this.CssClasses_.CANCEL_BTN
    );

    var backdrop = this.element_.querySelector("." + this.CssClasses_.BACKDROP);

    backdrop.addEventListener("click", this.handleForClick_.bind(this));
  };

  Dialog.prototype.handleForClick_ = function(evt) {
    if (this.element_ && this.forElement_) {
      if (this.isOpen_) {
        this.hide();
      } else {
        this.show(evt);
      }
    }
  };

  Dialog.prototype.removeAnimationEndListener_ = function(evt) {
    if (this.classList.contains(Dialog.prototype.CssClasses_.IS_ANIMATING)) {
      this.classList.remove(Dialog.prototype.CssClasses_.IS_ANIMATING);
    }
  };

  Dialog.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Dialog.prototype.show = function(evt) {
    this.isOpen_ = true;

    window.requestAnimationFrame(
      function() {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );

    this.addAnimationEndListener_();
  };

  Dialog.prototype.hide = function(evt) {
    this.isOpen_ = false;

    window.requestAnimationFrame(
      function() {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.classList.remove(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );

    this.addAnimationEndListener_();
  };

  componentHandler.register({
    constructor: Dialog,
    classAsString: "Dialog",
    cssClass: "js-dialog",
    widget: true
  });
})();
