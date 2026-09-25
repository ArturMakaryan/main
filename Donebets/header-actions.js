(function () {
  "use strict";

  var scriptUrl = document.currentScript && document.currentScript.src;
  var assetBase = scriptUrl ? new URL(".", scriptUrl) : new URL("./", window.location.href);
  var actions = [
    {
      label: "Support",
      href: "https://t.me/Donebetsteam",
      icon: "support.svg"
    },
    {
      label: "Telegram",
      href: "https://t.me/Done_Bets_Gaming",
      icon: "telegram-icon.svg"
    }
  ];

  function createAction(config) {
    var link = document.createElement("a");
    var icon = document.createElement("img");

    link.className = "donebets-header-action";
    link.href = config.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", config.label);
    link.title = config.label;

    icon.src = new URL(config.icon, assetBase).href;
    icon.alt = "";
    icon.width = 24;
    icon.height = 24;
    icon.setAttribute("aria-hidden", "true");
    link.appendChild(icon);

    return link;
  }

  function addHeaderActions() {
    document.querySelectorAll('[data-mj="header-right"]').forEach(function (headerRight) {
      var group;

      if (headerRight.querySelector('[data-donebets-header-actions="true"]')) return;

      group = document.createElement("div");
      group.className = "donebets-header-actions";
      group.setAttribute("data-donebets-header-actions", "true");

      actions.forEach(function (action) {
        group.appendChild(createAction(action));
      });

      headerRight.insertBefore(group, headerRight.firstChild);
    });
  }

  var scheduled = false;
  var observer = new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;

    window.requestAnimationFrame(function () {
      scheduled = false;
      addHeaderActions();
    });
  });

  function init() {
    addHeaderActions();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
