(function() {
  "use strict";

  var Menu = function Menu(element) {
    this.element_ = element;
    this.init();
  };

  window["Menu"] = Menu;

  Menu.prototype.Constant_ = {
    TRANSITION_DURATION_SECONDS: 0.3,
    TRANSITION_DURATION_FRACTION: 0.8,
    CLOSE_TIMEOUT: 150
  };

  Menu.prototype.CssClasses_ = {
    CONTAINER: "menu__container",
    OUTLINE: "menu__outline",
    ITEM: "menu__item",
    ITEM_RIPPLE_CONTAINER: "menu__item-ripple-container",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE: "ripple",
    IS_UPGRADED: "is-upgraded",
    IS_VISIBLE: "is-visible",
    IS_ANIMATING: "is-animating",
    BOTTOM_LEFT: "menu--bottom-left",
    BOTTOM_RIGHT: "menu--bottom-right",
    TOP_LEFT: "menu--top-left",
    TOP_RIGHT: "menu--top-right",
    UNALIGNED: "menu--unaligned"
  };

  Menu.prototype.init = function() {
    if (this.element_) {
      var container = document.createElement("div");
      var outline = document.createElement("div");

      container.classList.add(this.CssClasses_.CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      this.container_ = container;

      outline.classList.add(this.CssClasses_.OUTLINE);
      this.outline_ = outline;
      container.insertBefore(outline, this.element_);

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

      var items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);

      this.boundItemClick_ = this.handleItemClick_.bind(this);

      for (var i = 0; i < items.length; i++) {
        items[i].addEventListener("click", this.boundItemClick_);
        items[i].tabIndex = "-1";
      }

      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

        for (i = 0; i < items.length; i++) {
          var item = items[i];
          var rippleContainer = document.createElement("span");
          var ripple = document.createElement("span");

          rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
          ripple.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);
          item.appendChild(rippleContainer);
          item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        }
      }

      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        this.outline_.classList.add(this.CssClasses_.UNALIGNED);
      }

      container.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  Menu.prototype.handleForClick_ = function(evt) {
    if (this.element_ && this.forElement_) {
      var rect = this.forElement_.getBoundingClientRect();
      var forRect = this.forElement_.parentElement.getBoundingClientRect();

      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      } else if (
        this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)
      ) {
        this.container_.style.right = forRect.right - rect.right + "px";
        this.container_.style.top =
          this.forElement_.offsetTop + this.forElement_.offsetHeight + "px";
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.container_.style.left = this.forElement_.offsetLeft + "px";
        this.container_.style.bottom = forRect.bottom - rect.top + "px";
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.container_.style.right = forRect.right - rect.right + "px";
        this.container_.style.bottom = forRect.bottom - rect.top + "px";
      } else {
        this.container_.style.left = this.forElement_.offsetLeft + "px";
        this.container_.style.top =
          this.forElement_.offsetTop + this.forElement_.offsetHeight + "px";
      }
    }

    this.toggle(evt);
  };

  Menu.prototype.handleItemClick_ = function(evt) {
    this.closing_ = true;
    window.setTimeout(
      function(evt) {
        this.hide();
        this.closing_ = false;
      }.bind(this),
      this.Constant_.CLOSE_TIMEOUT
    );
  };

  Menu.prototype.applyClip_ = function(height, width) {
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      this.element_.style.clip = "";
    } else if (
      this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)
    ) {
      this.element_.style.clip =
        "rect(0 " + width + "px " + "0 " + width + "px)";
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
      this.element_.style.clip = "rect(" + height + "px 0 " + height + "px 0)";
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
      this.element_.style.clip =
        "rect(" +
        height +
        "px " +
        width +
        "px " +
        height +
        "px " +
        width +
        "px)";
    } else {
      this.element_.style.clip = "";
    }
  };

  Menu.prototype.removeAnimationEndListener_ = function(evt) {
    evt.target.classList.remove(Menu.prototype.CssClasses_.IS_ANIMATING);
  };

  Menu.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Menu.prototype.show = function(evt) {
    if (this.element_ && this.container_ && this.outline_) {
      var height = this.element_.getBoundingClientRect().height;
      var width = this.element_.getBoundingClientRect().width;

      this.container_.style.width = width + "px";
      this.container_.style.height = height + "px";
      this.outline_.style.width = width + "px";
      this.outline_.style.height = height + "px";

      var transitionDuration =
        this.Constant_.TRANSITION_DURATION_SECONDS *
        this.Constant_.TRANSITION_DURATION_FRACTION;
      var items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);

      for (var i = 0; i < items.length; i++) {
        var itemDelay = null;

        if (
          this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ||
          this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)
        ) {
          itemDelay =
            (height - items[i].offsetTop - items[i].offsetHeight) /
              height *
              transitionDuration +
            "s";
        } else {
          itemDelay = items[i].offsetTop / height * transitionDuration + "s";
        }

        items[i].style.transitionDelay = itemDelay;
      }

      this.applyClip_(height, width);

      window.requestAnimationFrame(
        function() {
          this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
          this.element_.style.clip =
            "rect(0 " + width + "px " + height + "px 0)";
          this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this)
      );

      this.addAnimationEndListener_();

      var callback = function(e) {
        if (
          e !== evt &&
          !this.closing_ &&
          e.target.parentNode !== this.element_
        ) {
          document.removeEventListener("click", callback);
          this.hide();
        }
      }.bind(this);

      document.addEventListener("click", callback);
    }
  };

  Menu.prototype.hide = function(evt) {
    if (this.element_ && this.container_ && this.outline_) {
      var items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);

      for (var i = 0; i < items.length; i++) {
        items[i].style.removeProperty("transition-delay");
      }

      var rect = this.element_.getBoundingClientRect();
      var height = rect.height;
      var width = rect.width;

      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.applyClip_(height, width);
      this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);
      this.addAnimationEndListener_();
    }
  };

  Menu.prototype.toggle = function(evt) {
    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };

  Menu.prototype["toggle"] = Menu.prototype.toggle;
  
  componentHandler.register({
    constructor: Menu,
    classAsString: 'Menu',
    cssClass: 'js-menu',
    widget: true
  });
})();
