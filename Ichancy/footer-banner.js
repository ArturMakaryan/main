(() => {
  if (window.ichancyFooterBannerInstalled) return;
  window.ichancyFooterBannerInstalled = true;

  function positionBanner() {
    const divider = document.querySelector('[data-mj="footer"] hr.app-ltr-1bylbti, [data-mj="footer"] hr.app-rtl-1bylbti');
    const image = document.querySelector('[data-mj="widget-fixed-image-banner"] img[src*="c592b553-a506-441a-b0bf-be9f0ec17bb7"]');
    const banner = image && image.closest('[data-mj="widget-fixed-image-banner"]');
    if (divider && banner && divider.nextElementSibling !== banner) {
      divider.insertAdjacentElement('afterend', banner);
    }
  }

  function start() {
    positionBanner();
    new MutationObserver(positionBanner).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
