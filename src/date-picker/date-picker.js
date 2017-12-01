(function() {
  "use strict";

  var DatePicker = function DatePicker(element) {
    this.element_ = element;
    this.init();
  };
  window["DatePicker"] = DatePicker;

  DatePicker.prototype.Constant_ = {
    DAYS: ["日", "一", "二", "三", "四", "五", "六"],
    MONTHS: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    MIN_YEAR: 2000
  };

  DatePicker.prototype.CssClasses_ = {
    HEADER_CONTAINER: "date-picker__header",
    MONTH_CONTAINER: "date-picker__calendar--month",
    YEAR_CONTAINER: "date-picker__calendar--year",
    YEAR_ITEMS: "year-items",
    IS_SELECTED: "is-selected",
  };

  DatePicker.prototype.formatDate_ = function(date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  };

  DatePicker.prototype.getDate_ = function(date, type) {
    var d = new Date();

    if (date) {
      if (typeof date === "string") {
        return new Date(date);
      }

      if (type === "next") {
        return d.setDate(date.getDate() + 1);
      }

      if (type === "prev") {
        return d.setDate(date.getDate() - 1);
      }
    }

    return new Date();
  };

  DatePicker.prototype.getDaysHtml_ = function(date) {
    var total = this.getDaysCount_(date);
    var first = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var last = new Date(date.getFullYear(), date.getMonth(), total).getDay();
    var maxRow =
      Math.ceil((total + first) / 7) < 6 ? 6 : Math.ceil((total + first) / 7);
    var html = [];

    html.push(
      `<div class="month-row">${date.getFullYear()}-${
        this.Constant_.MONTHS[date.getMonth()]
      }</div>`
    );
    html.push(`<div class="month-row">`);

    for (var i = 0; i < this.Constant_.DAYS.length; i++) {
      html.push(
        `<div class="month-col"><span>${this.Constant_.DAYS[i]}</span></div>`
      );
    }

    html.push(`</div>`);

    for (var i = 0; i < maxRow; i++) {
      html.push(`<div class="month-row">`);
      for (var j = i * 7 - first; j < i * 7 + 7 - first; j++) {
        if (!(j > total - 1)) {
          if (j < 0) {
            html.push(`<div class="month-col"></div>`);
          } else {
            var temp = new Date(date).setDate(j + 1);

            html.push(
              `<div class="month-col" date="${date.getFullYear()}-${
                this.Constant_.MONTHS[date.getMonth()]
              }-${j + 1}"><span class="${
                this.formatDate_(new Date(temp)).join("") ==
                this.formatDate_(this.curDate_).join("")
                  ? this.CssClasses_.IS_SELECTED
                  : ""
              }">${j + 1}</span></div>`
            );
          }
        } else {
          html.push(`<div class="month-col"></div>`);
        }
      }
      html.push(`</div>`);
    }

    return html.join("");
  };

  DatePicker.prototype.getDaysCount_ = function(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  DatePicker.prototype.render_ = function(date) {
    var prevDate = new Date(date).setMonth(date.getMonth() - 1);
    var nextDate = new Date(date).setMonth(date.getMonth() + 1);

    this.monthContainer.innerHTML = this.getDaysHtml_(date);
    this.prevBtn_.setAttribute(
      "prev",
      this.formatDate_(new Date(prevDate)).join("-")
    );
    this.nextBtn_.setAttribute(
      "next",
      this.formatDate_(new Date(nextDate)).join("-")
    );
  };

  DatePicker.prototype.renderHeader_ = function(date) {
    var yy = date.getFullYear();
    var mm = date.getMonth();
    var dd = date.getDate();
    var day = date.getDay();
    var html = `
      <div class="date-picker__header__text__secondary">${yy}</div>
      <div class="date-picker__header__text ${this.CssClasses_.IS_SELECTED}">
        <span>周${this.Constant_.DAYS[day]}，</span>
        <span>${this.Constant_.MONTHS[mm]}-${dd}</span>
      </div>
    `;

    this.element_.querySelector(
      "." + this.CssClasses_.HEADER_CONTAINER
    ).innerHTML = html;

    var showYearBtn = this.element_.querySelector(
      ".date-picker__header__text__secondary"
    );
    var showMonthBtn = this.element_.querySelector(
      ".date-picker__header__text"
    );

    showYearBtn.addEventListener("click", () => {
      if (!showYearBtn.classList.contains(this.CssClasses_.IS_SELECTED)) {
        showYearBtn.classList.add(this.CssClasses_.IS_SELECTED);
        showMonthBtn.classList.remove(this.CssClasses_.IS_SELECTED);

        this.yearContainer.parentElement.style.display = "";
        this.monthContainer.parentElement.style.display = "none";

        this.yearContainer.scrollTop =
          this.yearContainer.querySelector("." + this.CssClasses_.IS_SELECTED)
            .offsetTop - 88;
      }
    });

    showMonthBtn.addEventListener("click", () => {
      if (!showMonthBtn.classList.contains(this.CssClasses_.IS_SELECTED)) {
        showMonthBtn.classList.add(this.CssClasses_.IS_SELECTED);
        showYearBtn.classList.remove(this.CssClasses_.IS_SELECTED);

        this.monthContainer.parentElement.style.display = "";
        this.yearContainer.parentElement.style.display = "none";
      }
    });
  };

  DatePicker.prototype.renderYear_ = function(date) {
    var max = date.getFullYear() + 10;
    var html = [];

    for (var i = this.Constant_.MIN_YEAR; i < max; i++) {
      html.push(
        `<div class="year-items ${
          date.getFullYear() === i ? "is-selected" : ""
        }">${i}</div>`
      );
    }

    this.yearContainer.innerHTML = html.join("");
    var items = this.yearContainer.querySelectorAll(
      "." + this.CssClasses_.YEAR_ITEMS
    );

    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", this.changeYear_.bind(this));
    }
  };

  DatePicker.prototype.changeYear_ = function(evt) {
    if (!evt.target.classList.contains(this.CssClasses_.IS_SELECTED)) {
      var temp = this.formatDate_(this.curDate_);

      evt.target.classList.add(this.CssClasses_.IS_SELECTED);
      Array.prototype.filter.call(evt.target.parentNode.children, child => {
        if (child !== evt.target) {
          return child.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      });

      temp[0] = evt.target.textContent;
      this.curDate_ = this.getDate_(temp.join("-"));
      this.render_(this.curDate_);
      this.renderHeader_(this.curDate_);

      this.monthContainer.parentElement.style.display = "";
      this.yearContainer.parentElement.style.display = "none";
    }
  };

  DatePicker.prototype.changeDate_ = function(elem) {
    this.curDate_ = this.getDate_(elem.getAttribute("date"));
    this.render_(this.curDate_);
    this.renderHeader_(this.curDate_);
    this.renderYear_(this.curDate_);
  };

  DatePicker.prototype.dateForClick_ = function(evt) {
    var items = this.element_.querySelectorAll("[date]");

    for (var i = 0; i < items.length; i++) {
      var el = evt.target;

      while (el && el !== this.element_) {
        if (el === items[i]) {
          this.changeDate_(items[i]);
        }

        el = el.parentNode;
      }
    }
  };

  DatePicker.prototype.prevForClick_ = function(evt) {
    var elem = evt.target;

    if (evt.target.tagName === "I") {
      elem = evt.target.parentElement;
    }

    this.render_(new Date(elem.getAttribute("prev")));
  };

  DatePicker.prototype.nextForClick_ = function(evt) {
    var elem = evt.target;

    if (evt.target.tagName === "I") {
      elem = evt.target.parentElement;
    }

    this.render_(new Date(elem.getAttribute("next")));
  };

  DatePicker.prototype.setDate = function() {};
  DatePicker.prototype["setDate"] = DatePicker.prototype.setDate;

  DatePicker.prototype.getDate = function() {
    return this.formatDate_(this.curDate_).join("-");
  };
  DatePicker.prototype["getDate"] = DatePicker.prototype.getDate;

  DatePicker.prototype.init = function() {
    var forElId =
        this.element_.getAttribute("for") ||
        this.element_.getAttribute("data-for");
    var forEl = null;

    if (forElId) {
      forEl = document.getElementById(forElId);
      if (forEl) {
        this.forElement_ = forEl;
      }
    }

    this.header_ = this.element_.querySelector(
      this.CssClasses_.HEADER_CONTAINER
    );
    this.monthContainer = this.element_.querySelector(
      "." + this.CssClasses_.MONTH_CONTAINER
    );
    this.yearContainer = this.element_.querySelector(
      "." + this.CssClasses_.YEAR_CONTAINER
    );

    this.nextBtn_ = this.element_.querySelector("[next]");
    this.prevBtn_ = this.element_.querySelector("[prev]");

    this.today_ = this.getDate_();
    this.curDate_ = this.forElement_.querySelector("input").value
      ? this.getDate_(this.forElement_.querySelector("input").value)
      : this.today_;

    this.render_(this.curDate_);
    this.renderHeader_(this.curDate_);
    this.renderYear_(this.curDate_);

    this.element_.addEventListener("click", this.dateForClick_.bind(this));
    this.prevBtn_.addEventListener("click", this.prevForClick_.bind(this));
    this.nextBtn_.addEventListener("click", this.nextForClick_.bind(this));
  };

  componentHandler.register({
    constructor: DatePicker,
    classAsString: "DatePicker",
    cssClass: "js-date-picker",
    widget: true
  });
})();
