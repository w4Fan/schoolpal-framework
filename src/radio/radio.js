(function() {
  "use strict";

  var Radio = function Radio(element) {
    this.element_ = element;
    this.init();
  };
  window["Radio"] = Radio;
  Radio.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001
  };
  Radio.prototype.CssClasses_ = {
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_CHECKED: "is-checked",
    IS_UPGRADED: "is-upgraded",
    JS_RADIO: "js-radio",
    RADIO_BTN: "radio__button",
    RADIO_OUTER_CIRCLE: "radio__outer-circle",
    RADIO_INNER_CIRCLE: "radio__inner-circle",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE_CONTAINER: "radio__ripple-container",
    RIPPLE_CENTER: "ripple--center",
    RIPPLE: "ripple"
  };
  Radio.prototype.onChange_ = function(event) {
    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);

    for (var i = 0; i < radios.length; i++) {
      var button = radios[i].querySelector("." + this.CssClasses_.RADIO_BTN);

      if (
        button.getAttribute("name") === this.btnElement_.getAttribute("name")
      ) {
        if (typeof radios[i]["Radio"] !== "undefined") {
          radios[i]["Radio"].updateClasses_();
        }
      }
    }
  };
  Radio.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };
  Radio.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };
  Radio.prototype.onMouseup_ = function(event) {
    this.blur_();
  };
  Radio.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkToggleState();
  };
  Radio.prototype.blur_ = function() {
    window.setTimeout(
      function() {
        this.btnElement_.blur();
      }.bind(this),
      this.Constant_.TINY_TIMEOUT
    );
  };
  Radio.prototype.checkDisabled = function() {
    if (this.btnElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  Radio.prototype["checkDisabled"] = Radio.prototype.checkDisabled;

  Radio.prototype.checkToggleState = function() {
    if (this.btnElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  Radio.prototype["checkToggleState"] = Radio.prototype.checkToggleState;

  Radio.prototype.disable = function() {
    this.btnElement_.disabled = true;
    this.updateClasses_();
  };
  Radio.prototype["disable"] = Radio.prototype.disable;

  Radio.prototype.enable = function() {
    this.btnElement_.disabled = false;
    this.updateClasses_();
  };
  Radio.prototype["enable"] = Radio.prototype.enable;

  Radio.prototype.check = function() {
    this.btnElement_.checked = true;
    this.onChange_(null);
  };
  Radio.prototype["check"] = Radio.prototype.check;

  Radio.prototype.uncheck = function() {
    this.btnElement_.checked = false;
    this.onChange_(null);
  };
  Radio.prototype["uncheck"] = Radio.prototype.uncheck;

  Radio.prototype.init = function() {
    if (this.element_) {
      this.btnElement_ = this.element_.querySelector(
        "." + this.CssClasses_.RADIO_BTN
      );

      this.boundChangeHandler_ = this.onChange_.bind(this);
      this.boundFocusHandler_ = this.onChange_.bind(this);
      this.boundBlurHandler_ = this.onBlur_.bind(this);
      this.boundMouseUpHandler_ = this.onMouseup_.bind(this);

      var outerCircle = document.createElement("span");
      outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);

      var innerCircle = document.createElement("span");
      innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);

      this.element_.appendChild(outerCircle);
      this.element_.appendChild(innerCircle);

      this.btnElement_.addEventListener("change", this.boundChangeHandler_);
      this.btnElement_.addEventListener("focus", this.boundFocusHandler_);
      this.btnElement_.addEventListener("blur", this.boundBlurHandler_);
      this.element_.addEventListener("mouseup", this.boundMouseUpHandler_);

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  componentHandler.register({
    constructor: Radio,
    classAsString: "Radio",
    cssClass: "js-radio",
    widget: true
  });
})();
