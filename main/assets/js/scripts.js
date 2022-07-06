// Utility function
function Util () {};

/* class manipulation functions */
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* DOM manipulation */
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length;

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* Animate height of an element */
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* Smooth Scroll */
Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* Move Focus */
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* Misc */

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  return CSS.supports(property, value);
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* Animation curves */
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function () {
  var menuBtns = document.getElementsByClassName("js-anim-menu-btn");
  if (menuBtns.length > 0) {
    for (var i = 0; i < menuBtns.length; i++) {
      (function (i) {
        initMenuBtn(menuBtns[i]);
      })(i);
    }

    function initMenuBtn(btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        var status = !Util.hasClass(btn, "anim-menu-btn--state-b");
        Util.toggleClass(btn, "anim-menu-btn--state-b", status);
        // emit custom event
        var event = new CustomEvent("anim-menu-btn-clicked", {
          detail: status,
        });
        btn.dispatchEvent(event);
      });
    }
  }
})();

// File#: _1_collapse
// Usage: codyhouse.co/license
(function () {
  var Collapse = function (element) {
    this.element = element;
    this.triggers = document.querySelectorAll(
      '[aria-controls="' + this.element.getAttribute("id") + '"]'
    );
    this.animate = this.element.getAttribute("data-collapse-animate") == "on";
    this.animating = false;
    initCollapse(this);
  };

  function initCollapse(element) {
    if (element.triggers) {
      // set initial 'aria-expanded' attribute for trigger elements
      updateTriggers(element, !Util.hasClass(element.element, "is-hidden"));

      // detect click on trigger elements
      for (var i = 0; i < element.triggers.length; i++) {
        element.triggers[i].addEventListener("click", function (event) {
          event.preventDefault();
          toggleVisibility(element);
        });
      }
    }

    // custom event
    element.element.addEventListener("collapseToggle", function (event) {
      toggleVisibility(element);
    });
  }

  function toggleVisibility(element) {
    var bool = Util.hasClass(element.element, "is-hidden");
    if (element.animating) return;
    element.animating = true;
    animateElement(element, bool);
    updateTriggers(element, bool);
  }

  function animateElement(element, bool) {
    // bool === true -> show content
    if (!element.animate || !window.requestAnimationFrame) {
      Util.toggleClass(element.element, "is-hidden", !bool);
      element.animating = false;
      return;
    }

    // animate content height
    Util.removeClass(element.element, "is-hidden");
    var initHeight = !bool ? element.element.offsetHeight : 0,
      finalHeight = !bool ? 0 : element.element.offsetHeight;

    Util.addClass(element.element, "overflow-hidden");

    Util.setHeight(
      initHeight,
      finalHeight,
      element.element,
      200,
      function () {
        if (!bool) Util.addClass(element.element, "is-hidden");
        element.element.removeAttribute("style");
        Util.removeClass(element.element, "overflow-hidden");
        element.animating = false;
      },
      "easeInOutQuad"
    );
  }

  function updateTriggers(element, bool) {
    for (var i = 0; i < element.triggers.length; i++) {
      bool
        ? element.triggers[i].setAttribute("aria-expanded", "true")
        : element.triggers[i].removeAttribute("aria-expanded");
    }
  }

  window.Collapse = Collapse;

  //initialize the Collapse objects
  var collapses = document.getElementsByClassName("js-collapse");
  if (collapses.length > 0) {
    for (var i = 0; i < collapses.length; i++) {
      new Collapse(collapses[i]);
    }
  }
})();

// File#: _1_confetti-button
// Usage: codyhouse.co/license
(function () {
  var ConfettiBtn = function (element) {
    this.element = element;
    this.btn = this.element.getElementsByClassName("js-confetti-btn__btn");
    this.icon = this.element.getElementsByClassName("js-confetti-btn__icon");
    this.animating = false;
    this.animationClass = "confetti-btn--animate";
    this.positionVariables = "--conf-btn-click-";
    initConfettiBtn(this);
  };

  function initConfettiBtn(element) {
    if (element.btn.length < 1 || element.icon.length < 1) return;
    element.btn[0].addEventListener("click", function (event) {
      if (element.animating) return;
      element.animating = true;
      setAnimationPosition(element, event);
      Util.addClass(element.element, element.animationClass);
      resetAnimation(element);
    });
  }

  function setAnimationPosition(element, event) {
    // change icon position based on click position

    var btnBoundingRect = element.btn[0].getBoundingClientRect();
    document.documentElement.style.setProperty(
      element.positionVariables + "x",
      event.clientX - btnBoundingRect.left + "px"
    );
    document.documentElement.style.setProperty(
      element.positionVariables + "y",
      event.clientY - btnBoundingRect.top + "px"
    );
  }

  function resetAnimation(element) {
    // reset the button at the end of the icon animation

    element.icon[0].addEventListener("animationend", function cb() {
      element.icon[0].removeEventListener("animationend", cb);
      Util.removeClass(element.element, element.animationClass);
      element.animating = false;
    });
  }

  var confettiBtn = document.getElementsByClassName("js-confetti-btn");
  if (confettiBtn.length > 0) {
    for (var i = 0; i < confettiBtn.length; i++) {
      (function (i) {
        new ConfettiBtn(confettiBtn[i]);
      })(i);
    }
  }
})();

