(() => {
  const script = document.currentScript;
  if (!script?.src) return;

  const projectBase = new URL("./", script.src);
  const assetBase = new URL("assets/", projectBase);
  const asset = (path) => new URL(path, assetBase).href;

  const stylesheetUrl = new URL("styles.css", projectBase).href;
  if (!document.querySelector(`link[href="${stylesheetUrl}"]`)) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = stylesheetUrl;
    stylesheet.dataset.velspinFooterStyles = "";
    document.head.append(stylesheet);
  }

  const markup = `
    <div class="velspin-inner">
      <div class="velspin-body">
        <div class="velspin-brand">
          <a class="velspin-logo" href="#anasayfa" aria-label="Velspin ana sayfa">
            <img src="${asset("logo.png")}" alt="Velspin">
          </a>
          <p class="velspin-copy">
            Velspin.com, Feel So Good Limited tarafından işletilmektedir. Şirket numarası 16205 olup, Hamchako, Mutsamudu, Anjouan Özerk Adası, Komorlar Birliği adresinde kayıtlıdır. Anjouan Özerk Adası, Komorlar Birliği yasaları kapsamında, Anjouan Offshore Authority (AOA) tarafından verilen ALSI-202605014-FI1 lisans numarası ile faaliyet göstermektedir
          </p>
        </div>

        <div class="velspin-cols">
          <div class="velspin-col">
            <button class="velspin-title" type="button" aria-expanded="false">Kurumsal <i></i></button>
            <div class="velspin-list">
              <a href="#kullanim-sartlari">Kullanım Şartları</a>
              <a href="#para-yatirma">Para Yatırma</a>
              <a href="#para-cekme">Para Çekme</a>
              <a href="#rng">Adaletli Oyun ve RNG Test Metodları</a>
              <a href="#kyc">KYC Politikaları</a>
              <a href="#hesaplar">Hesaplar, Ödemeler ve Bonuslar</a>
            </div>
          </div>
          <div class="velspin-col">
            <button class="velspin-title" type="button" aria-expanded="false">İçeriklerimiz <i></i></button>
            <div class="velspin-list">
              <a href="#bahis">Bahis</a>
              <a href="#canli-bahis">Canlı Bahis</a>
              <a href="#canli-casino">Canlı Casino</a>
              <a href="#slot">Slot</a>
              <a href="#zeplin">Zeplin</a>
              <a href="#crash">Crash</a>
            </div>
          </div>
          <div class="velspin-col">
            <button class="velspin-title" type="button" aria-expanded="false">Ortaklık <i></i></button>
            <div class="velspin-list">
              <a href="#affiliate">AFFILIATE ve Reklam</a>
              <a href="#promosyonlar">Promosyonlar</a>
              <a href="#bayilik">Bayilik-Ortaklık Kayıt</a>
            </div>
          </div>
          <div class="velspin-col">
            <button class="velspin-title" type="button" aria-expanded="false">Sosyal Medya <i></i></button>
            <div class="velspin-list">
              <a href="#telegram"><img src="${asset("social/telegram.gif")}" alt=""> telegram</a>
              <a href="#twitter"><img src="${asset("social/twitter.gif")}" alt=""> twitter</a>
              <a href="#instagram"><img src="${asset("social/instagram.gif")}" alt=""> instagram</a>
              <a href="#youtube"><img src="${asset("social/youtube.gif")}" alt=""> youtube</a>
              <a href="#android"><img src="${asset("social/android.gif")}" alt=""> android</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="velspin-badges">
      <img class="velspin-partners" src="${asset("licenses/partners.svg")}" alt="Takımları resmi partneri: US Sassuolo, Deportivo Armenio, Shanghai Port FC">
      <div class="velspin-seals">
        <a href="#anjouan"><img src="${asset("licenses/anjouan-seal.svg")}" alt="Anjouan lisans doğrulama"></a>
        <img src="${asset("licenses/fifa.svg")}" alt="FIFA">
        <img src="${asset("licenses/18-plus.svg")}" alt="18+">
        <img src="${asset("licenses/gt.svg")}" alt="GT">
      </div>
      <div class="velspin-seals">
        <a href="#gamecheck"><img src="${asset("licenses/game-check.png")}" alt="Gamecheck Trust SEAL"></a>
      </div>
      <div class="velspin-awards" aria-label="Ödüller">
        <div>
          <img src="${asset("rewards/sigma-global.svg")}" alt="Sigma Global">
          <img src="${asset("rewards/best-casino-operator-2025.svg")}" alt="Winner Best Casino Operator 2025">
          <img src="${asset("rewards/gaming-awards-winner-2025.svg")}" alt="Gaming Awards Winner 2025">
          <img src="${asset("rewards/best-gaming-innovation-2024.svg")}" alt="Winner Best Gaming Innovation Award 2024">
          <img src="${asset("rewards/outstanding-casino-platform-2024.svg")}" alt="Winner Outstanding Casino Platform Award 2024">
          <img src="${asset("rewards/sigma-global.svg")}" alt="" aria-hidden="true">
          <img src="${asset("rewards/best-casino-operator-2025.svg")}" alt="" aria-hidden="true">
          <img src="${asset("rewards/gaming-awards-winner-2025.svg")}" alt="" aria-hidden="true">
          <img src="${asset("rewards/best-gaming-innovation-2024.svg")}" alt="" aria-hidden="true">
          <img src="${asset("rewards/outstanding-casino-platform-2024.svg")}" alt="" aria-hidden="true">
        </div>
      </div>
    </div>

    <div class="velspin-pay"><img src="${asset("payments.png")}" alt="Ödeme yöntemleri"></div>
    <div class="velspin-providers"><img src="${asset("providers.png")}" alt="Oyun sağlayıcıları"></div>
  `;

  const initialize = (footer) => {
    const columns = [...footer.querySelectorAll(".velspin-col")];
    const media = matchMedia("(max-width: 768px)");

    const sync = () => {
      const mobile = media.matches;
      columns.forEach((column, index) => {
        const button = column.querySelector(".velspin-title");
        const list = column.querySelector(".velspin-list");
        if (!mobile) {
          column.classList.remove("is-open");
          list.hidden = false;
          button.setAttribute("aria-expanded", "true");
          return;
        }

        if (index === 0 && !columns.some((item) => item.classList.contains("is-open"))) {
          column.classList.add("is-open");
        }
        const open = column.classList.contains("is-open");
        button.setAttribute("aria-expanded", String(open));
        list.hidden = !open;
      });
    };

    columns.forEach((column) => {
      column.querySelector(".velspin-title").addEventListener("click", () => {
        if (!media.matches) return;
        const open = !column.classList.contains("is-open");
        columns.forEach((item) => item.classList.remove("is-open"));
        if (open) column.classList.add("is-open");
        sync();
      });
    });

    media.addEventListener("change", sync);
    sync();
  };

  const mount = () => {
    const footer = document.querySelector('[data-mj="footer"]');
    if (!footer || footer.querySelector(".velspin-inner")) return;

    footer.classList.add("velspin-footer");
    footer.dataset.velspinFooter = "";
    footer.innerHTML = markup;
    initialize(footer);
  };

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();
})();
