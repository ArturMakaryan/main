(() => {
  const widgetTag = "scroll-welcome-banner";
  const containerSelector = '[data-mj="widget-info-panel-container"]';
  const headerSelector = '[data-mj="header"]';
  const stackingStyleId = "mrjindev-scroll-welcome-banner-stacking";
  const bannerImage = "https://cdn.jsdelivr.net/gh/arturvip1/main@main/assets/mrjindev-welcome-banner.png";
  const gsapUrl = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js";
  const splitTextUrl = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js";

  const loadExternalScript = (id, source) => new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = source;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });

  const ensureGsapSplitText = async () => {
    if (!window.gsap) await loadExternalScript("mrjindev-gsap", gsapUrl);
    if (!window.SplitText) await loadExternalScript("mrjindev-gsap-split-text", splitTextUrl);
    if (!window.gsap || !window.SplitText) return false;
    window.gsap.registerPlugin(window.SplitText);
    return true;
  };

  class ScrollWelcomeBanner extends HTMLElement {
    constructor() {
      super();
      this.scrollQueued = false;
      this.hasRevealedText = false;
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
        this.updateBackgroundMotion();
        this.observeTextReveal();
      }
    }

    disconnectedCallback() {
      window.removeEventListener("scroll", this.onScroll);
      this.reducedMotion.removeEventListener?.("change", this.onMotionChange);
      this.textObserver?.disconnect();
      this.textAnimation?.kill();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            height: 400px;
          }

          *, *::before, *::after { box-sizing: border-box; }

          .banner {
            position: relative;
            display: grid;
            width: 100%;
            height: 400px;
            overflow: hidden;
            isolation: isolate;
            color: #fff;
            transform: translateY(0) scale(1);
            transform-origin: center;
            opacity: 1;
            will-change: transform, opacity;
          }

          .background, .shade { position: absolute; inset: 0; z-index: -1; }
          .background { background: center / cover no-repeat url("${bannerImage}"); }
          .shade { display: none; }
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
          a { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 13px 25px; border: 1px solid rgba(255, 255, 255, .82); border-radius: 999px; background: transparent; box-shadow: none; color: #fff; font-size: 16px; font-weight: 800; text-decoration: none; transition: transform .18s ease, filter .18s ease; }
          a:hover { filter: brightness(1.12); transform: translateY(-2px); }
          a:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }

          @media (max-width: 640px) {
            .background { background-position: 38% center; }
            .content { padding-inline: 22px; }
          }

        </style>
        <section class="banner" aria-label="Casino welcome offer">
          <div class="background"></div>
          <div class="shade"></div>
          <div class="content">
            <h2 data-word-reveal>Claim your welcome bonus</h2>
            <p data-word-reveal>Your next winning moment starts here. Play top casino games and unlock exclusive rewards.</p>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Play now</a>
          </div>
        </section>
      `;
      this.banner = this.shadowRoot.querySelector(".banner");
    }

    observeTextReveal() {
      if (this.reducedMotion.matches || !("IntersectionObserver" in window)) return;
      this.textObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this.textObserver.disconnect();
        this.revealText();
      }, { threshold: 0.35 });
      this.textObserver.observe(this);
    }

    async revealText() {
      if (this.hasRevealedText || this.reducedMotion.matches) return;
      try {
        if (!(await ensureGsapSplitText())) return;
        const textElements = [...this.shadowRoot.querySelectorAll("[data-word-reveal]")];
        const splits = textElements.map((element) => new window.SplitText(element, { type: "words" }));
        const words = splits.flatMap((split) => split.words);
        this.hasRevealedText = true;
        this.textAnimation = window.gsap.from(words, {
          opacity: 0,
          y: 30,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out"
        });
      } catch {
        // Keep the original, visible text when external animation assets are unavailable.
      }
    }

    onScroll() {
      if (this.scrollQueued) return;
      this.scrollQueued = true;
      requestAnimationFrame(() => {
        this.scrollQueued = false;
        this.updateBackgroundMotion();
      });
    }

    onMotionChange() {
      this.updateBackgroundMotion();
      if (this.reducedMotion.matches) {
        this.textAnimation?.progress(1).kill();
      } else {
        this.observeTextReveal();
      }
    }

    updateBackgroundMotion() {
      if (!this.banner) return;
      if (this.reducedMotion.matches) {
        this.banner.style.transform = "none";
        this.banner.style.opacity = "1";
        return;
      }

      const bannerRect = this.getBoundingClientRect();
      const headerHeight = document.querySelector(headerSelector)?.getBoundingClientRect().height || 72;
      const fadeDistance = Math.max(1, ((bannerRect.height / 2) - headerHeight) * 1.55);
      const earlyStart = 16;
      const progress = Math.min(1, Math.max(0, (-bannerRect.top + earlyStart) / fadeDistance));
      this.banner.style.transform = `translateY(${progress * 25}%)`;
      this.banner.style.opacity = String(1 - progress);
    }

  }

  if (!customElements.get(widgetTag)) customElements.define(widgetTag, ScrollWelcomeBanner);

  const ensureStackingStyles = () => {
    if (document.getElementById(stackingStyleId)) return;
    const style = document.createElement("style");
    style.id = stackingStyleId;
    style.textContent = `
      ${containerSelector} { isolation: isolate; }
      ${containerSelector} > ${widgetTag} { position: relative; z-index: 0; }
      ${containerSelector} > :not(${widgetTag}) { position: relative; z-index: 1; }
    `;
    document.head.append(style);
  };

  const mountBanner = () => {
    const container = document.querySelector(containerSelector);
    if (!container) return false;
    ensureStackingStyles();
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
