(() => {
  const widgetTag = "crypto-deposit-section";
  const containerSelector = '[data-mj="widget-pages-container"]';
  const welcomeTag = "scroll-welcome-banner";
  const assetBaseUrl = "https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Escortes/assets/crypto-deposit";
  const depositUrl = "https://spinwin.com/en/home/promotions/first-deposit";

  class CryptoDepositSection extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.dataset.rendered = "true";
      this.innerHTML = `
        <section class="escortesnew-crypto-deposit">
          <div class="escortesnew-crypto-deposit-card">
            <h2 class="escortesnew-crypto-deposit-title">
              Want to play? <span>Deposit now</span>
            </h2>

            <div class="escortesnew-crypto-deposit-coins" aria-label="Supported crypto coins">
              <img src="${assetBaseUrl}/01.png" alt="Solana" loading="lazy">
              <img src="${assetBaseUrl}/02.png" alt="TRON" loading="lazy">
              <img src="${assetBaseUrl}/03.png" alt="Ethereum" loading="lazy">
              <img src="${assetBaseUrl}/04.png" alt="Dogecoin" loading="lazy">
              <img src="${assetBaseUrl}/05.png" alt="Tether" loading="lazy">
              <img src="${assetBaseUrl}/06.png" alt="USD Coin" loading="lazy">
              <img src="${assetBaseUrl}/07.png" alt="BNB" loading="lazy">
              <img src="${assetBaseUrl}/08.png" alt="XRP" loading="lazy">
              <img src="${assetBaseUrl}/09.png" alt="Bitcoin" loading="lazy">
            </div>

            <a class="escortesnew-crypto-deposit-button" href="${depositUrl}">
              Deposit
            </a>
          </div>
        </section>
      `;
    }
  }

  if (!customElements.get(widgetTag)) customElements.define(widgetTag, CryptoDepositSection);

  const mountSection = () => {
    const container = document.querySelector(containerSelector);
    if (!container) return false;

    let section = container.querySelector(`:scope > ${widgetTag}`);
    if (!section) section = document.createElement(widgetTag);

    const welcome = container.querySelector(`:scope > ${welcomeTag}`);
    if (welcome) {
      if (welcome.nextElementSibling !== section) welcome.after(section);
    } else if (container.firstElementChild !== section) {
      container.prepend(section);
    }

    return true;
  };

  let mountQueued = false;
  const scheduleMount = () => {
    if (mountQueued) return;
    mountQueued = true;
    requestAnimationFrame(() => {
      mountQueued = false;
      mountSection();
    });
  };

  mountSection();
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();