// File#: _1_drawer
// Usage: codyhouse.co/license
(function () {
  var Drawer = function (element) {
    this.element = element;
    this.content = document.getElementsByClassName("js-drawer__body")[0];
    this.triggers = document.querySelectorAll(
      '[aria-controls="' + this.element.getAttribute("id") + '"]'
    );
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.isModal = Util.hasClass(this.element, "js-drawer--modal");
    this.showClass = "drawer--is-visible";
    this.preventScrollEl = this.getPreventScrollEl();
    this.initDrawer();
  };

  Drawer.prototype.getPreventScrollEl = function () {
    var scrollEl = false;
    var querySelector = this.element.getAttribute("data-drawer-prevent-scroll");
    if (querySelector) scrollEl = document.querySelector(querySelector);
    return scrollEl;
  };

  Drawer.prototype.initDrawer = function () {
    var self = this;
    //open drawer when clicking on trigger buttons
    if (this.triggers) {
      for (var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener("click", function (event) {
          event.preventDefault();
          if (Util.hasClass(self.element, self.showClass)) {
            self.closeDrawer(event.target);
            return;
          }
          self.selectedTrigger = event.target;
          self.showDrawer();
          self.initDrawerEvents();
        });
      }
    }

    // if drawer is already open -> we should initialize the drawer events
    if (Util.hasClass(this.element, this.showClass)) this.initDrawerEvents();
  };

  Drawer.prototype.showDrawer = function () {
    var self = this;
    this.content.scrollTop = 0;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    Util.moveFocus(this.element);
    // wait for the end of transitions before moving focus
    this.element.addEventListener("transitionend", function cb(event) {
      Util.moveFocus(self.element);
      self.element.removeEventListener("transitionend", cb);
    });
    this.emitDrawerEvents("drawerIsOpen", this.selectedTrigger);
    // change the overflow of the preventScrollEl
    if (this.preventScrollEl) this.preventScrollEl.style.overflow = "hidden";
  };

  Drawer.prototype.closeDrawer = function (target) {
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    if (this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelDrawerEvents();
    this.emitDrawerEvents("drawerIsClose", target);
    // change the overflow of the preventScrollEl
    if (this.preventScrollEl) this.preventScrollEl.style.overflow = "";
  };

  Drawer.prototype.initDrawerEvents = function () {
    //add event listeners
    this.element.addEventListener("keydown", this);
    this.element.addEventListener("click", this);
  };

  Drawer.prototype.cancelDrawerEvents = function () {
    //remove event listeners
    this.element.removeEventListener("keydown", this);
    this.element.removeEventListener("click", this);
  };

  Drawer.prototype.handleEvent = function (event) {
    switch (event.type) {
      case "click": {
        this.initClick(event);
      }
      case "keydown": {
        this.initKeyDown(event);
      }
    }
  };

  Drawer.prototype.initKeyDown = function (event) {
    if (
      (event.keyCode && event.keyCode == 27) ||
      (event.key && event.key == "Escape")
    ) {
      //close drawer window on esc
      this.closeDrawer(false);
    } else if (
      this.isModal &&
      ((event.keyCode && event.keyCode == 9) ||
        (event.key && event.key == "Tab"))
    ) {
      //trap focus inside drawer
      this.trapFocus(event);
    }
  };

  Drawer.prototype.initClick = function (event) {
    //close drawer when clicking on close button or drawer bg layer
    if (
      !event.target.closest(".js-drawer__close") &&
      !Util.hasClass(event.target, "js-drawer")
    )
      return;
    event.preventDefault();
    this.closeDrawer(event.target);
  };

  Drawer.prototype.trapFocus = function (event) {
    if (this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of drawer
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if (this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of drawer
      event.preventDefault();
      this.firstFocusable.focus();
    }
  };

  Drawer.prototype.getFocusableElements = function () {
    //get all focusable elements inside the drawer
    var allFocusable = this.element.querySelectorAll(
      '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'
    );
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
  };

  Drawer.prototype.getFirstVisible = function (elements) {
    //get first visible focusable element inside the drawer
    for (var i = 0; i < elements.length; i++) {
      if (
        elements[i].offsetWidth ||
        elements[i].offsetHeight ||
        elements[i].getClientRects().length
      ) {
        this.firstFocusable = elements[i];
        return true;
      }
    }
  };

  Drawer.prototype.getLastVisible = function (elements) {
    //get last visible focusable element inside the drawer
    for (var i = elements.length - 1; i >= 0; i--) {
      if (
        elements[i].offsetWidth ||
        elements[i].offsetHeight ||
        elements[i].getClientRects().length
      ) {
        this.lastFocusable = elements[i];
        return true;
      }
    }
  };

  Drawer.prototype.emitDrawerEvents = function (eventName, target) {
    var event = new CustomEvent(eventName, { detail: target });
    this.element.dispatchEvent(event);
  };

  window.Drawer = Drawer;

  //initialize the Drawer objects
  var drawer = document.getElementsByClassName("js-drawer");
  if (drawer.length > 0) {
    for (var i = 0; i < drawer.length; i++) {
      (function (i) {
        new Drawer(drawer[i]);
      })(i);
    }
  }
})();

// File#: _1_main-header
// Usage: codyhouse.co/license
(function () {
  var mainHeader = document.getElementsByClassName("js-header");
  if (mainHeader.length > 0) {
    var trigger = mainHeader[0].getElementsByClassName("js-header__trigger")[0],
      nav = mainHeader[0].getElementsByClassName("js-header__nav")[0];

    // we'll use these to store the node that needs to receive focus when the mobile menu is closed
    var focusMenu = false;

    //detect click on nav trigger
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      toggleNavigation(!Util.hasClass(nav, "header__nav--is-visible"));
    });

    // listen for key events
    window.addEventListener("keyup", function (event) {
      // listen for esc key
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        // close navigation on mobile if open
        if (
          trigger.getAttribute("aria-expanded") == "true" &&
          isVisible(trigger)
        ) {
          focusMenu = trigger; // move focus to menu trigger when menu is close
          trigger.click();
        }
      }
      // listen for tab key
      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key.toLowerCase() == "tab")
      ) {
        // close navigation on mobile if open when nav loses focus
        if (
          trigger.getAttribute("aria-expanded") == "true" &&
          isVisible(trigger) &&
          !document.activeElement.closest(".js-header")
        )
          trigger.click();
      }
    });

    // listen for resize
    var resizingId = false;
    window.addEventListener("resize", function () {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
      if (
        !isVisible(trigger) &&
        Util.hasClass(mainHeader[0], "header--expanded")
      )
        toggleNavigation(false);
    }
  }

  function isVisible(element) {
    return (
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  function toggleNavigation(bool) {
    // toggle navigation visibility on small device
    Util.toggleClass(nav, "header__nav--is-visible", bool);
    Util.toggleClass(mainHeader[0], "header--expanded", bool);
    trigger.setAttribute("aria-expanded", bool);
    if (bool) {
      //opening menu -> move focus to first element inside nav
      nav
        .querySelectorAll(
          "[href], input:not([disabled]), button:not([disabled])"
        )[0]
        .focus();
    } else if (focusMenu) {
      focusMenu.focus();
      focusMenu = false;
    }
  }
})();

