(function () {
  const tabs = [
    { label: "Home", active: true },
    { label: "Casino" },
    { label: "Free money" },
    { label: "Sports" }
  ];

  let observer = null;

  function addTabsStyles() {
    if (document.getElementById("youcan-header-tabs-style")) return;
    if (!document.head) return;

    const style = document.createElement("style");
    style.id = "youcan-header-tabs-style";
    style.textContent = `
      [data-mj="header-left"] {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }

      .youcan-header-tabs {
        display: inline-flex !important;
        align-items: center !important;
        height: 40px !important;
        padding: 2px !important;
        gap: 2px !important;
        background: #242626 !important;
        border-radius: 12px !important;
        box-sizing: border-box !important;
      }

      .youcan-header-tab {
        height: 36px !important;
        padding: 0 18px !important;
        border: 0 !important;
        border-radius: 10px !important;
        background: transparent !important;
        color: #ffffff !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        line-height: 1 !important;
        cursor: pointer !important;
        white-space: nowrap !important;
      }

      .youcan-header-tab.is-active {
        background: #27ed89 !important;
        color: #081410 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function addHeaderTabs() {
    const headerLeft = document.querySelector('[data-mj="header-left"]');

    if (!headerLeft || headerLeft.querySelector(".youcan-header-tabs")) return;

    const tabsGroup = document.createElement("div");
    tabsGroup.className = "youcan-header-tabs";

    tabs.forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "youcan-header-tab";

      if (tab.active) {
        button.classList.add("is-active");
      }

      button.textContent = tab.label;
      tabsGroup.appendChild(button);
    });

    headerLeft.appendChild(tabsGroup);
  }

  function init() {
    addTabsStyles();
    addHeaderTabs();
  }

  function start() {
    init();

    if (observer || !document.documentElement) return;

    observer = new MutationObserver(init);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
