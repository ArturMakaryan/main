(() => {
  if (window.ichancyFooterBannerInstalled) return;
  window.ichancyFooterBannerInstalled = true;

  function positionBanner() {
    const footerBottom = document.querySelector('[data-mj="footer"] [data-mj="footer-bottom"]');
    const divider = footerBottom && footerBottom.previousElementSibling;
    const image = document.querySelector('[data-mj="widget-fixed-image-banner"] img[src*="b7c64f18-b6a7-4f32-9bdd-4032f727743e"]');
    const banner = image && image.closest('[data-mj="widget-fixed-image-banner"]');
    if (divider && divider.tagName === 'HR' && banner && divider.nextElementSibling !== banner) {
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
