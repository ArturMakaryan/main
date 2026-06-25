(() => {
  const widgetTag = "stories-widget";
  const containerSelector = '[data-mj="widget-info-panel-container"]';
  const slideDuration = 5000;
  const viewedStoriesStorageKey = "mrjindev-stories-viewed-v1";

  /*
   * Change this public URL after uploading the image to the MrjinDev asset
   * host. Each story may contain any number of slides, and a CTA is optional.
   */
  const commonStoryImage = "https://cdn.jsdelivr.net/gh/arturvip1/main@52a5590/assets/mrjindev-casino-night.png";
  const additionalStoryImages = [
    "https://i.pinimg.com/736x/85/dc/0c/85dc0c13949d785165cb202be2d1616d.jpg",
    "https://i.pinimg.com/1200x/c4/e1/38/c4e1383a7e47c89d7b44fc1754d4ddbe.jpg",
    "https://i.pinimg.com/736x/85/71/b6/8571b6b7b0f1ac3c5766dec5657ab5c5.jpg",
    "https://i.pinimg.com/736x/11/c8/c5/11c8c51f779299b09017cac7986b37d3.jpg"
  ];

  const STORIES = [
    {
      title: "Reload",
      icon: "🎁",
      thumbnail: commonStoryImage,
      slides: [
        {
          image: commonStoryImage,
          alt: "Reload bonus",
          cta: { label: "Let's GO!", href: "https://mrjindev.com/en/" }
        },
        { image: additionalStoryImages[0], alt: "Reload promotion" }
      ]
    },
    {
      title: "Program",
      icon: "👑",
      thumbnail: commonStoryImage,
      slides: [
        { image: commonStoryImage, alt: "Program rewards" },
        { image: additionalStoryImages[1], alt: "Program promotion" }
      ]
    },
    {
      title: "Races",
      icon: "🏆",
      thumbnail: commonStoryImage,
      slides: [
        { image: commonStoryImage, alt: "Races" },
        { image: additionalStoryImages[2], alt: "Races promotion" }
      ]
    },
    {
      title: "Lootboxes",
      icon: "🎁",
      thumbnail: commonStoryImage,
      slides: [
        { image: commonStoryImage, alt: "Lootboxes" },
        { image: additionalStoryImages[3], alt: "Lootboxes promotion" }
      ]
    }
  ];

  const isSafeUrl = (value) => {
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  };

  class StoriesWidget extends HTMLElement {
    constructor() {
      super();
      this.storyIndex = 0;
      this.slideIndex = 0;
      this.timerId = null;
      this.animationFrameId = null;
      this.startedAt = 0;
      this.elapsed = 0;
      this.isOpen = false;
      this.previousFocus = null;
      this.previousBodyOverflow = "";
      this.swipeStart = null;
      this.isTransitioning = false;
      this.viewedStories = this.getViewedStories();
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      this.onKeydown = this.onKeydown.bind(this);
      this.onVisibilityChange = this.onVisibilityChange.bind(this);
      this.onMotionChange = this.onMotionChange.bind(this);
      this.onPointerDown = this.onPointerDown.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
      this.onResize = this.onResize.bind(this);
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        this.render();
        window.addEventListener("resize", this.onResize);
      }
    }

    disconnectedCallback() {
      this.stopPlayback();
      document.removeEventListener("keydown", this.onKeydown, true);
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.reducedMotion.removeEventListener?.("change", this.onMotionChange);
      window.removeEventListener("resize", this.onResize);
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; width: 100%; color: #f8f8fb; font-family: Inter, Arial, Helvetica, sans-serif; }
          *, *::before, *::after { box-sizing: border-box; }
          button, a { font: inherit; }

          .rail { display: flex; gap: clamp(16px, 2.6vw, 34px); width: 100%; padding: 8px 4px 12px; overflow-x: auto; scrollbar-width: none; }
          .rail::-webkit-scrollbar { display: none; }
          .story-trigger { flex: 0 0 88px; display: grid; gap: 9px; justify-items: center; padding: 0; color: #f8f8fb; border: 0; background: transparent; cursor: pointer; }
          .story-trigger:focus-visible { outline: 2px solid #a970ff; outline-offset: 5px; border-radius: 12px; }
          .story-avatar { position: relative; display: grid; place-items: center; width: 76px; height: 76px; overflow: hidden; border: 1px solid #5a5d66; border-radius: 50%; background: #1b1d24; box-shadow: none; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
          .story-trigger.is-unseen .story-avatar { border-color: #c86dff; box-shadow: 0 0 0 1px rgba(215, 109, 255, .52); }
          .story-trigger:hover .story-avatar { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0, 0, 0, .4); }
          .story-trigger.is-unseen:hover .story-avatar { box-shadow: 0 0 0 1px rgba(215, 109, 255, .76), 0 10px 22px rgba(56, 24, 135, .45); }
          .story-avatar img { position: absolute; inset: 3px; width: calc(100% - 6px); height: calc(100% - 6px); border-radius: 50%; object-fit: cover; }
          .story-avatar span { font-size: 35px; line-height: 1; filter: drop-shadow(0 3px 5px rgba(0,0,0,.32)); }
          .story-label { max-width: 104px; overflow: hidden; font-size: 14px; font-weight: 300; line-height: 1.15; text-align: center; text-overflow: ellipsis; white-space: nowrap; }

          .modal { position: fixed; inset: 0; z-index: 2147483647; display: none; place-items: center; width: 100vw; max-width: none; height: 100vh; max-height: none; margin: 0; padding: 24px; border: 0; background: transparent; color: inherit; }
          .modal.is-open { display: grid; }
          .modal::backdrop { background: transparent; }
          .backdrop { position: absolute; inset: 0; background: rgba(4, 4, 8, .83); backdrop-filter: blur(4px); }
          .story-stage { position: relative; z-index: 1; width: min(100%, 1440px); height: min(92vh, 920px); min-height: 440px; perspective: 1600px; }
          .viewer { position: absolute; top: 50%; left: 50%; z-index: 3; width: min(31vw, 540px); height: 100%; min-height: 440px; overflow: hidden; isolation: isolate; border: 1px solid rgba(255,255,255,.14); border-radius: 28px; background: #151126; box-shadow: 0 28px 80px rgba(0,0,0,.62); transform: translate(-50%, -50%); transform-style: preserve-3d; touch-action: pan-y; }
          .neighbours { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
          .deck-transition-layer { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
          .deck-transition-card { position: absolute !important; margin: 0; transform: none !important; transition: left .38s cubic-bezier(.22,.8,.24,1), top .38s cubic-bezier(.22,.8,.24,1), width .38s cubic-bezier(.22,.8,.24,1), height .38s cubic-bezier(.22,.8,.24,1), border-radius .38s cubic-bezier(.22,.8,.24,1), opacity .24s ease; will-change: left, top, width, height, border-radius; }
          .story-peek { position: absolute; top: 50%; left: 50%; display: grid; place-items: end center; width: min(12vw, 216px); height: min(45vh, 390px); overflow: hidden; padding: 20px 12px; border: 0; border-radius: 18px; background: #151126; color: #fff; cursor: pointer; opacity: .44; pointer-events: auto; transform: translate(-50%, -50%) translateX(calc(var(--offset) * var(--deck-step, 320px))) scale(.82); transition: opacity .28s ease, transform .36s cubic-bezier(.2,.8,.2,1), filter .28s ease; }
          .story-peek::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,5,20,.32), rgba(7,5,20,.82)); }
          .story-peek:hover, .story-peek:focus-visible { opacity: .82; filter: brightness(1.08); transform: translate(-50%, -50%) translateX(calc(var(--offset) * var(--deck-step, 320px))) scale(.88); outline: 2px solid #a970ff; outline-offset: 4px; }
          .story-peek img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .story-peek-label { position: relative; z-index: 1; max-width: 100%; overflow: hidden; font-size: 15px; font-weight: 800; text-overflow: ellipsis; text-shadow: 0 2px 12px rgba(0,0,0,.8); white-space: nowrap; }
          .media, .media img, .media-fallback { position: absolute; inset: 0; width: 100%; height: 100%; }
          .media { z-index: 0; background: linear-gradient(155deg, #241064, #7143f4 52%, #d451e8); }
          .media img { display: block; object-fit: cover; }
          .media-fallback { display: grid; place-items: center; padding: 42px; background: radial-gradient(circle at 25% 21%, rgba(255,255,255,.22), transparent 20%), radial-gradient(circle at 75% 72%, rgba(255,109,242,.42), transparent 30%), linear-gradient(155deg, #20105c, #7145f5 52%, #c852e7); color: white; font-size: clamp(34px, 9vw, 52px); font-weight: 800; line-height: .98; text-align: center; text-shadow: 0 5px 24px rgba(0,0,0,.35); }
          .media.has-image .media-fallback { display: none; }
          .shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(7,5,20,.35), transparent 30%, transparent 61%, rgba(7,5,20,.66)); pointer-events: none; }
          .progress { position: absolute; top: 18px; right: 20px; left: 20px; z-index: 2; display: flex; gap: 7px; }
          .progress-segment { flex: 1; height: 4px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.38); }
          .progress-segment::after { content: ""; display: block; width: var(--progress, 0%); height: 100%; border-radius: inherit; background: #fff; transition: width .08s linear; }
          .progress-segment.is-complete::after { width: 100%; }
          .modal.reduce-motion .progress-segment::after { transition: none; }
          .story-meta { position: absolute; top: 35px; left: 22px; z-index: 2; display: flex; align-items: center; gap: 10px; min-width: 0; padding-right: 64px; }
          .story-meta-avatar { position: relative; display: grid; place-items: center; width: 39px; height: 39px; overflow: hidden; border: 2px solid rgba(255,255,255,.7); border-radius: 50%; background: #5736be; font-size: 19px; }
          .story-meta-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .story-title { overflow: hidden; font-size: 20px; font-weight: 760; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 10px rgba(0,0,0,.45); }
          .close, .navigation { position: absolute; z-index: 3; display: grid; place-items: center; border: 0; color: #fff; background: rgba(16, 11, 31, .38); cursor: pointer; backdrop-filter: blur(8px); }
          .close { top: 34px; right: 18px; width: 42px; height: 42px; border-radius: 50%; }
          .close::before, .close::after { content: ""; position: absolute; width: 25px; height: 3px; border-radius: 2px; background: currentColor; }
          .close::before { transform: rotate(45deg); } .close::after { transform: rotate(-45deg); }
          .navigation { top: 50%; width: 40px; height: 64px; border-radius: 14px; transform: translateY(-50%); }
          .navigation.previous { left: 12px; } .navigation.next { right: 12px; }
          .navigation::before { content: ""; width: 12px; height: 12px; border-top: 3px solid currentColor; border-right: 3px solid currentColor; }
          .navigation.previous::before { transform: rotate(-135deg); margin-left: 6px; } .navigation.next::before { transform: rotate(45deg); margin-right: 6px; }
          .close:hover, .navigation:hover { background: rgba(16, 11, 31, .67); }
          .close:focus-visible, .navigation:focus-visible, .cta:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
          .viewer-footer { position: absolute; right: 22px; bottom: 22px; left: 22px; z-index: 2; display: flex; align-items: center; justify-content: center; min-height: 54px; }
          .cta { display: none; max-width: 100%; padding: 14px 26px; color: #fff; border-radius: 999px; background: linear-gradient(100deg, #7751fb, #9b58f2); box-shadow: 0 9px 22px rgba(45, 19, 117, .55), inset 0 1px 0 rgba(255,255,255,.3); font-size: 18px; font-weight: 800; line-height: 1; text-align: center; text-decoration: none; }
          .cta.is-visible { display: inline-flex; }
          .modal[aria-hidden="true"] { visibility: hidden; }
          .viewer.cube-out-next { animation: cube-out-next .27s cubic-bezier(.55,.06,.68,.19) both; }
          .viewer.cube-in-next { animation: cube-in-next .35s cubic-bezier(.22,.8,.24,1) both; }
          .viewer.cube-out-previous { animation: cube-out-previous .27s cubic-bezier(.55,.06,.68,.19) both; }
          .viewer.cube-in-previous { animation: cube-in-previous .35s cubic-bezier(.22,.8,.24,1) both; }
          .cube-preview { display: none; }
          .viewer.deck-out-next { animation: deck-out-next .22s cubic-bezier(.55,.06,.68,.19) both; }
          .viewer.deck-in-next { animation: deck-in-next .32s cubic-bezier(.22,.8,.24,1) both; }
          .viewer.deck-out-previous { animation: deck-out-previous .22s cubic-bezier(.55,.06,.68,.19) both; }
          .viewer.deck-in-previous { animation: deck-in-previous .32s cubic-bezier(.22,.8,.24,1) both; }
          @keyframes cube-out-next { to { opacity: 0; transform: translate(-50%, -50%) rotateY(-90deg); } }
          @keyframes cube-in-next { from { opacity: 0; transform: translate(-50%, -50%) rotateY(90deg); } to { opacity: 1; transform: translate(-50%, -50%) rotateY(0); } }
          @keyframes cube-out-previous { to { opacity: 0; transform: translate(-50%, -50%) rotateY(90deg); } }
          @keyframes cube-in-previous { from { opacity: 0; transform: translate(-50%, -50%) rotateY(-90deg); } to { opacity: 1; transform: translate(-50%, -50%) rotateY(0); } }
          @keyframes deck-out-next { to { opacity: 0; transform: translate(-50%, -50%) translateX(-96px) scale(.93); } }
          @keyframes deck-in-next { from { opacity: 0; transform: translate(-50%, -50%) translateX(96px) scale(.93); } to { opacity: 1; transform: translate(-50%, -50%) translateX(0) scale(1); } }
          @keyframes deck-out-previous { to { opacity: 0; transform: translate(-50%, -50%) translateX(96px) scale(.93); } }
          @keyframes deck-in-previous { from { opacity: 0; transform: translate(-50%, -50%) translateX(-96px) scale(.93); } to { opacity: 1; transform: translate(-50%, -50%) translateX(0) scale(1); } }
          @media (max-width: 640px) { .rail { gap: 13px; padding-inline: 2px; } .story-trigger { flex-basis: 76px; } .story-avatar { width: 65px; height: 65px; border-width: 4px; } .story-avatar span { font-size: 29px; } .story-label { font-size: 14px; } .modal { padding: 0; } .story-stage { width: 100%; height: 100dvh; min-height: 0; perspective: 1100px; } .neighbours { display: none; } .viewer, .cube-preview { width: 100%; height: 100dvh; min-height: 0; border: 0; border-radius: 0; } .navigation { width: 34px; height: 54px; } .cube-preview { position: absolute; top: 50%; left: 50%; z-index: 2; display: block; overflow: hidden; background: #151126; color: #fff; pointer-events: none; transform: translate(-50%, -50%); transform-style: preserve-3d; backface-visibility: hidden; } .cube-preview-media, .cube-preview-media img, .cube-preview-shade { position: absolute; inset: 0; width: 100%; height: 100%; } .cube-preview-media { background: linear-gradient(155deg, #241064, #7143f4 52%, #d451e8); } .cube-preview-media img { display: block; object-fit: cover; } .cube-preview-shade { background: linear-gradient(180deg, rgba(7,5,20,.3), transparent 30%, transparent 61%, rgba(7,5,20,.65)); } .cube-preview-header { position: absolute; top: 33px; left: 22px; z-index: 1; display: flex; align-items: center; gap: 9px; font-size: 19px; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,.45); } .cube-preview-avatar { display: grid; place-items: center; width: 39px; height: 39px; overflow: hidden; border: 2px solid rgba(255,255,255,.7); border-radius: 50%; background: #5736be; font-size: 19px; } .cube-preview-avatar img { width: 100%; height: 100%; object-fit: cover; } .cube-preview.cube-preview-next { animation: cube-preview-in-next .35s cubic-bezier(.22,.8,.24,1) both; } .cube-preview.cube-preview-previous { animation: cube-preview-in-previous .35s cubic-bezier(.22,.8,.24,1) both; } @keyframes cube-preview-in-next { from { opacity: 0; transform: translate(-50%, -50%) rotateY(90deg); } to { opacity: 1; transform: translate(-50%, -50%) rotateY(0); } } @keyframes cube-preview-in-previous { from { opacity: 0; transform: translate(-50%, -50%) rotateY(-90deg); } to { opacity: 1; transform: translate(-50%, -50%) rotateY(0); } } }
        </style>
        <section class="rail" aria-label="Featured stories"></section>
        <dialog class="modal" aria-hidden="true" aria-label="Story viewer" aria-modal="true">
          <button class="backdrop" type="button" aria-label="Close story viewer"></button>
          <div class="story-stage">
            <div class="neighbours" aria-label="Other stories"></div>
            <div class="viewer" role="document">
            <div class="media"><img alt=""><div class="media-fallback"></div></div><div class="shade"></div>
            <div class="progress" aria-hidden="true"></div>
            <div class="story-meta"><div class="story-meta-avatar"></div><span class="story-title"></span></div>
            <button class="close" type="button" aria-label="Close story viewer"></button>
            <button class="navigation previous" type="button" aria-label="Previous slide"></button>
            <button class="navigation next" type="button" aria-label="Next slide"></button>
            <div class="viewer-footer"><a class="cta" target="_blank" rel="noopener noreferrer"></a></div>
            </div>
          </div>
        </dialog>
      `;

      this.rail = this.shadowRoot.querySelector(".rail");
      this.modal = this.shadowRoot.querySelector(".modal");
      this.stage = this.shadowRoot.querySelector(".story-stage");
      this.neighbours = this.shadowRoot.querySelector(".neighbours");
      this.viewer = this.shadowRoot.querySelector(".viewer");
      this.progress = this.shadowRoot.querySelector(".progress");
      this.media = this.shadowRoot.querySelector(".media");
      this.mediaImage = this.shadowRoot.querySelector(".media img");
      this.mediaFallback = this.shadowRoot.querySelector(".media-fallback");
      this.metaAvatar = this.shadowRoot.querySelector(".story-meta-avatar");
      this.storyTitle = this.shadowRoot.querySelector(".story-title");
      this.cta = this.shadowRoot.querySelector(".cta");
      this.closeButton = this.shadowRoot.querySelector(".close");

      STORIES.forEach((story, index) => this.rail.append(this.createStoryTrigger(story, index)));
      this.shadowRoot.querySelector(".backdrop").addEventListener("click", () => this.close());
      this.modal.addEventListener("cancel", (event) => {
        event.preventDefault();
        this.close();
      });
      this.closeButton.addEventListener("click", () => this.close());
      this.shadowRoot.querySelector(".previous").addEventListener("click", () => this.previous());
      this.shadowRoot.querySelector(".next").addEventListener("click", () => this.next());
      this.viewer.addEventListener("pointerdown", this.onPointerDown);
      this.viewer.addEventListener("pointerup", this.onPointerUp);
      this.viewer.addEventListener("pointercancel", () => { this.swipeStart = null; });
      this.viewer.addEventListener("touchstart", this.onTouchStart, { passive: true });
      this.viewer.addEventListener("touchend", this.onTouchEnd, { passive: true });
      this.mediaImage.addEventListener("error", () => this.media.classList.remove("has-image"));
    }

    createStoryTrigger(story, index) {
      const button = document.createElement("button");
      button.className = "story-trigger";
      button.type = "button";
      button.dataset.storyIndex = String(index);
      button.classList.toggle("is-unseen", !this.viewedStories.has(story.title));
      button.setAttribute("aria-label", `Open ${story.title} story`);
      const avatar = this.createAvatar(story, "story-avatar");
      const label = document.createElement("span");
      label.className = "story-label";
      label.textContent = story.title;
      button.append(avatar, label);
      button.addEventListener("click", () => this.open(index));
      return button;
    }

    createAvatar(story, className) {
      const avatar = document.createElement("div");
      avatar.className = className;
      if (isSafeUrl(story.thumbnail)) {
        const image = document.createElement("img");
        image.src = story.thumbnail;
        image.alt = "";
        image.addEventListener("error", () => image.remove(), { once: true });
        avatar.append(image);
      }
      const icon = document.createElement("span");
      icon.textContent = story.icon || "✦";
      avatar.append(icon);
      return avatar;
    }

    open(index) {
      if (!STORIES[index]?.slides?.length) return;
      this.previousFocus = document.activeElement;
      this.storyIndex = index;
      this.slideIndex = 0;
      this.isOpen = true;
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.modal.classList.add("is-open");
      if (typeof this.modal.showModal === "function" && !this.modal.open) {
        try { this.modal.showModal(); } catch (_) {}
      }
      this.modal.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", this.onKeydown, true);
      document.addEventListener("visibilitychange", this.onVisibilityChange);
      this.reducedMotion.addEventListener?.("change", this.onMotionChange);
      this.updateViewer();
      queueMicrotask(() => this.closeButton.focus());
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.stopPlayback();
      this.modal.classList.remove("is-open");
      if (typeof this.modal.close === "function" && this.modal.open) {
        this.modal.close();
      }
      this.modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = this.previousBodyOverflow;
      document.removeEventListener("keydown", this.onKeydown, true);
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.reducedMotion.removeEventListener?.("change", this.onMotionChange);
      this.previousFocus?.focus?.();
    }

    updateViewer() {
      const story = STORIES[this.storyIndex];
      const slide = story.slides[this.slideIndex];
      this.markStoryViewed(story);
      this.stopPlayback();
      this.elapsed = 0;
      this.storyTitle.textContent = story.title;
      this.renderNeighbourStories();
      const compactAvatar = this.createAvatar(story, "story-meta-avatar");
      this.metaAvatar.replaceChildren(...compactAvatar.childNodes);
      this.mediaFallback.textContent = story.title;
      this.media.classList.remove("has-image");
      this.mediaImage.removeAttribute("src");
      this.mediaImage.alt = slide.alt || story.title;
      if (isSafeUrl(slide.image)) {
        this.mediaImage.src = slide.image;
        this.media.classList.add("has-image");
      }
      this.cta.classList.remove("is-visible");
      this.cta.removeAttribute("href");
      if (slide.cta && isSafeUrl(slide.cta.href)) {
        this.cta.textContent = slide.cta.label || "Learn more";
        this.cta.href = slide.cta.href;
        this.cta.classList.add("is-visible");
      }
      this.renderProgress();
      this.startPlayback();
    }

    getViewedStories() {
      try {
        const value = JSON.parse(localStorage.getItem(viewedStoriesStorageKey) || "[]");
        return new Set(Array.isArray(value) ? value : []);
      } catch {
        return new Set();
      }
    }

    markStoryViewed(story) {
      if (this.viewedStories.has(story.title)) return;
      this.viewedStories.add(story.title);
      try {
        localStorage.setItem(viewedStoriesStorageKey, JSON.stringify([...this.viewedStories]));
      } catch {
        // The interaction still works when storage is unavailable.
      }
      this.rail?.querySelector(`[data-story-index="${this.storyIndex}"]`)?.classList.remove("is-unseen");
    }

    renderNeighbourStories() {
      this.neighbours.replaceChildren();

      STORIES.forEach((story, index) => {
        if (index === this.storyIndex) return;
        const offset = index - this.storyIndex;

        const button = document.createElement("button");
        button.className = "story-peek";
        button.type = "button";
        button.dataset.storyIndex = String(index);
        button.style.setProperty("--offset", String(offset));
        button.setAttribute("aria-label", `Open ${story.title} story`);

        if (isSafeUrl(story.thumbnail)) {
          const image = document.createElement("img");
          image.src = story.thumbnail;
          image.alt = "";
          image.addEventListener("error", () => image.remove(), { once: true });
          button.append(image);
        }

        const label = document.createElement("span");
        label.className = "story-peek-label";
        label.textContent = story.title;
        button.append(label);
        button.addEventListener("click", () => this.switchStory(index, 0, index > this.storyIndex ? "next" : "previous"));
        this.neighbours.append(button);
      });
      this.updateDeckSpacing();
    }

    updateDeckSpacing() {
      if (window.innerWidth <= 640) return;
      const peek = this.neighbours.querySelector(".story-peek");
      if (!peek) return;
      const viewerWidth = this.viewer.getBoundingClientRect().width;
      const peekWidth = peek.getBoundingClientRect().width;
      const gap = 40;
      this.neighbours.style.setProperty("--deck-step", `${(viewerWidth / 2) + (peekWidth / 2) + gap}px`);
    }

    onResize() {
      this.updateDeckSpacing();
    }

    renderProgress() {
      const slideCount = STORIES[this.storyIndex].slides.length;
      this.progress.replaceChildren();
      for (let index = 0; index < slideCount; index += 1) {
        const segment = document.createElement("span");
        segment.className = "progress-segment";
        if (index < this.slideIndex) segment.classList.add("is-complete");
        if (index === this.slideIndex) segment.classList.add("is-active");
        this.progress.append(segment);
      }
    }

    startPlayback() {
      if (!this.isOpen || document.hidden) return;
      this.modal.classList.toggle("reduce-motion", this.reducedMotion.matches);
      this.startedAt = performance.now();
      const remaining = Math.max(0, slideDuration - this.elapsed);
      this.timerId = window.setTimeout(() => this.next(), remaining);
      if (!this.reducedMotion.matches) this.animateProgress();
    }

    stopPlayback() {
      if (this.timerId) window.clearTimeout(this.timerId);
      if (this.animationFrameId) window.cancelAnimationFrame(this.animationFrameId);
      this.timerId = null;
      this.animationFrameId = null;
    }

    animateProgress() {
      const activeSegment = this.progress.querySelector(".is-active");
      if (!activeSegment || !this.isOpen || this.reducedMotion.matches) return;
      const update = (now) => {
        if (!this.isOpen || document.hidden) return;
        const progress = Math.min(100, ((this.elapsed + now - this.startedAt) / slideDuration) * 100);
        activeSegment.style.setProperty("--progress", `${progress}%`);
        if (progress < 100) this.animationFrameId = window.requestAnimationFrame(update);
      };
      this.animationFrameId = window.requestAnimationFrame(update);
    }

    next() {
      const story = STORIES[this.storyIndex];
      if (this.slideIndex < story.slides.length - 1) {
        this.slideIndex += 1;
      } else if (this.storyIndex < STORIES.length - 1) {
        this.switchStory(this.storyIndex + 1, 0, "next");
        return;
      } else {
        this.close();
        return;
      }
      this.updateViewer();
    }

    previous() {
      if (this.slideIndex > 0) {
        this.slideIndex -= 1;
      } else if (this.storyIndex > 0) {
        const previousStoryIndex = this.storyIndex - 1;
        this.switchStory(previousStoryIndex, STORIES[previousStoryIndex].slides.length - 1, "previous");
        return;
      } else {
        return;
      }
      this.updateViewer();
    }

    switchStory(storyIndex, slideIndex, direction) {
      if (!STORIES[storyIndex]?.slides?.[slideIndex]) return;
      if (this.isTransitioning || storyIndex === this.storyIndex) return;
      if (this.reducedMotion.matches) {
        this.storyIndex = storyIndex;
        this.slideIndex = slideIndex;
        this.updateViewer();
        return;
      }

      this.stopPlayback();
      const useCubeTransition = window.innerWidth <= 640;
      if (!useCubeTransition) {
        this.promoteDesktopStory(storyIndex, slideIndex);
        return;
      }
      const transitionType = useCubeTransition ? "cube" : "deck";
      const outClass = `${transitionType}-out-${direction}`;
      const inClass = `${transitionType}-in-${direction}`;
      const outDuration = useCubeTransition ? 350 : 210;
      const inDuration = useCubeTransition ? 360 : 330;
      const cubePreview = useCubeTransition ? this.createCubePreview(storyIndex, slideIndex, direction) : null;
      this.viewer.classList.add(outClass);

      window.setTimeout(() => {
        this.storyIndex = storyIndex;
        this.slideIndex = slideIndex;
        this.viewer.classList.remove(outClass);
        this.updateViewer();
        if (cubePreview) {
          cubePreview.remove();
        } else {
          this.viewer.classList.add(inClass);
          window.setTimeout(() => this.viewer.classList.remove(inClass), inDuration);
        }
      }, outDuration);
    }

    promoteDesktopStory(nextStoryIndex, nextSlideIndex) {
      const selectedPeek = this.neighbours.querySelector(`[data-story-index="${nextStoryIndex}"]`);
      if (!selectedPeek) {
        this.storyIndex = nextStoryIndex;
        this.slideIndex = nextSlideIndex;
        this.updateViewer();
        return;
      }

      this.isTransitioning = true;
      const currentStoryIndex = this.storyIndex;
      const stageRect = this.stage.getBoundingClientRect();
      const viewerRect = this.toStageRect(this.viewer.getBoundingClientRect(), stageRect, 28);
      const selectedRect = this.toStageRect(selectedPeek.getBoundingClientRect(), stageRect, 18);
      const peekSize = { width: selectedRect.width, height: selectedRect.height };
      const layer = document.createElement("div");
      layer.className = "deck-transition-layer";

      const outgoing = this.createTransitionViewer(currentStoryIndex, this.slideIndex);
      const incoming = this.createTransitionViewer(nextStoryIndex, nextSlideIndex);
      this.setTransitionRect(outgoing, viewerRect);
      this.setTransitionRect(incoming, selectedRect);
      layer.append(outgoing, incoming);

      const remaining = [...this.neighbours.querySelectorAll(".story-peek")]
        .filter((peek) => peek !== selectedPeek)
        .map((peek) => {
          const clone = peek.cloneNode(true);
          clone.classList.add("deck-transition-card");
          const rect = this.toStageRect(peek.getBoundingClientRect(), stageRect, 18);
          this.setTransitionRect(clone, rect);
          layer.append(clone);
          return { clone, storyIndex: Number(peek.dataset.storyIndex) };
        });

      this.stage.append(layer);
      this.viewer.style.visibility = "hidden";
      this.neighbours.style.visibility = "hidden";

      requestAnimationFrame(() => {
        this.setTransitionRect(incoming, viewerRect);
        this.setTransitionRect(outgoing, this.getPeekTargetRect(currentStoryIndex, nextStoryIndex, viewerRect, peekSize));
        remaining.forEach(({ clone, storyIndex }) => {
          this.setTransitionRect(clone, this.getPeekTargetRect(storyIndex, nextStoryIndex, viewerRect, peekSize));
        });
      });

      window.setTimeout(() => {
        this.storyIndex = nextStoryIndex;
        this.slideIndex = nextSlideIndex;
        this.viewer.style.visibility = "";
        this.neighbours.style.visibility = "";
        layer.remove();
        this.updateViewer();
        this.isTransitioning = false;
      }, 400);
    }

    createTransitionViewer(storyIndex, slideIndex) {
      const story = STORIES[storyIndex];
      const slide = story.slides[slideIndex];
      const clone = this.viewer.cloneNode(true);
      clone.className = "viewer deck-transition-card";
      clone.querySelector(".story-title").textContent = story.title;
      const avatar = clone.querySelector(".story-meta-avatar");
      const compactAvatar = this.createAvatar(story, "story-meta-avatar");
      avatar.replaceChildren(...compactAvatar.childNodes);
      const media = clone.querySelector(".media");
      const image = clone.querySelector(".media img");
      media.classList.remove("has-image");
      image.removeAttribute("src");
      image.alt = slide.alt || story.title;
      if (isSafeUrl(slide.image)) {
        image.src = slide.image;
        media.classList.add("has-image");
      }
      const fallback = clone.querySelector(".media-fallback");
      fallback.textContent = story.title;
      const cta = clone.querySelector(".cta");
      cta.classList.remove("is-visible");
      cta.removeAttribute("href");
      if (slide.cta && isSafeUrl(slide.cta.href)) {
        cta.textContent = slide.cta.label || "Learn more";
        cta.href = slide.cta.href;
        cta.classList.add("is-visible");
      }
      return clone;
    }

    toStageRect(rect, stageRect, radius) {
      return {
        left: rect.left - stageRect.left,
        top: rect.top - stageRect.top,
        width: rect.width,
        height: rect.height,
        radius
      };
    }

    getPeekTargetRect(storyIndex, activeStoryIndex, viewerRect, peekSize) {
      const offset = storyIndex - activeStoryIndex;
      return {
        left: viewerRect.left + (viewerRect.width / 2) + (offset * ((viewerRect.width / 2) + (peekSize.width / 2) + 40)) - (peekSize.width / 2),
        top: viewerRect.top + (viewerRect.height / 2) - (peekSize.height / 2),
        width: peekSize.width,
        height: peekSize.height,
        radius: 18
      };
    }

    setTransitionRect(element, rect) {
      element.style.left = `${rect.left}px`;
      element.style.top = `${rect.top}px`;
      element.style.width = `${rect.width}px`;
      element.style.height = `${rect.height}px`;
      element.style.borderRadius = `${rect.radius}px`;
    }

    createCubePreview(storyIndex, slideIndex, direction) {
      this.stage.querySelector(".cube-preview")?.remove();
      const story = STORIES[storyIndex];
      const slide = story.slides[slideIndex];
      const preview = document.createElement("div");
      preview.className = `cube-preview cube-preview-${direction}`;

      const media = document.createElement("div");
      media.className = "cube-preview-media";
      if (isSafeUrl(slide.image)) {
        const image = document.createElement("img");
        image.src = slide.image;
        image.alt = "";
        image.addEventListener("error", () => image.remove(), { once: true });
        media.append(image);
      }

      const shade = document.createElement("div");
      shade.className = "cube-preview-shade";
      const header = document.createElement("div");
      header.className = "cube-preview-header";
      const avatar = this.createAvatar(story, "cube-preview-avatar");
      const title = document.createElement("span");
      title.textContent = story.title;
      header.append(avatar, title);
      preview.append(media, shade, header);
      this.stage.append(preview);
      return preview;
    }

    nextStoryGroup() {
      if (this.storyIndex < STORIES.length - 1) {
        this.switchStory(this.storyIndex + 1, 0, "next");
      } else {
        this.close();
      }
    }

    previousStoryGroup() {
      if (this.storyIndex > 0) {
        const previousStoryIndex = this.storyIndex - 1;
        this.switchStory(previousStoryIndex, STORIES[previousStoryIndex].slides.length - 1, "previous");
      }
    }

    onPointerDown(event) {
      if (window.innerWidth > 640) return;
      this.swipeStart = { x: event.clientX, y: event.clientY };
    }

    onPointerUp(event) {
      if (window.innerWidth > 640) return;
      this.handleSwipeEnd(event.clientX, event.clientY);
    }

    onTouchStart(event) {
      if (window.innerWidth > 640 || !event.touches[0]) return;
      this.swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    onTouchEnd(event) {
      const touch = event.changedTouches[0];
      if (window.innerWidth > 640 || !touch) return;
      this.handleSwipeEnd(touch.clientX, touch.clientY);
    }

    handleSwipeEnd(endX, endY) {
      if (!this.swipeStart) return;
      const deltaX = endX - this.swipeStart.x;
      const deltaY = endY - this.swipeStart.y;
      this.swipeStart = null;

      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (deltaX < 0) this.nextStoryGroup();
      else this.previousStoryGroup();
    }

    onVisibilityChange() {
      if (!this.isOpen) return;
      if (document.hidden) {
        this.elapsed += performance.now() - this.startedAt;
        this.stopPlayback();
      } else {
        this.startPlayback();
      }
    }

    onMotionChange() {
      if (!this.isOpen) return;
      this.stopPlayback();
      this.startPlayback();
    }

    onKeydown(event) {
      if (!this.isOpen) return;
      if (event.key === "Escape") { event.preventDefault(); this.close(); return; }
      if (event.key === "ArrowRight") { event.preventDefault(); this.next(); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); this.previous(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...this.shadowRoot.querySelectorAll('.modal button:not([disabled]), .modal a[href]')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      const activeElement = this.shadowRoot.activeElement;
      if (event.shiftKey && activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  if (!customElements.get(widgetTag)) customElements.define(widgetTag, StoriesWidget);

  const mountWidget = () => {
    const container = document.querySelector(containerSelector);
    if (!container || container.querySelector(widgetTag)) return Boolean(container);
    container.prepend(document.createElement(widgetTag));
    return true;
  };

  let mountScheduled = false;
  const scheduleMount = () => {
    if (mountScheduled) return;
    mountScheduled = true;
    requestAnimationFrame(() => { mountScheduled = false; mountWidget(); });
  };

  mountWidget();
  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
})();
