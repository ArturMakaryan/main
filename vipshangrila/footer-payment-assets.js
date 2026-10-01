(() => {
  const assetBase =
    "https://cdn.jsdelivr.net/gh/ArturMakaryan/main@9d791ae/vipshangrila/payment-assets/";
  const depositUrl = "https://vipshangrila.com/en/?m=account&t=deposit";
  const assets = [
    ["ApplePay%201.svg", "Apple Pay"],
    ["GooglePay%201.svg", "Google Pay"],
    ["mastercard%201.svg", "Mastercard"],
    ["visa-gray%201.svg", "Visa"],
    ["muchbetter%201.svg", "MuchBetter"],
    ["bitcoin%201.svg", "Bitcoin"],
    ["ethereum%201.svg", "Ethereum"],
    ["litecoin%201.svg", "Litecoin"],
    ["ripple%201.svg", "Ripple"],
    ["Tether%201.svg", "Tether"],
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