// File#: _1_social-sharing
// Usage: codyhouse.co/license
(function () {
  function initSocialShare(button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var social = button.getAttribute("data-social");
      var url = getSocialUrl(button, social);
      social == "mail"
        ? (window.location.href = url)
        : window.open(url, social + "-share-dialog", "width=626,height=436");
    });
  }

  function getSocialUrl(button, social) {
    var params = getSocialParams(social);
    var newUrl = "";
    for (var i = 0; i < params.length; i++) {
      var paramValue = button.getAttribute("data-" + params[i]);
      if (params[i] == "hashtags")
        paramValue = encodeURI(paramValue.replace(/\#| /g, ""));
      if (paramValue) {
        social == "facebook"
          ? (newUrl = newUrl + "u=" + encodeURIComponent(paramValue) + "&")
          : (newUrl =
              newUrl + params[i] + "=" + encodeURIComponent(paramValue) + "&");
      }
    }
    if (social == "linkedin") newUrl = "mini=true&" + newUrl;
    return button.getAttribute("href") + "?" + newUrl;
  }

  function getSocialParams(social) {
    var params = [];
    switch (social) {
      case "twitter":
        params = ["text", "hashtags"];
        break;
      case "facebook":
      case "linkedin":
        params = ["url"];
        break;
      case "pinterest":
        params = ["url", "media", "description"];
        break;
      case "mail":
        params = ["subject", "body"];
        break;
    }
    return params;
  }

  var socialShare = document.getElementsByClassName("js-social-share");
  if (socialShare.length > 0) {
    for (var i = 0; i < socialShare.length; i++) {
      (function (i) {
        initSocialShare(socialShare[i]);
      })(i);
    }
  }
})();

