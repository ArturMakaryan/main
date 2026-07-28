(function () {
  const tabs = [
    { label: "Home", active: true },
    { label: "Casino" },
    { label: "Free money" },
    { label: "Sports" }
  ];
  const targetSelectors = [
    '[data-mj="header-left"]',
    '[data-mj="custom-header"]',
    '[data-mj="header"]'
  ];

  const observedRoots = new WeakSet();

  function getTabsCss() {
    return `
      [data-mj="header-left"] {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }

      [data-mj="custom-header"],
      [data-mj="header"] {
        align-items: center !important;
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
  }

  function addTabsStyles(root) {
    const styleRoot = root instanceof ShadowRoot ? root : document.head;

    if (!styleRoot || styleRoot.querySelector("#youcan-header-tabs-style")) return;

    const style = document.createElement("style");
    style.id = "youcan-header-tabs-style";
    style.textContent = getTabsCss();
    styleRoot.appendChild(style);
  }

  function findDeep(selector, root) {
    if (!root) return null;

    const match = root.querySelector(selector);
    if (match) return match;

    const elements = root.querySelectorAll("*");

    for (const element of elements) {
      if (!element.shadowRoot) continue;

      const shadowMatch = findDeep(selector, element.shadowRoot);
      if (shadowMatch) return shadowMatch;
    }

    return null;
  }

  function observeRoot(root) {
    if (!root || observedRoots.has(root)) return;

    observedRoots.add(root);

    const observer = new MutationObserver(init);
    observer.observe(root, {
      childList: true,
      subtree: true
    });
  }

  function observeOpenShadowRoots(root) {
    if (!root) return;

    observeRoot(root);

    const elements = root.querySelectorAll("*");

    for (const element of elements) {
      if (!element.shadowRoot) continue;
      observeOpenShadowRoots(element.shadowRoot);
    }
  }

  function addHeaderTabs() {
    const headerLeft = targetSelectors
      .map((selector) => findDeep(selector, document))
      .find(Boolean);

    if (!headerLeft || headerLeft.querySelector(".youcan-header-tabs")) return;

    const root = headerLeft.getRootNode();
    addTabsStyles(root);

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
    document.documentElement.setAttribute("data-youcan-tabs-ready", "true");
    addTabsStyles(document);
    observeOpenShadowRoots(document);
    addHeaderTabs();
  }

  function start() {
    init();
    window.setTimeout(init, 500);
    window.setTimeout(init, 1500);
    window.setTimeout(init, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
