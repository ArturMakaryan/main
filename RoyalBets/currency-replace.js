(function () {
  var selector = ".app-ltr-1959n0c";
  var madPrefixPattern = /^MAD\s*/;

  function replaceMadPrefix(element) {
    if (!element || !madPrefixPattern.test(element.textContent || "")) {
      return;
    }

    element.textContent = element.textContent.replace(madPrefixPattern, "$ ");
  }

  function replaceAllMadPrefixes(root) {
    if (!root || typeof root.querySelectorAll !== "function") {
      return;
    }

    if (root.matches && root.matches(selector)) {
      replaceMadPrefix(root);
    }

    root.querySelectorAll(selector).forEach(replaceMadPrefix);
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

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