// File#: _1_tabs
// Usage: codyhouse.co/license
(function () {
  var Tab = function (element) {
    this.element = element;
    this.tabList = this.element.getElementsByClassName("js-tabs__controls")[0];
    this.listItems = this.tabList.getElementsByTagName("li");
    this.triggers = this.tabList.getElementsByTagName("a");
    this.panelsList = this.element.getElementsByClassName("js-tabs__panels")[0];
    this.panels = Util.getChildrenByClassName(
      this.panelsList,
      "js-tabs__panel"
    );
    this.hideClass = "is-hidden";
    this.customShowClass = this.element.getAttribute("data-show-panel-class")
      ? this.element.getAttribute("data-show-panel-class")
      : false;
    this.layout = this.element.getAttribute("data-tabs-layout")
      ? this.element.getAttribute("data-tabs-layout")
      : "horizontal";
    // deep linking options
    this.deepLinkOn = this.element.getAttribute("data-deep-link") == "on";
    // init tabs
    this.initTab();
  };

  Tab.prototype.initTab = function () {
    //set initial aria attributes
    this.tabList.setAttribute("role", "tablist");
    for (var i = 0; i < this.triggers.length; i++) {
      var bool = i == 0,
        panelId = this.panels[i].getAttribute("id");
      this.listItems[i].setAttribute("role", "presentation");
      Util.setAttributes(this.triggers[i], {
        role: "tab",
        "aria-selected": bool,
        "aria-controls": panelId,
        id: "tab-" + panelId,
      });
      Util.addClass(this.triggers[i], "js-tabs__trigger");
      Util.setAttributes(this.panels[i], {
        role: "tabpanel",
        "aria-labelledby": "tab-" + panelId,
      });
      Util.toggleClass(this.panels[i], this.hideClass, !bool);

      if (!bool) this.triggers[i].setAttribute("tabindex", "-1");
    }

    //listen for Tab events
    this.initTabEvents();

    // check deep linking option
    this.initDeepLink();
  };

  Tab.prototype.initTabEvents = function () {
    var self = this;
    //click on a new tab -> select content
    this.tabList.addEventListener("click", function (event) {
      if (event.target.closest(".js-tabs__trigger"))
        self.triggerTab(event.target.closest(".js-tabs__trigger"), event);
    });
    //arrow keys to navigate through tabs
    this.tabList.addEventListener("keydown", function (event) {
      if (!event.target.closest(".js-tabs__trigger")) return;
      if (tabNavigateNext(event, self.layout)) {
        event.preventDefault();
        self.selectNewTab("next");
      } else if (tabNavigatePrev(event, self.layout)) {
        event.preventDefault();
        self.selectNewTab("prev");
      }
    });
  };

  Tab.prototype.selectNewTab = function (direction) {
    var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
      index = Util.getIndexInArray(this.triggers, selectedTab);
    index = direction == "next" ? index + 1 : index - 1;
    //make sure index is in the correct interval
    //-> from last element go to first using the right arrow, from first element go to last using the left arrow
    if (index < 0) index = this.listItems.length - 1;
    if (index >= this.listItems.length) index = 0;
    this.triggerTab(this.triggers[index]);
    this.triggers[index].focus();
  };

  Tab.prototype.triggerTab = function (tabTrigger, event) {
    var self = this;
    event && event.preventDefault();
    var index = Util.getIndexInArray(this.triggers, tabTrigger);
    //no need to do anything if tab was already selected
    if (this.triggers[index].getAttribute("aria-selected") == "true") return;

    for (var i = 0; i < this.triggers.length; i++) {
      var bool = i == index;
      Util.toggleClass(this.panels[i], this.hideClass, !bool);
      if (this.customShowClass)
        Util.toggleClass(this.panels[i], this.customShowClass, bool);
      this.triggers[i].setAttribute("aria-selected", bool);
      bool
        ? this.triggers[i].setAttribute("tabindex", "0")
        : this.triggers[i].setAttribute("tabindex", "-1");
    }

    // update url if deepLink is on
    if (this.deepLinkOn) {
      history.replaceState(
        null,
        "",
        "#" + tabTrigger.getAttribute("aria-controls")
      );
    }
  };

  Tab.prototype.initDeepLink = function () {
    if (!this.deepLinkOn) return;
    var hash = window.location.hash.substr(1);
    var self = this;
    if (!hash || hash == "") return;
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i].getAttribute("id") == hash) {
        this.triggerTab(this.triggers[i], false);
        setTimeout(function () {
          self.panels[i].scrollIntoView(true);
        });
        break;
      }
    }
  };

  function tabNavigateNext(event, layout) {
    if (
      layout == "horizontal" &&
      ((event.keyCode && event.keyCode == 39) ||
        (event.key && event.key == "ArrowRight"))
    ) {
      return true;
    } else if (
      layout == "vertical" &&
      ((event.keyCode && event.keyCode == 40) ||
        (event.key && event.key == "ArrowDown"))
    ) {
      return true;
    } else {
      return false;
    }
  }

  function tabNavigatePrev(event, layout) {
    if (
      layout == "horizontal" &&
      ((event.keyCode && event.keyCode == 37) ||
        (event.key && event.key == "ArrowLeft"))
    ) {
      return true;
    } else if (
      layout == "vertical" &&
      ((event.keyCode && event.keyCode == 38) ||
        (event.key && event.key == "ArrowUp"))
    ) {
      return true;
    } else {
      return false;
    }
  }

  window.Tab = Tab;

  //initialize the Tab objects
  var tabs = document.getElementsByClassName("js-tabs");
  if (tabs.length > 0) {
    for (var i = 0; i < tabs.length; i++) {
      (function (i) {
        new Tab(tabs[i]);
      })(i);
    }
  }
})();

