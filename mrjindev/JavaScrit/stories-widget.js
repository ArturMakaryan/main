(() => {
  const widgetTag = "stories-widget";
  const containerSelector = '[data-mj="widget-info-panel-container"]';
  const slideDuration = 5000;

  /*
   * Change this public URL after uploading the image to the MrjinDev asset
   * host. Each story may contain any number of slides, and a CTA is optional.
   */
  const commonStoryImage = "https://cdn.jsdelivr.net/gh/arturvip1/main@52a5590/assets/mrjindev-casino-night.png";

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
        }
      ]
    },
    {
      title: "Program",
      icon: "👑",
      thumbnail: commonStoryImage,
      slides: [{ image: commonStoryImage, alt: "Program rewards" }]
    },
    {
      title: "Races",
      icon: "🏆",
      thumbnail: commonStoryImage,
      slides: [{ image: commonStoryImage, alt: "Races" }]
    },
    {
      title: "Lootboxes",
      icon: "🎁",
      thumbnail: commonStoryImage,
      slides: [{ image: commonStoryImage, alt: "Lootboxes" }]
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
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      this.onKeydown = this.onKeydown.bind(this);
      this.onVisibilityChange = this.onVisibilityChange.bind(this);
      this.onMotionChange = this.onMotionChange.bind(this);
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        this.render();
      }
    }

    disconnectedCallback() {
      this.stopPlayback();
      document.removeEventListener("keydown", this.onKeydown, true);
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.reducedMotion.removeEventListener?.("change", this.onMotionChange);
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
          .story-avatar { position: relative; display: grid; place-items: center; width: 76px; height: 76px; overflow: hidden; border: 5px solid #383540; border-radius: 50%; background: radial-gradient(circle at 35% 28%, #8d61ff 0 22%, #40229a 54%, #1b1534 100%); box-shadow: 0 0 0 2px rgba(157, 110, 255, 0.35); transition: transform .18s ease, box-shadow .18s ease; }
          .story-trigger:hover .story-avatar { transform: translateY(-2px); box-shadow: 0 0 0 2px #a970ff, 0 10px 22px rgba(56, 24, 135, .45); }
          .story-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .story-avatar span { font-size: 35px; line-height: 1; filter: drop-shadow(0 3px 5px rgba(0,0,0,.32)); }
          .story-label { max-width: 104px; overflow: hidden; font-size: 16px; font-weight: 650; line-height: 1.15; text-align: center; text-overflow: ellipsis; white-space: nowrap; }

          .modal { position: fixed; inset: 0; z-index: 2147483647; display: none; place-items: center; padding: 24px; }
          .modal.is-open { display: grid; }
          .backdrop { position: absolute; inset: 0; background: rgba(4, 4, 8, .83); backdrop-filter: blur(4px); }
          .viewer { position: relative; z-index: 1; width: min(100%, 430px); height: min(86vh, 760px); min-height: 440px; overflow: hidden; isolation: isolate; border: 1px solid rgba(255,255,255,.14); border-radius: 28px; background: #151126; box-shadow: 0 28px 80px rgba(0,0,0,.62); }
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
          @media (max-width: 640px) { .rail { gap: 13px; padding-inline: 2px; } .story-trigger { flex-basis: 76px; } .story-avatar { width: 65px; height: 65px; border-width: 4px; } .story-avatar span { font-size: 29px; } .story-label { font-size: 14px; } .modal { padding: 0; } .viewer { width: 100%; height: 100dvh; min-height: 0; border: 0; border-radius: 0; } .navigation { width: 34px; height: 54px; } }
        </style>
        <section class="rail" aria-label="Featured stories"></section>
        <section class="modal" aria-hidden="true" aria-label="Story viewer" role="dialog" aria-modal="true">
          <button class="backdrop" type="button" aria-label="Close story viewer"></button>
          <div class="viewer" role="document">
            <div class="media"><img alt=""><div class="media-fallback"></div></div><div class="shade"></div>
            <div class="progress" aria-hidden="true"></div>
            <div class="story-meta"><div class="story-meta-avatar"></div><span class="story-title"></span></div>
            <button class="close" type="button" aria-label="Close story viewer"></button>
            <button class="navigation previous" type="button" aria-label="Previous slide"></button>
            <button class="navigation next" type="button" aria-label="Next slide"></button>
            <div class="viewer-footer"><a class="cta" target="_blank" rel="noopener noreferrer"></a></div>
          </div>
        </section>
      `;

      this.rail = this.shadowRoot.querySelector(".rail");
      this.modal = this.shadowRoot.querySelector(".modal");
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
      this.closeButton.addEventListener("click", () => this.close());
      this.shadowRoot.querySelector(".previous").addEventListener("click", () => this.previous());
      this.shadowRoot.querySelector(".next").addEventListener("click", () => this.next());
      this.mediaImage.addEventListener("error", () => this.media.classList.remove("has-image"));
    }

    createStoryTrigger(story, index) {
      const button = document.createElement("button");
      button.className = "story-trigger";
      button.type = "button";
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
      this.stopPlayback();
      this.elapsed = 0;
      this.storyTitle.textContent = story.title;
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
        this.storyIndex += 1;
        this.slideIndex = 0;
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
        this.storyIndex -= 1;
        this.slideIndex = STORIES[this.storyIndex].slides.length - 1;
      } else {
        return;
      }
      this.updateViewer();
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
