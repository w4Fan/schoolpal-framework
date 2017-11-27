(function() {
  "use strict";

  var Groups = function Groups(element) {
    this.element_ = element;
    this.init();
  };

  window["Groups"] = Groups;

  Groups.prototype.CssClasses_ = {
    ITEM: "groups-item",
    ITEM_ARROW: "groups-arrow",
    ITEM_ARROW_UP: "groups--arrowup",

    IS_TABLE: "TABLE",
    IS_SELECTED: "groups--selected",
    IS_VISIBLE: "groups--show"
  };

  Groups.prototype.init = function() {
    if (this.element_) {
      this.typo = this.element_.tagName;
      this.items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);
      this.boundItemClick_ = this.handleForClick_.bind(this);
      this.boundItemArrowClick_ = this.arrowForClick_.bind(this);

      for (var i = 0; i < this.items.length; i++) {
        var itemsArrow_ = this.items[i].querySelector(
          "." + this.CssClasses_.ITEM_ARROW
        );

        if (this.typo !== this.CssClasses_.IS_TABLE) {
          this.items[i].addEventListener("click", this.boundItemClick_);
        }

        if (itemsArrow_) {
          itemsArrow_.addEventListener("click", this.boundItemArrowClick_);
        }
      }
    }
  };

  Groups.prototype.handleForClick_ = function(evt) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i] !== evt.target) {
        this.items[i].classList.remove(this.CssClasses_.IS_SELECTED);
      }
    }

    evt.target.classList.add(this.CssClasses_.IS_SELECTED);
  };

  Groups.prototype.arrowForClick_ = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var parentNode;

    if (this.typo === this.CssClasses_.IS_TABLE) {
      parentNode = evt.target.parentNode.parentNode.parentNode;
    } else {
      parentNode = evt.target.parentNode;
    }

    this.targetChildNode_ = this.getChildNode_(parentNode);

    if (parentNode.classList.contains(this.CssClasses_.ITEM_ARROW_UP)) {
      parentNode.classList.remove(this.CssClasses_.ITEM_ARROW_UP);
      this.hideChild_();
    } else {
      parentNode.classList.add(this.CssClasses_.ITEM_ARROW_UP);
      this.showChild_();
    }
  };

  Groups.prototype.hideChild_ = function() {
    Array.prototype.map.call(this.targetChildNode_.all, item => {
      return item.classList.remove(
        this.CssClasses_.IS_VISIBLE,
        this.CssClasses_.ITEM_ARROW_UP
      );
    });
  };

  Groups.prototype.showChild_ = function() {
    Array.prototype.map.call(this.targetChildNode_.children, item => {
      return item.classList.add(this.CssClasses_.IS_VISIBLE);
    });
  };

  Groups.prototype.getChildNode_ = function(target_) {
    var level = parseInt(target_.getAttribute("level"));
    var nextNode = this.getNextNode(target_);
    var all = [];
    var children = [];

    while (
      nextNode != null &&
      parseInt(nextNode.getAttribute("level")) !== level
    ) {
      all.push(nextNode);
      nextNode = this.getNextNode(nextNode);
    }

    children = Array.prototype.filter.call(all, function(item) {
      return parseInt(item.getAttribute("level")) === level + 1;
    });

    return { all, children };
  };

  Groups.prototype.getNextNode = function(node) {
    var next = node.nextElementSibling;

    if (next !== null && next.nodeType === 3) {
      return next.nextElementSibling;
    }
    return next;
  };

  componentHandler.register({
    constructor: Groups,
    classAsString: "Groups",
    cssClass: "js-groups",
    widget: true
  });
})();
