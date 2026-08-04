(function () {
  "use strict";

  var CLASS_PREFIX = "rb-";
  var DETECT_ATTR = "data-rb-detected";
  var debounceTimer = 0;

  function isVisible(element) {
    if (!element || element.nodeType !== 1) return false;

    var rect = element.getBoundingClientRect();
    var style = window.getComputedStyle(element);

    return (
      rect.width > 20 &&
      rect.height > 20 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 1) > 0.01
    );
  }

  function addClass(element, className) {
    if (!element || element.classList.contains(className)) return;
    element.classList.add(className);
  }

  function clearSidebarState(sidebar) {
    sidebar.classList.remove(CLASS_PREFIX + "sidebar-collapsed");
    sidebar.classList.remove(CLASS_PREFIX + "sidebar-expanded");
  }

  function scoreSidebarCandidate(element) {
    if (!isVisible(element)) return -Infinity;

    var rect = element.getBoundingClientRect();
    var links = element.querySelectorAll("a, button").length;
    var icons = element.querySelectorAll("svg, i, img").length;
    var inputs = element.querySelectorAll("input, textarea, select").length;
    var style = window.getComputedStyle(element);

    var score = 0;

    if (rect.left <= 12) score += 45;
    if (rect.top <= 20) score += 15;
    if (rect.height >= window.innerHeight * 0.7) score += 30;
    if (rect.width >= 56 && rect.width <= 340) score += 30;
    if (style.position === "fixed" || style.position === "sticky") score += 8;

    score += Math.min(links, 24);
    score += Math.min(icons, 18);
    score -= inputs * 8;

    if (rect.width > window.innerWidth * 0.35) score -= 80;
    if (element === document.body || element === document.documentElement) score -= 100;

    return score;
  }

  function findSidebar() {
    var selector = [
      "aside",
      "nav",
      "[role='navigation']",
      "[data-mj*='sidebar']",
      "div",
      "section"
    ].join(",");

    var candidates = Array.prototype.slice.call(document.querySelectorAll(selector))
      .map(function (element) {
        return {
          element: element,
          score: scoreSidebarCandidate(element)
        };
      })
      .filter(function (candidate) {
        return candidate.score >= 70;
      })
      .sort(function (a, b) {
        var widthDiff = a.element.getBoundingClientRect().width - b.element.getBoundingClientRect().width;
        return b.score - a.score || widthDiff;
      });

    return candidates.length ? candidates[0].element : null;
  }

  function findSidebarNav(sidebar) {
    var nav = sidebar.querySelector("nav");
    if (nav && isVisible(nav)) return nav;

    var candidates = Array.prototype.slice.call(sidebar.querySelectorAll("div, section, ul"))
      .filter(isVisible)
      .map(function (element) {
        return {
          element: element,
          links: element.querySelectorAll("a, button").length,
          rect: element.getBoundingClientRect()
        };
      })
      .filter(function (candidate) {
        return candidate.links >= 4;
      })
      .sort(function (a, b) {
        return b.links - a.links || b.rect.height - a.rect.height;
      });

    return candidates.length ? candidates[0].element : null;
  }

  function findSidebarContent(sidebar) {
    var directChildren = Array.prototype.slice.call(sidebar.children).filter(isVisible);
    if (!directChildren.length) return sidebar;

    return directChildren
      .map(function (element) {
        var rect = element.getBoundingClientRect();
        return {
          element: element,
          score:
            (rect.height >= sidebar.getBoundingClientRect().height * 0.45 ? 30 : 0) +
            Math.min(element.querySelectorAll("a, button").length, 20)
        };
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })[0].element;
  }

  function findSidebarFooter(sidebar) {
    var explicitFooter = sidebar.querySelector("[data-mj*='sidebar-footer'], footer");
    if (explicitFooter && isVisible(explicitFooter)) return explicitFooter;

    var sidebarRect = sidebar.getBoundingClientRect();
    var candidates = Array.prototype.slice.call(sidebar.querySelectorAll("div, footer, section"))
      .filter(isVisible)
      .map(function (element) {
        var rect = element.getBoundingClientRect();
        var controls = element.querySelectorAll("a, button, input, select").length;
        return {
          element: element,
          rect: rect,
          links: element.querySelectorAll("a, button").length,
          controls: controls,
          textLength: (element.innerText || element.textContent || "").trim().length,
          score:
            (rect.height >= 44 ? 20 : 0) +
            Math.min(controls, 8) +
            ((element.innerText || element.textContent || "").trim().length ? 8 : 0) +
            rect.top / Math.max(sidebarRect.height, 1)
        };
      })
      .filter(function (candidate) {
        return (
          candidate.rect.top > sidebarRect.top + sidebarRect.height * 0.55 &&
          candidate.controls > 0
        );
      })
      .sort(function (a, b) {
        return b.score - a.score || b.rect.bottom - a.rect.bottom;
      });

    return candidates.length ? candidates[0].element : null;
  }

  function markSidebarLinks(sidebar) {
    Array.prototype.slice.call(sidebar.querySelectorAll("a, button"))
      .filter(isVisible)
      .forEach(function (element) {
        addClass(element, CLASS_PREFIX + "sidebar-link");

        var parent = element.closest("li, div");
        if (parent && parent !== sidebar) {
          addClass(parent, CLASS_PREFIX + "sidebar-group");
        }
      });
  }

  function markCollapseButtons(sidebar) {
    var sidebarRect = sidebar.getBoundingClientRect();
    Array.prototype.slice.call(document.querySelectorAll("button, [role='button']"))
      .filter(isVisible)
      .forEach(function (button) {
        var rect = button.getBoundingClientRect();
        var nearSidebarEdge = Math.abs(rect.left - sidebarRect.right) <= 28 || Math.abs(rect.right - sidebarRect.right) <= 28;
        var nearTop = rect.top <= 140;
        var hasSmallIcon = button.querySelector("svg") || (rect.width <= 56 && rect.height <= 56);
        var label = (button.getAttribute("aria-label") || button.getAttribute("name") || "").toLowerCase();
        var labelLooksRight = label.indexOf("arrow") !== -1 || label.indexOf("menu") !== -1 || label.indexOf("collapse") !== -1;

        if (nearSidebarEdge && nearTop && hasSmallIcon && (labelLooksRight || rect.width <= 56)) {
          addClass(button, CLASS_PREFIX + "sidebar-collapse-button");
        }
      });
  }

  function detectSidebar() {
    var sidebar = findSidebar();
    if (!sidebar) return;

    var rect = sidebar.getBoundingClientRect();
    var content = findSidebarContent(sidebar);
    var nav = findSidebarNav(sidebar);
    var footer = findSidebarFooter(sidebar);

    addClass(sidebar, CLASS_PREFIX + "sidebar");
    sidebar.setAttribute(DETECT_ATTR, "sidebar");
    clearSidebarState(sidebar);

    if (rect.width <= 120) {
      addClass(sidebar, CLASS_PREFIX + "sidebar-collapsed");
    } else {
      addClass(sidebar, CLASS_PREFIX + "sidebar-expanded");
    }

    if (content) {
      addClass(content, CLASS_PREFIX + "sidebar-content");
      content.setAttribute(DETECT_ATTR, "sidebar-content");
    }

    if (nav) {
      addClass(nav, CLASS_PREFIX + "sidebar-nav");
      nav.setAttribute(DETECT_ATTR, "sidebar-nav");
    }

    if (footer) {
      addClass(footer, CLASS_PREFIX + "sidebar-footer");
      footer.setAttribute(DETECT_ATTR, "sidebar-footer");
    }

    markSidebarLinks(sidebar);
    markCollapseButtons(sidebar);
  }

  function scheduleDetect() {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(detectSidebar, 180);
  }

  function start() {
    detectSidebar();

    var observer = new MutationObserver(scheduleDetect);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "aria-expanded", "open"]
    });

    window.addEventListener("resize", scheduleDetect, { passive: true });
    window.addEventListener("orientationchange", scheduleDetect, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