// File#: _1_tooltip
// Usage: codyhouse.co/license
(function () {
  var Tooltip = function (element) {
    this.element = element;
    this.tooltip = false;
    this.tooltipIntervalId = false;
    this.tooltipContent = this.element.getAttribute("title");
    this.tooltipPosition = this.element.getAttribute("data-tooltip-position")
      ? this.element.getAttribute("data-tooltip-position")
      : "top";
    this.tooltipClasses = this.element.getAttribute("data-tooltip-class")
      ? this.element.getAttribute("data-tooltip-class")
      : false;
    this.tooltipId = "js-tooltip-element"; // id of the tooltip element -> trigger will have the same aria-describedby attr
    // there are cases where you only need the aria-label -> SR do not need to read the tooltip content (e.g., footnotes)
    this.tooltipDescription =
      this.element.getAttribute("data-tooltip-describedby") &&
      this.element.getAttribute("data-tooltip-describedby") == "false"
        ? false
        : true;

    this.tooltipDelay = this.element.getAttribute("data-tooltip-delay"); // show tooltip after a delay (in ms)
    if (!this.tooltipDelay) this.tooltipDelay = 300;
    this.tooltipDelta = parseInt(this.element.getAttribute("data-tooltip-gap")); // distance beetwen tooltip and trigger element (in px)
    if (isNaN(this.tooltipDelta)) this.tooltipDelta = 10;
    console.log(this.tooltipDelta);
    this.tooltipTriggerHover = false;
    // tooltp sticky option
    this.tooltipSticky =
      this.tooltipClasses &&
      this.tooltipClasses.indexOf("tooltip--sticky") > -1;
    this.tooltipHover = false;
    if (this.tooltipSticky) {
      this.tooltipHoverInterval = false;
    }
    // tooltip triangle - css variable to control its position
    this.tooltipTriangleVar = "--tooltip-triangle-translate";
    resetTooltipContent(this);
    initTooltip(this);
  };

  function resetTooltipContent(tooltip) {
    var htmlContent = tooltip.element.getAttribute("data-tooltip-title");
    if (htmlContent) {
      tooltip.tooltipContent = htmlContent;
    }
  }

  function initTooltip(tooltipObj) {
    // reset trigger element
    tooltipObj.element.removeAttribute("title");
    tooltipObj.element.setAttribute("tabindex", "0");
    // add event listeners
    tooltipObj.element.addEventListener(
      "mouseenter",
      handleEvent.bind(tooltipObj)
    );
    tooltipObj.element.addEventListener("focus", handleEvent.bind(tooltipObj));
  }

  function removeTooltipEvents(tooltipObj) {
    // remove event listeners
    tooltipObj.element.removeEventListener(
      "mouseleave",
      handleEvent.bind(tooltipObj)
    );
    tooltipObj.element.removeEventListener(
      "blur",
      handleEvent.bind(tooltipObj)
    );
  }

  function handleEvent(event) {
    // handle events
    switch (event.type) {
      case "mouseenter":
      case "focus":
        showTooltip(this, event);
        break;
      case "mouseleave":
      case "blur":
        checkTooltip(this);
        break;
      case "newContent":
        changeTooltipContent(this, event);
        break;
    }
  }

  function showTooltip(tooltipObj, event) {
    // tooltip has already been triggered
    if (tooltipObj.tooltipIntervalId) return;
    tooltipObj.tooltipTriggerHover = true;
    // listen to close events
    tooltipObj.element.addEventListener(
      "mouseleave",
      handleEvent.bind(tooltipObj)
    );
    tooltipObj.element.addEventListener("blur", handleEvent.bind(tooltipObj));
    // custom event to reset tooltip content
    tooltipObj.element.addEventListener(
      "newContent",
      handleEvent.bind(tooltipObj)
    );

    // show tooltip with a delay
    tooltipObj.tooltipIntervalId = setTimeout(function () {
      createTooltip(tooltipObj);
    }, tooltipObj.tooltipDelay);
  }

  function createTooltip(tooltipObj) {
    tooltipObj.tooltip = document.getElementById(tooltipObj.tooltipId);

    if (!tooltipObj.tooltip) {
      // tooltip element does not yet exist
      tooltipObj.tooltip = document.createElement("div");
      document.body.appendChild(tooltipObj.tooltip);
    }

    // remove data-reset attribute that is used when updating tooltip content (newContent custom event)
    tooltipObj.tooltip.removeAttribute("data-reset");

    // reset tooltip content/position
    Util.setAttributes(tooltipObj.tooltip, {
      id: tooltipObj.tooltipId,
      class: "tooltip tooltip--is-hidden js-tooltip",
      role: "tooltip",
    });
    tooltipObj.tooltip.innerHTML = tooltipObj.tooltipContent;
    if (tooltipObj.tooltipDescription)
      tooltipObj.element.setAttribute("aria-describedby", tooltipObj.tooltipId);
    if (tooltipObj.tooltipClasses)
      Util.addClass(tooltipObj.tooltip, tooltipObj.tooltipClasses);
    if (tooltipObj.tooltipSticky)
      Util.addClass(tooltipObj.tooltip, "tooltip--sticky");
    placeTooltip(tooltipObj);
    Util.removeClass(tooltipObj.tooltip, "tooltip--is-hidden");

    // if tooltip is sticky, listen to mouse events
    if (!tooltipObj.tooltipSticky) return;
    tooltipObj.tooltip.addEventListener("mouseenter", function cb() {
      tooltipObj.tooltipHover = true;
      if (tooltipObj.tooltipHoverInterval) {
        clearInterval(tooltipObj.tooltipHoverInterval);
        tooltipObj.tooltipHoverInterval = false;
      }
      tooltipObj.tooltip.removeEventListener("mouseenter", cb);
      tooltipLeaveEvent(tooltipObj);
    });
  }

  function tooltipLeaveEvent(tooltipObj) {
    tooltipObj.tooltip.addEventListener("mouseleave", function cb() {
      tooltipObj.tooltipHover = false;
      tooltipObj.tooltip.removeEventListener("mouseleave", cb);
      hideTooltip(tooltipObj);
    });
  }

  function placeTooltip(tooltipObj) {
    // set top and left position of the tooltip according to the data-tooltip-position attr of the trigger
    var dimention = [
        tooltipObj.tooltip.offsetHeight,
        tooltipObj.tooltip.offsetWidth,
      ],
      positionTrigger = tooltipObj.element.getBoundingClientRect(),
      position = [],
      scrollY = window.scrollY || window.pageYOffset;

    position["top"] = [
      positionTrigger.top - dimention[0] - tooltipObj.tooltipDelta + scrollY,
      positionTrigger.right / 2 + positionTrigger.left / 2 - dimention[1] / 2,
    ];
    position["bottom"] = [
      positionTrigger.bottom + tooltipObj.tooltipDelta + scrollY,
      positionTrigger.right / 2 + positionTrigger.left / 2 - dimention[1] / 2,
    ];
    position["left"] = [
      positionTrigger.top / 2 +
        positionTrigger.bottom / 2 -
        dimention[0] / 2 +
        scrollY,
      positionTrigger.left - dimention[1] - tooltipObj.tooltipDelta,
    ];
    position["right"] = [
      positionTrigger.top / 2 +
        positionTrigger.bottom / 2 -
        dimention[0] / 2 +
        scrollY,
      positionTrigger.right + tooltipObj.tooltipDelta,
    ];

    var direction = tooltipObj.tooltipPosition;
    if (direction == "top" && position["top"][0] < scrollY)
      direction = "bottom";
    else if (
      direction == "bottom" &&
      position["bottom"][0] + tooltipObj.tooltipDelta + dimention[0] >
        scrollY + window.innerHeight
    )
      direction = "top";
    else if (direction == "left" && position["left"][1] < 0)
      direction = "right";
    else if (
      direction == "right" &&
      position["right"][1] + dimention[1] > window.innerWidth
    )
      direction = "left";

    // reset tooltip triangle translate value
    tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, "0px");

    if (direction == "top" || direction == "bottom") {
      var deltaMarg = 5;
      if (position[direction][1] < 0) {
        position[direction][1] = deltaMarg;
        // make sure triangle is at the center of the tooltip trigger
        tooltipObj.tooltip.style.setProperty(
          tooltipObj.tooltipTriangleVar,
          positionTrigger.left +
            0.5 * positionTrigger.width -
            0.5 * dimention[1] -
            deltaMarg +
            "px"
        );
      }
      if (position[direction][1] + dimention[1] > window.innerWidth) {
        position[direction][1] = window.innerWidth - dimention[1] - deltaMarg;
        // make sure triangle is at the center of the tooltip trigger
        tooltipObj.tooltip.style.setProperty(
          tooltipObj.tooltipTriangleVar,
          0.5 * dimention[1] -
            (window.innerWidth - positionTrigger.right) -
            0.5 * positionTrigger.width +
            deltaMarg +
            "px"
        );
      }
    }
    tooltipObj.tooltip.style.top = position[direction][0] + "px";
    tooltipObj.tooltip.style.left = position[direction][1] + "px";
    Util.addClass(tooltipObj.tooltip, "tooltip--" + direction);
  }

  function checkTooltip(tooltipObj) {
    tooltipObj.tooltipTriggerHover = false;
    if (!tooltipObj.tooltipSticky) hideTooltip(tooltipObj);
    else {
      if (tooltipObj.tooltipHover) return;
      if (tooltipObj.tooltipHoverInterval) return;
      tooltipObj.tooltipHoverInterval = setTimeout(function () {
        hideTooltip(tooltipObj);
        tooltipObj.tooltipHoverInterval = false;
      }, 300);
    }
  }

  function hideTooltip(tooltipObj) {
    if (tooltipObj.tooltipHover || tooltipObj.tooltipTriggerHover) return;
    clearInterval(tooltipObj.tooltipIntervalId);
    if (tooltipObj.tooltipHoverInterval) {
      clearInterval(tooltipObj.tooltipHoverInterval);
      tooltipObj.tooltipHoverInterval = false;
    }
    tooltipObj.tooltipIntervalId = false;
    if (!tooltipObj.tooltip) return;
    // hide tooltip
    removeTooltip(tooltipObj);
    // remove events
    removeTooltipEvents(tooltipObj);
  }

  function removeTooltip(tooltipObj) {
    if (
      tooltipObj.tooltipContent == tooltipObj.tooltip.innerHTML ||
      tooltipObj.tooltip.getAttribute("data-reset") == "on"
    ) {
      Util.addClass(tooltipObj.tooltip, "tooltip--is-hidden");
      tooltipObj.tooltip.removeAttribute("data-reset");
    }
    if (tooltipObj.tooltipDescription)
      tooltipObj.element.removeAttribute("aria-describedby");
  }

  function changeTooltipContent(tooltipObj, event) {
    if (tooltipObj.tooltip && tooltipObj.tooltipTriggerHover && event.detail) {
      tooltipObj.tooltip.innerHTML = event.detail;
      tooltipObj.tooltip.setAttribute("data-reset", "on");
      placeTooltip(tooltipObj);
    }
  }

  window.Tooltip = Tooltip;

  //initialize the Tooltip objects
  var tooltips = document.getElementsByClassName("js-tooltip-trigger");
  if (tooltips.length > 0) {
    for (var i = 0; i < tooltips.length; i++) {
      (function (i) {
        new Tooltip(tooltips[i]);
      })(i);
    }
  }
})();

