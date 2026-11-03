(function () {
  function addCryptoSection() {
    var pageContent = document.querySelector('[data-mj="page-content"]');

    if (!pageContent || document.querySelector('.ichancy-crypto-container')) {
      return;
    }

    var section = document.createElement('div');
    section.className = 'ichancy-crypto-container';

    section.innerHTML = `
      <section class="ichancy-crypto-card">
        <div class="ichancy-crypto-title">
          <strong>Get</strong> crypto in seconds
        </div>

        <div class="ichancy-crypto-methods">
          <img src="https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Ichancy/payment-icons/mastercard.svg" alt="Mastercard">
          <img src="https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Ichancy/payment-icons/visa.svg" alt="Visa">
          <img src="https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Ichancy/payment-icons/samsung.svg" alt="Samsung Pay">
          <img src="https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Ichancy/payment-icons/apple-pay.svg" alt="Apple Pay">
          <img src="https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Ichancy/payment-icons/google-pay.svg" alt="Google Pay">
        </div>

        <a
          class="ichancy-crypto-button"
          href="https://myloae.com/en/home?m=account&t=deposit"
        >
          Buy Crypto
        </a>
      </section>
    `;

    pageContent.appendChild(section);
  }

  addCryptoSection();

  new MutationObserver(addCryptoSection).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
