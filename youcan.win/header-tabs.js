(function () {
  const tabs = [
    { label: "Home", icon: "home.svg", active: true },
    { label: "Casino", icon: "casino.svg" },
    { label: "Sports", icon: "sport.svg" }
  ];
  const targetSelectors = [
    '[data-mj="header-left"]',
    '[data-mj="custom-header"]',
    '[data-mj="header"]'
  ];

  const observedRoots = new WeakSet();
  const assetBaseUrl = getAssetBaseUrl();

  function getAssetBaseUrl() {
    const currentScript = document.currentScript;

    if (currentScript && currentScript.src) {
      return new URL("./icons/", currentScript.src).href;
    }

    return "https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/youcan.win/icons/";
  }

  function loadRubikFont() {
    if (document.getElementById("youcan-rubik-font")) return;
    if (!document.head) return;

    const preconnectGoogle = document.createElement("link");
    preconnectGoogle.rel = "preconnect";
    preconnectGoogle.href = "https://fonts.googleapis.com";

    const preconnectGstatic = document.createElement("link");
    preconnectGstatic.rel = "preconnect";
    preconnectGstatic.href = "https://fonts.gstatic.com";
    preconnectGstatic.crossOrigin = "anonymous";

    const font = document.createElement("link");
    font.id = "youcan-rubik-font";
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap";

    document.head.append(preconnectGoogle, preconnectGstatic, font);
  }

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
        height: 44px !important;
        padding: 2px !important;
        gap: 0 !important;
        background: #242626 !important;
        border-radius: 12px !important;
        box-sizing: border-box !important;
        font-family: "Rubik", sans-serif !important;
        font-weight: 300 !important;
      }

      .youcan-header-tab {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        height: 40px !important;
        padding: 0 18px !important;
        border: 0 !important;
        border-radius: 10px !important;
        background: transparent !important;
        color: #ffffff !important;
        font-family: "Rubik", sans-serif !important;
        font-size: 14px !important;
        font-weight: 300 !important;
        line-height: 1 !important;
        cursor: pointer !important;
        white-space: nowrap !important;
      }

      .youcan-header-tab:hover {
        background: rgba(255, 255, 255, 0.04) !important;
      }

      .youcan-header-tab-icon {
        display: block !important;
        width: 22px !important;
        height: 22px !important;
        object-fit: contain !important;
        flex: 0 0 22px !important;
      }

      .youcan-header-tab.is-active {
        background: #27ed89 !important;
        color: #081410 !important;
      }

      .youcan-header-tab.is-active .youcan-header-tab-icon {
        filter: brightness(0) saturate(100%) !important;
      }

      .youcan-header-tab,
      .youcan-header-tab * {
        font-family: "Rubik", sans-serif !important;
        font-weight: 300 !important;
      }

      .youcan-header-tab.is-active:hover {
        background: #27ed89 !important;
      }

      @media screen and (max-width: 992px) {
        .youcan-header-tabs {
          display: none !important;
        }
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

      if (tab.icon) {
        const icon = document.createElement("img");
        icon.className = "youcan-header-tab-icon";
        icon.src = assetBaseUrl + tab.icon;
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        button.appendChild(icon);
      }

      const label = document.createElement("span");
      label.textContent = tab.label;
      button.appendChild(label);
      tabsGroup.appendChild(button);
    });

    headerLeft.appendChild(tabsGroup);
  }

  function init() {
    document.documentElement.setAttribute("data-youcan-tabs-ready", "true");
    loadRubikFont();
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
