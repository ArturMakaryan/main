(function () {
  function addTestBadge() {
    var existingBadge = document.querySelector('[data-mj-js-test="esportesnew"]');

    if (existingBadge) {
      existingBadge.remove();
    }

    var badge = document.createElement("div");
    badge.setAttribute("data-mj-js-test", "esportesnew");
    badge.textContent = "CUSTOM JS LOADED";
    badge.style.position = "fixed";
    badge.style.top = "12px";
    badge.style.left = "12px";
    badge.style.zIndex = "2147483647";
    badge.style.padding = "10px 14px";
    badge.style.borderRadius = "10px";
    badge.style.background = "#ff512f";
    badge.style.color = "#fff";
    badge.style.fontFamily = "Arial, sans-serif";
    badge.style.fontSize = "14px";
    badge.style.fontWeight = "700";
    badge.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.25)";
    document.body.appendChild(badge);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addTestBadge);
  } else {
    addTestBadge();
  }
})();
