(() => {
  const widgetTag = "test-collection-widget";
  const slideSelector = '[data-mj="widget-collection-slider-item"]';

  const normalizeText = (value) => value?.trim().toLowerCase() || "";

  class TestCollectionWidget extends HTMLElement {
    set config(value) {
      this._config = value;

      if (this.isConnected) this.render();
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }

      this.render();
    }

    render() {
      const config = this._config;

      if (!config) return;

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            height: 100%;
          }

          * {
            box-sizing: border-box;
          }

          .collection {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            width: 100%;
            height: 100%;
            min-height: 280px;
            overflow: hidden;
            color: #fff;
            background: #151923;
            border-radius: inherit;
            isolation: isolate;
          }

          .hero {
            position: absolute;
            inset: 0;
            z-index: -2;
            background-position: center;
            background-size: cover;
            transform: scale(1.02);
          }

          .shade {
            position: absolute;
            inset: 0;
            z-index: -1;
            background: linear-gradient(180deg, rgba(5, 8, 16, 0.05) 18%, rgba(5, 8, 16, 0.45) 58%, rgba(5, 8, 16, 0.9) 100%);
          }

          .content {
            padding: 20px;
          }

          .title {
            margin: 0 0 14px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: clamp(22px, 2.3vw, 34px);
            font-weight: 800;
            line-height: 1;
            letter-spacing: 0;
            text-shadow: 0 4px 16px rgba(0, 0, 0, 0.58);
          }

          .games {
            display: flex;
            gap: 10px;
            overflow: hidden;
            max-height: 220px;
            opacity: 1;
            transform: translateY(0);
            transition: max-height 0.3s ease, opacity 0.22s ease, transform 0.3s ease;
          }

          .collection:not(.is-expanded) .games {
            max-height: 0;
            opacity: 0;
            transform: translateY(14px);
            pointer-events: none;
          }

          .game {
            flex: 0 0 min(31%, 145px);
            min-width: 84px;
            aspect-ratio: 0.72;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 12px 22px rgba(0, 0, 0, 0.3);
          }

          .game img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .fallback-game {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 10px;
            background: linear-gradient(145deg, rgba(87, 29, 142, 0.95), rgba(16, 13, 39, 0.94));
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            font-weight: 700;
            text-align: center;
          }

          .open-link {
            position: absolute;
            inset: 0;
            z-index: 2;
          }

          .open-link:focus-visible {
            outline: 3px solid #76edff;
            outline-offset: -3px;
          }

          .toggle {
            position: absolute;
            top: 14px;
            right: 14px;
            z-index: 3;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            padding: 0;
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 10px;
            background: rgba(8, 12, 22, 0.5);
            cursor: pointer;
            backdrop-filter: blur(8px);
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .toggle:hover {
            background: rgba(8, 12, 22, 0.78);
          }

          .toggle:focus-visible {
            outline: 2px solid #76edff;
            outline-offset: 3px;
          }

          .toggle-icon {
            display: block;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 24px;
            line-height: 1;
            transform: rotate(0deg);
            transition: transform 0.3s ease;
          }

          .collection.is-expanded .toggle-icon {
            transform: rotate(180deg);
          }

          @media (max-width: 640px) {
            .collection {
              min-height: 250px;
            }

            .content {
              padding: 16px;
            }

            .title {
              margin-bottom: 10px;
            }

            .games {
              gap: 8px;
            }

            .game {
              min-width: 72px;
              border-radius: 8px;
            }
          }
        </style>

        <section class="collection">
          <div class="hero"></div>
          <div class="shade"></div>
          <div class="content">
            <h2 class="title"></h2>
            <div class="games"></div>
          </div>
          <button class="toggle" type="button" aria-expanded="false" aria-label="Show games">
            <span class="toggle-icon">⌄</span>
          </button>
          <a class="open-link" target="_blank" rel="noopener noreferrer" aria-label="Open collection"></a>
        </section>
      `;

      const root = this.shadowRoot;
      const hero = root.querySelector(".hero");
      const title = root.querySelector(".title");
      const games = root.querySelector(".games");
      const link = root.querySelector(".open-link");
      const toggle = root.querySelector(".toggle");

      if (config.hero) {
        hero.style.backgroundImage = `url("${config.hero}")`;
      }
      title.textContent = config.title;
      link.href = config.href;

      const gameSources = config.games.length ? config.games : [null, null, null];

      gameSources.slice(0, 3).forEach((source, index) => {
        const card = document.createElement("div");
        card.className = "game";

        const addFallback = () => {
          card.replaceChildren();

          const fallback = document.createElement("div");
          fallback.className = "fallback-game";
          fallback.textContent = `${config.title} ${index + 1}`;
          card.append(fallback);
        };

        if (source) {
          const image = document.createElement("img");
          image.src = source;
          image.alt = "";
          image.addEventListener("error", addFallback, { once: true });
          card.append(image);
        } else {
          addFallback();
        }

        games.append(card);
      });

      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._expanded = !this._expanded;
        this.updateExpandedState();
      });

      this.updateExpandedState();
    }

    updateExpandedState() {
      const collection = this.shadowRoot?.querySelector(".collection");
      const toggle = this.shadowRoot?.querySelector(".toggle");

      if (!collection || !toggle) return;

      const isExpanded = Boolean(this._expanded);
      collection.classList.toggle("is-expanded", isExpanded);
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggle.setAttribute("aria-label", isExpanded ? "Hide games" : "Show games");
    }
  }

  if (!customElements.get(widgetTag)) {
    customElements.define(widgetTag, TestCollectionWidget);
  }

  const getImageSource = (image) => image.currentSrc || image.src;

  const findTargetSlide = () => {
    const slides = [...document.querySelectorAll(slideSelector)];

    return slides.find((slide) => {
      if (slide.dataset.testCollectionWidget === "true") return true;

      return normalizeText(slide.querySelector("strong")?.textContent) === "test";
    });
  };

  const getCollectionData = (slide) => {
    const sourceLink = slide.querySelector("a");
    const images = sourceLink ? [...sourceLink.querySelectorAll("img")] : [];

    return {
      title: sourceLink?.querySelector("strong")?.textContent.trim() || "Test",
      href: sourceLink?.href || "https://mrjindev.com/en/",
      hero: images[0] ? getImageSource(images[0]) : "",
      games: images.slice(1).map(getImageSource).filter(Boolean)
    };
  };

  const mountWidget = () => {
    const targetSlide = findTargetSlide();

    if (!targetSlide) return false;

    targetSlide.style.position = "relative";
    targetSlide.style.overflow = "hidden";

    if (targetSlide.querySelector(widgetTag)) return true;

    const widget = document.createElement(widgetTag);
    widget.config = getCollectionData(targetSlide);
    targetSlide.dataset.testCollectionWidget = "true";
    targetSlide.replaceChildren(widget);
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
