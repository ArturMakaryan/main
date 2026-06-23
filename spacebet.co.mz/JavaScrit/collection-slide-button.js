(() => {
  const widgetTag = "collection-slide-button";
  const targetSelector = '[data-mj="widget-collection-slider-item"] a[href*="M0I_nusV4q8"]';

  class CollectionSlideButton extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;

      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `
        <style>
          :host {
            position: absolute;
            bottom: 12px;
            left: 12px;
            z-index: 20;
            display: block;
          }

          .btn-142 {
            --bg-color: #ffffff;
            --color: #000000;
            width: 140px;
            height: 40px;
            padding: 0;
            color: var(--color);
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: none;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            cursor: pointer;
            user-select: none;
            transition-duration: 0.2s;
          }

          .btn-142 span {
            position: relative;
            z-index: 11;
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            background: var(--bg-color);
            border-radius: 7px;
          }

          .btn-142::before,
          .btn-142::after {
            content: "";
            position: absolute;
            top: -2px;
            left: -2px;
            z-index: -1;
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            border-radius: 10px;
            background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
            background-size: 400%;
            animation: move-142 20s linear infinite;
          }

          .btn-142::after {
            filter: blur(50px);
          }

          .btn-142:focus-visible {
            outline: 2px solid #76edff;
            outline-offset: 4px;
          }

          @keyframes move-142 {
            0%,
            100% {
              background-position: 0 0;
            }

            50% {
              background-position: 400% 0;
            }
          }
        </style>

        <a class="btn-142" href="https://mrjindev.com/en/" target="_blank" rel="noopener noreferrer">
          <span>Explore more</span>
        </a>
      `;
    }
  }

  if (!customElements.get(widgetTag)) {
    customElements.define(widgetTag, CollectionSlideButton);
  }

  const mountWidget = () => {
    const targetLink = document.querySelector(targetSelector);
    const targetSlide = targetLink?.closest('[data-mj="widget-collection-slider-item"]');

    if (!targetSlide || targetSlide.querySelector(widgetTag)) return Boolean(targetSlide);

    targetSlide.append(document.createElement(widgetTag));
    return true;
  };

  let mountScheduled = false;
  const scheduleMount = () => {
    if (mountScheduled) return;

    mountScheduled = true;
    requestAnimationFrame(() => {
      mountScheduled = false;
      mountWidget();
    });
  };

  mountWidget();

  const observer = new MutationObserver(scheduleMount);

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
