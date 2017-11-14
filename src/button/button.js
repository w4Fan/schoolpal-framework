(function() {
  "use strict";

  var Button = function Button(element) {
    this.element_ = element;
    this.init();
  };

  window["Button"] = Button;

  Button.prototype.CssClasses_ = {
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_CONTAINER: "button__ripple-container",
    RIPPLE: "ripple"
  };

  Button.prototype.blurHandler_ = function(event) {
    if (event) {
      this.element_.blur();
    }
  };

  Button.prototype.disable = function() {
    this.element_.disabled = true;
  };

  Button.prototype["disable"] = Button.prototype.disable;

  Button.prototype.enable = function() {
    this.element_.disabled = false;
  };
  Button.prototype["enable"] = Button.prototype.enable;

  Button.prototype.init = function() {
    if (this.element_) {
      this.boundButtonBlurHandler = this.blurHandler_.bind(this);
      this.element_.addEventListener("mouseup", this.boundButtonBlurHandler);
      this.element_.addEventListener("mouseleave", this.boundButtonBlurHandler);
    }
  };

  componentHandler.register({
    constructor: Button,
    classAsString: "Button",
    cssClass: "js-button",
    widget: true
  });
})();
