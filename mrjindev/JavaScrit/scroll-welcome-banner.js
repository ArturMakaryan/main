(() => {
  const widgetTag = "scroll-welcome-banner";
  const containerSelector = '[data-mj="widget-info-panel-container"]';
  const bannerImage = "https://cdn.jsdelivr.net/gh/arturvip1/main@main/assets/mrjindev-welcome-banner.png";
  const scrollThreshold = 12;

  class ScrollWelcomeBanner extends HTMLElement {
    constructor() {
      super();
      this.isHidden = false;
      this.lastScrollY = window.scrollY;
      this.scrollQueued = false;
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.onScroll = this.onScroll.bind(this);
      this.onMotionChange = this.onMotionChange.bind(this);
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        this.render();
        window.addEventListener("scroll", this.onScroll, { passive: true });
        this.reducedMotion.addEventListener?.("change", this.onMotionChange);
      }
    }

    disconnectedCallback() {
      window.removeEventListener("scroll", this.onScroll);
      this.reducedMotion.removeEventListener?.("change", this.onMotionChange);
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            height: 400px;
            margin-block-end: 0;
            overflow: clip;
            transition: margin-block-end 300ms cubic-bezier(.22, 1, .36, 1);
          }

          *, *::before, *::after { box-sizing: border-box; }

          .banner {
            position: relative;
            display: grid;
            width: 100%;
            height: 400px;
            overflow: hidden;
            isolation: isolate;
            background: #0c0a15;
            color: #fff;
            transform: translateY(0);
            opacity: 1;
            transition: transform 300ms cubic-bezier(.22, 1, .36, 1), opacity 300ms cubic-bezier(.22, 1, .36, 1);
            will-change: transform, opacity;
          }

          :host(.is-hidden) { margin-block-end: -400px; }
          :host(.is-hidden) .banner { transform: translateY(-100%); opacity: 0; pointer-events: none; }

          .background, .shade { position: absolute; inset: 0; z-index: -1; }
          .background { background: center / cover no-repeat url("${bannerImage}"); }
          .shade { background: linear-gradient(90deg, rgba(4, 3, 11, .58), rgba(4, 3, 11, .08) 50%, rgba(4, 3, 11, .55)); }
          .content {
            display: grid;
            place-content: center;
            justify-items: center;
            max-width: 720px;
            margin: auto;
            padding: 36px 24px;
            text-align: center;
          }

          h2 { margin: 0; font-size: clamp(32px, 4vw, 58px); font-weight: 850; letter-spacing: -.04em; line-height: .98; text-shadow: 0 5px 24px rgba(0, 0, 0, .5); }
          p { max-width: 590px; margin: 16px 0 24px; color: rgba(255, 255, 255, .86); font-size: clamp(15px, 1.55vw, 20px); line-height: 1.45; text-shadow: 0 2px 13px rgba(0, 0, 0, .55); }
          a { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 13px 25px; border-radius: 999px; background: linear-gradient(105deg, #b56cff, #7545f5); box-shadow: 0 10px 26px rgba(66, 26, 157, .5), inset 0 1px 0 rgba(255, 255, 255, .35); color: #fff; font-size: 16px; font-weight: 800; text-decoration: none; transition: transform .18s ease, filter .18s ease; }
          a:hover { filter: brightness(1.12); transform: translateY(-2px); }
          a:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }

          @media (max-width: 640px) {
            .background { background-position: 38% center; }
            .shade { background: linear-gradient(90deg, rgba(4, 3, 11, .7), rgba(4, 3, 11, .2), rgba(4, 3, 11, .7)); }
            .content { padding-inline: 22px; }
          }

          @media (prefers-reduced-motion: reduce) {
            :host, .banner, a { transition: none; }
          }
        </style>
        <section class="banner" aria-label="Casino welcome offer">
          <div class="background"></div>
          <div class="shade"></div>
          <div class="content">
            <h2>Claim your welcome bonus</h2>
            <p>Your next winning moment starts here. Play top casino games and unlock exclusive rewards.</p>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Play now</a>
          </div>
        </section>
      `;
    }

    onScroll() {
      if (this.scrollQueued) return;
      this.scrollQueued = true;
      requestAnimationFrame(() => {
        this.scrollQueued = false;
        const currentScrollY = Math.max(0, window.scrollY);
        const scrollDelta = currentScrollY - this.lastScrollY;

        if (currentScrollY === 0) {
          this.setHidden(false);
        } else if (scrollDelta > scrollThreshold) {
          this.setHidden(true);
        } else if (scrollDelta < -scrollThreshold) {
          this.setHidden(false);
        }

        this.lastScrollY = currentScrollY;
      });
    }

    onMotionChange() {
      this.style.transition = this.reducedMotion.matches ? "none" : "";
    }

    setHidden(shouldHide) {
      if (this.isHidden === shouldHide) return;
      this.isHidden = shouldHide;
      this.classList.toggle("is-hidden", shouldHide);
    }
  }

  if (!customElements.get(widgetTag)) customElements.define(widgetTag, ScrollWelcomeBanner);

  const mountBanner = () => {
    const container = document.querySelector(containerSelector);
    if (!container) return false;
    let banner = container.querySelector(`:scope > ${widgetTag}`);
    if (!banner) {
      banner = document.createElement(widgetTag);
      container.prepend(banner);
    } else if (container.firstElementChild !== banner) {
      container.prepend(banner);
    }
    return true;
  };

  let mountQueued = false;
  const scheduleMount = () => {
    if (mountQueued) return;
    mountQueued = true;
    requestAnimationFrame(() => {
      mountQueued = false;
      mountBanner();
    });
  };

  mountBanner();
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();
