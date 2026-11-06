(() => {
  if (window.ichancyFooterBannerInstalled) return;
  window.ichancyFooterBannerInstalled = true;

  function positionBanner() {
    const footerBottom = document.querySelector('[data-mj="footer"] [data-mj="footer-bottom"]');
    const image = document.querySelector('[data-mj="widget-fixed-image-banner"] img[src*="b7c64f18-b6a7-4f32-9bdd-4032f727743e"], [data-mj="widget-fixed-image-banner"] img[src*="c592b553-a506-441a-b0bf-be9f0ec17bb7"]');
    const banner = image && image.closest('[data-mj="widget-fixed-image-banner"]');
    if (footerBottom && banner && footerBottom.previousElementSibling !== banner) {
      footerBottom.insertAdjacentElement('beforebegin', banner);
    }
  }

  function start() {
    positionBanner();
    new MutationObserver(positionBanner).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
