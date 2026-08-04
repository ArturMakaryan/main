(function () {
  var madPrefixPattern = /^MAD\s*/;
  var retryCount = 0;
  var maxRetries = 40;

  function replaceTextNode(node) {
    if (!node || node.nodeType !== 3 || !madPrefixPattern.test(node.nodeValue || "")) {
      return;
    }

    node.nodeValue = node.nodeValue.replace(madPrefixPattern, "$ ");
  }

  function replaceAllMadPrefixes(root) {
    if (!root) {
      return;
    }

    if (root.nodeType === 3) {
      replaceTextNode(root);
      return;
    }

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node = walker.nextNode();

    while (node) {
      replaceTextNode(node);
      node = walker.nextNode();
    }
  }

  function start() {
    replaceAllMadPrefixes(document.body || document.documentElement);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") {
          replaceTextNode(mutation.target);
          return;
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(replaceAllMadPrefixes);
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true
    });

    var retryTimer = setInterval(function () {
      replaceAllMadPrefixes(document.body || document.documentElement);
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
