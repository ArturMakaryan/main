(function () {
  var selectors = [
    ".app-ltr-1959n0c",
    "p",
    "span",
    "div"
  ];
  var madPrefixPattern = /^MAD\s*/;
  var retryCount = 0;
  var maxRetries = 40;

  function replaceMadPrefix(element) {
    if (!element || !madPrefixPattern.test(element.textContent || "")) {
      return;
    }

    if (element.children && element.children.length > 0) {
      return;
    }

    element.textContent = element.textContent.replace(madPrefixPattern, "$ ");
  }

  function getSelector() {
    return selectors.join(",");
  }

  function replaceAllMadPrefixes(root) {
    if (!root || typeof root.querySelectorAll !== "function") {
      return;
    }

    if (root.matches && root.matches(getSelector())) {
      replaceMadPrefix(root);
    }

    root.querySelectorAll(getSelector()).forEach(replaceMadPrefix);
  }

  function start() {
    replaceAllMadPrefixes(document);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") {
          replaceAllMadPrefixes(mutation.target.parentElement);
          return;
        }

        if (mutation.type === "childList") {
          replaceAllMadPrefixes(mutation.target);
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) {
              replaceAllMadPrefixes(node);
            }
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true
    });

    var retryTimer = setInterval(function () {
      replaceAllMadPrefixes(document);
      retryCount += 1;

      if (retryCount >= maxRetries) {
        clearInterval(retryTimer);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