// File#: _2_copy-to-clip
// Usage: codyhouse.co/license
(function () {
  var CopyClipboard = function () {
    this.copyTargetClass = "js-copy-to-clip";
    this.copyStatusClass = "copy-to-clip--copied";
    this.resetDelay = 2000; // delay for removing the copy-to-clip--copied class
    initCopyToClipboard(this);
  };

  function initCopyToClipboard(element) {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("." + element.copyTargetClass);
      if (!target) return;
      copyContentToClipboard(element, target);
    });
  }

  function copyContentToClipboard(element, target) {
    // copy to clipboard
    navigator.clipboard.writeText(getContentToCopy(target)).then(
      function () {
        // content successfully copied
        // add success class to target
        Util.addClass(target, element.copyStatusClass);

        setTimeout(function () {
          // remove success class from target
          Util.removeClass(target, element.copyStatusClass);
        }, element.resetDelay);

        // change tooltip content
        var newTitle = target.getAttribute("data-success-title");
        if (newTitle && newTitle != "")
          target.dispatchEvent(
            new CustomEvent("newContent", { detail: newTitle })
          );

        // dispatch success event
        target.dispatchEvent(new CustomEvent("contentCopied"));
      },
      function () {
        // error while copying the code
        // dispatch error event
        target.dispatchEvent(new CustomEvent("contentNotCopied"));
      }
    );
  }

  function getContentToCopy(target) {
    var content = target.innerText;
    var ariaControls = document.getElementById(
        target.getAttribute("aria-controls")
      ),
      defaultText = target.getAttribute("data-clipboard-content");
    if (ariaControls) {
      content = ariaControls.innerText;
    } else if (defaultText && defaultText != "") {
      content = defaultText;
    }
    return content;
  }

  window.CopyClipboard = CopyClipboard;

  var copyToClipboard = document.getElementsByClassName("js-copy-to-clip");
  if (copyToClipboard.length > 0) {
    new CopyClipboard();
  }
})();

