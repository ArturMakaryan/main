(() => {
  const assetBase =
    "https://cdn.jsdelivr.net/gh/ArturMakaryan/main/Waliawin/payment-assets/";
  const depositUrl = "https://waliawin.com/en/?m=account&t=deposit";
  const assets = [
    ["mistpay-telebirr.png", "MistPay Telebirr"],
    ["telebirr-remit.png", "Telebirr Remit"],
    ["telebirr.png", "Telebirr"],
    ["cbe-birr.png", "CBE Birr"],
    ["mpesa.png", "M-PESA"],
    ["cbe-birr-zerone.png", "CBE Birr ZerOne"],
    ["telebirr-zerone.png", "Telebirr ZerOne"],
  ];

  const mountPaymentAssets = () => {
    const footerBottom = document.querySelector('[data-mj="footer-bottom"]');

    if (!footerBottom?.parentElement) {
      return;
    }

    const parent = footerBottom.parentElement;
    let container = parent.querySelector('[data-mj="footer-payment-assets"]');

    if (!container) {
      container = document.createElement("div");
      container.dataset.mj = "footer-payment-assets";

      for (const [filename, alt] of assets) {
        const link = document.createElement("a");
        link.href = depositUrl;
        link.ariaLabel = `Deposit with ${alt}`;

        const image = document.createElement("img");
        image.src = assetBase + filename;
        image.alt = alt;
        image.loading = "lazy";
        image.decoding = "async";

        link.append(image);
        container.append(link);
      }
    }

    if (container.nextElementSibling !== footerBottom) {
      parent.insertBefore(container, footerBottom);
    }
  };

  const start = () => {
    mountPaymentAssets();
    new MutationObserver(mountPaymentAssets).observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
