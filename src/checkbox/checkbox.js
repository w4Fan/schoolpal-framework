(function() {
  "use strict";

  var Checkbox = function Checkbox(element) {
    this.element_ = element;
    this.init();
  };
  window["Checkbox"] = Checkbox;

  Checkbox.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001
  };

  Checkbox.prototype.CssClasses_ = {
    INPUT: "checkbox__input",
    BOX_OUTLINE: "checkbox__box-outline",
    TICK_OUTLINE: "checkbox__tick-outline",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE_CONTAINER: "checkbox__ripple-container",
    RIPPLE_CENTER: "ripple--center",
    RIPPLE: "ripple",
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_CHECKED: "is-checked",
    IS_UPGRADED: "is-upgraded"
  };

  Checkbox.prototype.onChange_ = function(event) {
    this.updateClasses_();
  };

  Checkbox.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  Checkbox.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  Checkbox.prototype.onMouseUp_ = function(event) {
    this.blur_();
  };

  Checkbox.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkToggleState();
  };

  Checkbox.prototype.blur_ = function() {
    window.setTimeout(
      function() {
        this.inputElement_.blur();
      }.bind(this),
      /** @type {number} */ (this.Constant_.TINY_TIMEOUT)
    );
  };

  Checkbox.prototype.checkToggleState = function() {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  Checkbox.prototype["checkToggleState"] = Checkbox.prototype.checkToggleState;

  Checkbox.prototype.checkDisabled = function() {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  Checkbox.prototype["checkDisabled"] = Checkbox.prototype.checkDisabled;

  Checkbox.prototype.disable = function() {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  Checkbox.prototype["disable"] = Checkbox.prototype.disable;

  Checkbox.prototype.enable = function() {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  Checkbox.prototype["enable"] = Checkbox.prototype.enable;

  Checkbox.prototype.check = function() {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  Checkbox.prototype["check"] = Checkbox.prototype.check;

  Checkbox.prototype.uncheck = function() {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  Checkbox.prototype["uncheck"] = Checkbox.prototype.uncheck;

  Checkbox.prototype.init = function() {
    if (this.element_) {
      this.inputElement_ = this.element_.querySelector(
        "." + this.CssClasses_.INPUT
      );

      var boxOutline = document.createElement("span");
      boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);

      var tickOutline = document.createElement("span");
      tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);

      boxOutline.appendChild(tickOutline);

      this.element_.appendChild(boxOutline);

      this.boundInputOnChange = this.onChange_.bind(this);
      this.boundInputOnFocus = this.onFocus_.bind(this);
      this.boundInputOnBlur = this.onBlur_.bind(this);
      this.boundElementMouseUp = this.onMouseUp_.bind(this);
      this.inputElement_.addEventListener("change", this.boundInputOnChange);
      this.inputElement_.addEventListener("focus", this.boundInputOnFocus);
      this.inputElement_.addEventListener("blur", this.boundInputOnBlur);
      //this.element_.addEventListener("mouseup", this.boundElementMouseUp);

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  componentHandler.register({
    constructor: Checkbox,
    classAsString: "Checkbox",
    cssClass: "js-checkbox",
    widget: true
  });
})();
