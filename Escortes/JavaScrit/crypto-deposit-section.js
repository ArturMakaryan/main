(() => {
  const widgetTag = "crypto-deposit-section";
  const containerSelector = '[data-mj="widget-pages-container"]';
  const welcomeTag = "scroll-welcome-banner";
  const assetBaseUrl = "https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Escortes/assets/crypto-deposit";
  const depositUrl = "https://spinwin.com/en/home/promotions/first-deposit";
  const coins = [
    { file: "01.png", alt: "Solana" },
    { file: "02.png", alt: "TRON" },
    { file: "03.png", alt: "Ethereum" },
    { file: "04.png", alt: "Dogecoin" },
    { file: "05.png", alt: "Tether" },
    { file: "06.png", alt: "USD Coin" },
    { file: "07.png", alt: "BNB" },
    { file: "08.png", alt: "XRP" },
    { file: "09.png", alt: "Bitcoin" }
  ];

  const renderCoinImages = (isDuplicate = false) => coins.map(({ file, alt }) => (
    `<img src="${assetBaseUrl}/${file}" alt="${isDuplicate ? "" : alt}" loading="lazy"${isDuplicate ? ' aria-hidden="true"' : ""}>`
  )).join("");

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
              <div class="escortesnew-crypto-deposit-track">
                ${renderCoinImages()}
                ${renderCoinImages(true)}
              </div>
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
