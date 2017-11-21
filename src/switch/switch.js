(function() {
  "use strict";

  var Switch = function Switch(element) {
    this.element_ = element;
    this.init();
  };
  window["Switch"] = Switch;

  Switch.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001
  };

  Switch.prototype.CssClasses_ = {
    INPUT: "switch__input",
    TRACK: "switch__track",
    THUMB: "switch__thumb",
    FOCUS_HELPER: "switch__focus-helper",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE_CONTAINER: "switch__ripple-container",
    RIPPLE_CENTER: "ripple--center",
    RIPPLE: "ripple",
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_CHECKED: "is-checked"
  };

  Switch.prototype.onChange_ = function(event) {
    this.updateClasses_();
  };

  Switch.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  Switch.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  Switch.prototype.onMouseUp_ = function(event) {
    this.blur_();
  };

  Switch.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkToggleState();
  };

  Switch.prototype.blur_ = function() {
    window.setTimeout(
      function() {
        this.inputElement_.blur();
      }.bind(this),
      /** @type {number} */ (this.Constant_.TINY_TIMEOUT)
    );
  };

  Switch.prototype.checkDisabled = function() {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  Switch.prototype["checkDisabled"] = Switch.prototype.checkDisabled;

  Switch.prototype.checkToggleState = function() {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  Switch.prototype["checkToggleState"] = Switch.prototype.checkToggleState;

  Switch.prototype.disable = function() {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  Switch.prototype["disable"] = Switch.prototype.disable;

  Switch.prototype.enable = function() {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  Switch.prototype["enable"] = Switch.prototype.enable;

  Switch.prototype.on = function() {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  Switch.prototype["on"] = Switch.prototype.on;

  Switch.prototype.off = function() {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  Switch.prototype["off"] = Switch.prototype.off;

  Switch.prototype.init = function() {
    if (this.element_) {
      this.inputElement_ = this.element_.querySelector(
        "." + this.CssClasses_.INPUT
      );

      var track = document.createElement("div");
      track.classList.add(this.CssClasses_.TRACK);

      var thumb = document.createElement("div");
      thumb.classList.add(this.CssClasses_.THUMB);

      var focusHelper = document.createElement("span");
      focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);

      thumb.appendChild(focusHelper);

      this.element_.appendChild(track);
      this.element_.appendChild(thumb);

      this.boundMouseUpHandler = this.onMouseUp_.bind(this);
      this.boundChangeHandler = this.onChange_.bind(this);
      this.boundFocusHandler = this.onFocus_.bind(this);
      this.boundBlurHandler = this.onBlur_.bind(this);

      this.inputElement_.addEventListener("change", this.boundChangeHandler);
      this.inputElement_.addEventListener("focus", this.boundFocusHandler);
      this.inputElement_.addEventListener("blur", this.boundBlurHandler);
      this.element_.addEventListener("mouseup", this.boundMouseUpHandler);

      this.updateClasses_();
      this.element_.classList.add("is-upgraded");
    }
  };

  componentHandler.register({
    constructor: Switch,
    classAsString: "Switch",
    cssClass: "js-switch",
    widget: true
  });
})();
