(function () {
  "use strict";

  var BUTTON_SELECTOR = '[data-lucky7spins-telegram-button="true"]';
  var TELEGRAM_URL = "https://t.me/Lucky7_support";
  var WIDGET_SELECTOR = 'script[src="https://chathub-povo.onrender.com/widget.js"]';
  var WIDGET_KEY = "FQ_4IVjbpyoJt29AUma7XHJl";

  function createButton() {
    var button = document.createElement("button");

    button.type = "button";
    button.className = "lucky7spins-telegram-button";
    button.setAttribute("data-lucky7spins-telegram-button", "true");
    button.setAttribute("aria-label", "Telegram");
    button.title = "Telegram";
    button.addEventListener("click", function () {
      window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
    });

    return button;
  }

  function addTelegramButton() {
    document.querySelectorAll('[data-mj="header-right"]').forEach(function (headerRight) {
      if (headerRight.querySelector(BUTTON_SELECTOR)) return;

      headerRight.prepend(createButton());
    });
  }

  function loadChatHubWidget() {
    if (document.querySelector(WIDGET_SELECTOR)) return;

    var widgetScript = document.createElement("script");
    widgetScript.src = "https://chathub-povo.onrender.com/widget.js";
    widgetScript.setAttribute("data-key", WIDGET_KEY);
    widgetScript.async = true;
    document.head.appendChild(widgetScript);
  }

  var scheduled = false;
  var observer = new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;

    window.requestAnimationFrame(function () {
      scheduled = false;
      addTelegramButton();
    });
  });

  function init() {
    addTelegramButton();
    loadChatHubWidget();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
