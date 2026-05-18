(function () {
  var observerStarted = false;

  function addTestBadge() {
    var existingBadge = document.querySelector('[data-mj-js-test="esportesnew"]');
    var headerLeft = document.querySelector('[data-mj="header-left"]');

    if (existingBadge) {
      existingBadge.remove();
    }

    if (!headerLeft) {
      return;
    }

    var badge = document.createElement("div");
    badge.setAttribute("data-mj-js-test", "esportesnew");
    badge.textContent = "CUSTOM JS LOADED";
    badge.style.display = "inline-flex";
    badge.style.alignItems = "center";
    badge.style.justifyContent = "center";
    badge.style.padding = "10px 14px";
    badge.style.borderRadius = "10px";
    badge.style.background = "#ff512f";
    badge.style.color = "#fff";
    badge.style.fontFamily = "Arial, sans-serif";
    badge.style.fontSize = "14px";
    badge.style.fontWeight = "700";
    badge.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.25)";
    headerLeft.appendChild(badge);
  }

  function addBannerCta() {
    var bannerLink = document.querySelector('[data-mj="widget-banner-link"]');
    var existingCta = document.querySelector('[data-mj-js-banner-cta="esportesnew"]');

    if (existingCta) {
      existingCta.remove();
    }

    if (!bannerLink) {
      return;
    }

    bannerLink.style.position = "relative";
    bannerLink.style.overflow = "hidden";

    var cta = document.createElement("div");
    cta.setAttribute("data-mj-js-banner-cta", "esportesnew");
    cta.style.position = "absolute";
    cta.style.top = "24px";
    cta.style.left = "24px";
    cta.style.zIndex = "20";
    cta.style.display = "flex";
    cta.style.alignItems = "center";
    cta.style.gap = "12px";
    cta.style.flexWrap = "wrap";
    cta.style.fontFamily = "Arial, sans-serif";
    cta.style.pointerEvents = "none";

    var text = document.createElement("span");
    text.textContent = "Click here";
    text.style.color = "red";
    text.style.fontSize = "clamp(16px, 2.4vw, 28px)";
    text.style.fontWeight = "800";
    text.style.textShadow = "0 2px 12px rgba(0, 0, 0, 0.45)";

    var button = document.createElement("span");
    button.setAttribute("role", "button");
    button.textContent = "Click here";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.borderRadius = "12px";
    button.style.padding = "12px 18px";
    button.style.background = "red";
    button.style.color = "#fff";
    button.style.fontSize = "clamp(13px, 1.6vw, 16px)";
    button.style.fontWeight = "700";
    button.style.boxShadow = "0 10px 28px rgba(255, 0, 0, 0.28)";

    cta.appendChild(text);
    cta.appendChild(button);
    bannerLink.appendChild(cta);
  }

  function init() {
    addTestBadge();
    addBannerCta();
  }

  function startObserver() {
    if (observerStarted || !document.body) {
      return;
    }

    observerStarted = true;

    var observer = new MutationObserver(function () {
      init();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(function () {
      observer.disconnect();
    }, 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      startObserver();
    });
  } else {
    init();
    startObserver();
  }
})();