// File#: _2_drawer-navigation
// Usage: codyhouse.co/license
(function () {
  function initDrNavControl(element) {
    var circle = element.getElementsByTagName("circle");
    if (circle.length > 0) {
      // set svg attributes to create fill-in animation on click
      initCircleAttributes(element, circle[0]);
    }

    var drawerId = element.getAttribute("aria-controls"),
      drawer = document.getElementById(drawerId);
    if (drawer) {
      // when the drawer is closed without click (e.g., user presses 'Esc') -> reset trigger status
      drawer.addEventListener("drawerIsClose", function (event) {
        if (
          !event.detail ||
          (event.detail &&
            !event.detail.closest(
              '.js-dr-nav-control[aria-controls="' + drawerId + '"]'
            ))
        )
          resetTrigger(element);
      });
    }
  }

  function initCircleAttributes(element, circle) {
    // set circle stroke-dashoffset/stroke-dasharray values
    var circumference = (2 * Math.PI * circle.getAttribute("r")).toFixed(2);
    circle.setAttribute("stroke-dashoffset", circumference);
    circle.setAttribute("stroke-dasharray", circumference);
    Util.addClass(element, "dr-nav-control--ready-to-animate");
  }

  function resetTrigger(element) {
    Util.removeClass(element, "anim-menu-btn--state-b");
  }

  var drNavControl = document.getElementsByClassName("js-dr-nav-control");
  if (drNavControl.length > 0) initDrNavControl(drNavControl[0]);
})();

// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function () {
  var StickyShareBar = function (element) {
    this.element = element;
    this.contentTarget = document.getElementsByClassName(
      "js-sticky-sharebar-target"
    );
    this.contentTargetOut = document.getElementsByClassName(
      "js-sticky-sharebar-target-out"
    );
    this.showClass = "sticky-sharebar--on-target";
    this.threshold = "50%"; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
    initShareBar(this);
    initTargetOut(this);
  };

  function initShareBar(shareBar) {
    if (shareBar.contentTarget.length < 1) {
      shareBar.showSharebar = true;
      Util.addClass(shareBar.element, shareBar.showClass);
      return;
    }
    if (intersectionObserverSupported) {
      shareBar.showSharebar = false;
      initObserver(shareBar); // update anchor appearance on scroll
    } else {
      Util.addClass(shareBar.element, shareBar.showClass);
    }
  }

  function initObserver(shareBar) {
    // target of Sharebar
    var observer = new IntersectionObserver(
      function (entries, observer) {
        shareBar.showSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      },
      { rootMargin: "0px 0px -" + shareBar.threshold + " 0px" }
    );
    observer.observe(shareBar.contentTarget[0]);
  }

  function initTargetOut(shareBar) {
    // target out of Sharebar
    shareBar.hideSharebar = false;
    if (shareBar.contentTargetOut.length < 1) {
      return;
    }
    var observer = new IntersectionObserver(function (entries, observer) {
      shareBar.hideSharebar = entries[0].isIntersecting;
      toggleSharebar(shareBar);
    });
    observer.observe(shareBar.contentTargetOut[0]);
  }

  function toggleSharebar(shareBar) {
    Util.toggleClass(
      shareBar.element,
      shareBar.showClass,
      shareBar.showSharebar && !shareBar.hideSharebar
    );
  }

  //initialize the StickyShareBar objects
  var stickyShareBar = document.getElementsByClassName("js-sticky-sharebar"),
    intersectionObserverSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;

  if (stickyShareBar.length > 0) {
    for (var i = 0; i < stickyShareBar.length; i++) {
      (function (i) {
        new StickyShareBar(stickyShareBar[i]);
      })(i);
    }
  }
})();

// File#: _2_tabs-v3
// Usage: codyhouse.co/license
