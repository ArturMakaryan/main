(() => {
  const applyLybobetCurrencyFix = () => {
    document.querySelectorAll(".app-ltr-ilfj1r").forEach((element) => {
      const icon = element.querySelector('object.app-ltr-nh34ao[data="/api/cmsgateway/api/v1.0/AssetTemplateSite/mad.png"]');
      if (!icon && element.textContent.trim() === "$") return;

      element.textContent = "$";
      element.style.fontSize = "14px";
      element.style.fontWeight = "700";
      element.style.color = "#fff";
      element.style.lineHeight = "1";
    });

    document.querySelectorAll(".app-ltr-175g6sl").forEach((element) => {
      element.remove();
    });
  };

  applyLybobetCurrencyFix();

  let isQueued = false;
  new MutationObserver(() => {
    if (isQueued) return;
    isQueued = true;
    requestAnimationFrame(() => {
      isQueued = false;
      applyLybobetCurrencyFix();
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
