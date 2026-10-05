(() => {
  "use strict";

  const FOOTER_SELECTOR = '[data-mj="footer"]';
  const PROJECT_BASE = "https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Velspin/";
  const ASSET = `${PROJECT_BASE}assets/`;
  const footerMarkup = (asset) => `
    <footer class="vf-footer">
      <div class="vf-inner">
        <div class="vf-body">
          <div class="vf-brand">
            <a class="vf-logo" href="#anasayfa" aria-label="Velspin ana sayfa"><img src="${asset}logo.png" alt="Velspin"></a>
            <p class="vf-copy">velspin.com, Feel So Good Limited tarafından işletilmektedir. Şirket numarası 16205 olup, Hamchako, Mutsamudu, Anjouan Özerk Adası, Komorlar Birliği adresinde kayıtlıdır. Anjouan Offshore Authority tarafından verilen ALSI-202605014-FI1 lisans numarası ile faaliyet göstermektedir.</p>
          </div>
          <div class="vf-cols">
            <div class="vf-col"><button class="vf-title" type="button" aria-expanded="false">Kurumsal <i></i></button><div class="vf-list"><a href="https://velspin.org/y/tr/general-rules">KULLANIM ŞARTLARI</a><a href="https://velspin.org/y/tr/sport-bet-rules">SPOR BAHİS KURALLARI</a><a href="https://velspin.org/y/tr/responsible-gaming">SORUMLU KUMAR POLİTİKASI</a><a href="https://velspin.org/y/tr/privacy-policy">GİZLİLİK POLİTİKASI VE KİŞİSEL VERİLERİN KORUNMASI</a><a href="https://velspin.org/y/tr/kyc-policy">KYC POLİTİKASI</a></div></div>
            <div class="vf-col"><button class="vf-title" type="button" aria-expanded="false">İçeriklerimiz <i></i></button><div class="vf-list"><a href="https://velspin.org/y/tr/sportsbook/demo">Bahis</a><a href="https://velspin.org/y/tr/livecasino">Canlı Casino</a></div></div>
            <div class="vf-col"><button class="vf-title" type="button" aria-expanded="false">Ortaklık <i></i></button><div class="vf-list"><a href="https://velspin.org/ortaklik">AFFILIATE ve Reklam</a><a href="https://velspin.org/y/tr/promotions">Promosyonlar</a></div></div>
            <div class="vf-col"><button class="vf-title" type="button" aria-expanded="false">Sosyal Medya <i></i></button><div class="vf-list"><a href="https://t.me/velspin"><img src="${asset}social/telegram.gif" alt="">Telegram</a><a href="https://x.com/velspin"><img src="${asset}social/twitter.gif" alt="">Twitter</a><a href="https://instagram.com/velspin"><img src="${asset}social/instagram.gif" alt="">Instagram</a></div></div>
          </div>
        </div>
      </div>
      <div class="vf-badges"><img class="vf-partners" src="${asset}licenses/partners.svg" alt="Official team partners"><div class="vf-seals"><img src="${asset}licenses/anjouan-seal.svg" alt="Anjouan license"><img src="${asset}licenses/fifa.svg" alt="FIFA"><img src="${asset}licenses/18-plus.svg" alt="18+"><img src="${asset}licenses/gt.svg" alt="GT"></div><div class="vf-seals"><img src="${asset}licenses/game-check.png" alt="Gamecheck Trust Seal"></div><div class="vf-awards" aria-label="Awards"><div><img src="${asset}rewards/sigma-global.svg" alt="Sigma Global"><img src="${asset}rewards/best-casino-operator-2025.svg" alt="Best Casino Operator 2025"><img src="${asset}rewards/gaming-awards-winner-2025.svg" alt="Gaming Awards Winner 2025"><img src="${asset}rewards/best-gaming-innovation-2024.svg" alt="Best Gaming Innovation 2024"><img src="${asset}rewards/outstanding-casino-platform-2024.svg" alt="Outstanding Casino Platform 2024"><img src="${asset}rewards/sigma-global.svg" alt="" aria-hidden="true"><img src="${asset}rewards/best-casino-operator-2025.svg" alt="" aria-hidden="true"><img src="${asset}rewards/gaming-awards-winner-2025.svg" alt="" aria-hidden="true"><img src="${asset}rewards/best-gaming-innovation-2024.svg" alt="" aria-hidden="true"><img src="${asset}rewards/outstanding-casino-platform-2024.svg" alt="" aria-hidden="true"></div></div></div>
      <div class="vf-pay"><img src="${asset}payments.png" alt="Payment methods"></div><div class="vf-providers"><img src="${asset}providers.png" alt="Game providers"></div>
    </footer>
    <button class="vf-chat" type="button" aria-label="Open chat" aria-expanded="false"><img src="${asset}chat-icon.svg" alt=""></button>
    <div class="vf-chat-panel" aria-hidden="true"><h2>Chat</h2><p>Merhaba! Size nasıl yardımcı olabiliriz?</p></div>
    <div class="vf-modal" aria-hidden="true"><form><h2>Geri bildirim</h2><p>Mesajınızı bize iletin.</p><label>Mesaj<textarea required></textarea></label><div class="vf-actions"><button type="button" data-close>İptal</button><button type="submit">Gönder</button></div><p data-status hidden></p></form></div>`;

  function mount(target) {
    if (!target || target.shadowRoot) return;

    // Neutralize platform styles applied to the host itself, including rules
    // such as [data-mj="footer"] { padding, background, border, box-shadow }.
    const hostReset = {
      all: "initial",
      display: "block",
      width: "100%",
      margin: "0",
      padding: "0",
      border: "0",
      background: "transparent",
      boxShadow: "none",
      color: "initial",
      font: "initial"
    };
    Object.entries(hostReset).forEach(([property, value]) => {
      target.style.setProperty(property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`), value, "important");
    });

    const root = target.attachShadow({ mode: "open" });
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${PROJECT_BASE}footer.css`;
    root.append(link);
    const wrap = document.createElement("div");
    wrap.innerHTML = footerMarkup(ASSET);
    root.append(wrap);
    root.querySelector(".vf-providers").style.setProperty("margin-bottom", "40px", "important");
    const cols = [...root.querySelectorAll(".vf-col")];
    const mobile = matchMedia("(max-width: 768px)");
    const sync = () => cols.forEach((col, index) => { const list = col.querySelector(".vf-list"), button = col.querySelector(".vf-title"), open = mobile.matches ? col.classList.contains("is-open") : true; list.hidden = !open; button.setAttribute("aria-expanded", String(open)); if (mobile.matches && index === 0 && !cols.some(c => c.classList.contains("is-open"))) col.classList.add("is-open"); });
    cols.forEach(col => col.querySelector(".vf-title").addEventListener("click", () => { if (!mobile.matches) return; cols.forEach(c => c.classList.remove("is-open")); col.classList.add("is-open"); sync(); }));
    mobile.addEventListener("change", sync); sync();
    const modal = root.querySelector(".vf-modal"), chat = root.querySelector(".vf-chat-panel"), chatButton = root.querySelector(".vf-chat");
    const closeModal = () => { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    root.querySelector("form").addEventListener("submit", event => { event.preventDefault(); const status = root.querySelector("[data-status]"); status.hidden = false; status.textContent = "Geri bildiriminiz alındı. Teşekkürler."; event.target.reset(); setTimeout(closeModal, 900); });
    root.querySelector("[data-close]").addEventListener("click", closeModal);
    chatButton.addEventListener("click", () => { const open = !chat.classList.contains("is-open"); chat.classList.toggle("is-open", open); chat.setAttribute("aria-hidden", String(!open)); chatButton.setAttribute("aria-expanded", String(open)); });
  }

  const start = () => { const target = document.querySelector(FOOTER_SELECTOR); if (target) mount(target); else new MutationObserver((_, observer) => { const node = document.querySelector(FOOTER_SELECTOR); if (node) { observer.disconnect(); mount(node); } }).observe(document.documentElement, { childList: true, subtree: true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
})();
