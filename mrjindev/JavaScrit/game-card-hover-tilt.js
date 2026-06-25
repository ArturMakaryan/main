(() => {
  const selector = "[data-mj=\"game-catalog-card\"]";
  const styleId = "mrjindev-game-card-hover-tilt-style";
  const angle = 20;
  const lerpAmount = 0.08;
  const defaultMouseX = "50%";
  const defaultMouseY = "50%";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const cards = new Set();
  let animationFrame = 0;

  const lerp = (start, end, amount) => ((1 - amount) * start) + (amount * end);

  const remap = (value, oldMax, newMax) => {
    const newValue = ((value + oldMax) * (newMax * 2)) / (oldMax * 2) - newMax;
    return Math.min(Math.max(newValue, -newMax), newMax);
  };

  const shouldRun = () => !reducedMotion.matches && canHover.matches;

  const resetCard = (card) => {
    card.dataset.rotateX = "0";
    card.dataset.rotateY = "0";
    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
    card.style.setProperty("--mrjindev-tilt-transform", "perspective(900px) rotateX(0deg) rotateY(0deg)");
    card.style.setProperty("--mouse-x", defaultMouseX);
    card.style.setProperty("--mouse-y", defaultMouseY);
    card.style.setProperty("--ratio-x", "0.5");
    card.style.setProperty("--ratio-y", "0.5");
  };

  const onMouseMove = (event) => {
    if (!shouldRun()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const posX = event.clientX - centerX;
    const posY = event.clientY - centerY;
    const localX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const localY = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    const ratioX = rect.width ? localX / rect.width : 0.5;
    const ratioY = rect.height ? localY / rect.height : 0.5;
    const x = remap(posX, rect.width / 2, angle);
    const y = remap(posY, rect.height / 2, angle);
    card.dataset.rotateY = String(x);
    card.dataset.rotateX = String(-y);
    card.style.setProperty("--mouse-x", `${localX}px`);
    card.style.setProperty("--mouse-y", `${localY}px`);
    card.style.setProperty("--ratio-x", String(ratioX));
    card.style.setProperty("--ratio-y", String(ratioY));
  };

  const onMouseLeave = (event) => {
    event.currentTarget.dataset.rotateX = "0";
    event.currentTarget.dataset.rotateY = "0";
  };

  const enhanceCard = (card) => {
    if (card.dataset.mrjindevTilt === "1") return;
    card.dataset.mrjindevTilt = "1";
    card.dataset.rotateX = "0";
    card.dataset.rotateY = "0";
    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
    card.style.setProperty("--mouse-x", defaultMouseX);
    card.style.setProperty("--mouse-y", defaultMouseY);
    card.style.setProperty("--ratio-x", "0.5");
    card.style.setProperty("--ratio-y", "0.5");
    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
    cards.add(card);
  };

  const enhanceCards = (root = document) => {
    root.querySelectorAll?.(selector).forEach(enhanceCard);
  };

  const ensureStyle = () => {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      ${selector} {
        --background: rgb(20, 20, 20);
        --background-card-content: rgba(44, 44, 44, .5);
        --glitter2: url("https://assets.codepen.io/13471/noise-top.png");
        --ratio-x: .5;
        --ratio-y: .5;
        --mouse-x: 50%;
        --mouse-y: 50%;
        --light-size: 300px;
        position: relative !important;
        isolation: isolate !important;
        overflow: hidden !important;
        transform: var(--mrjindev-tilt-transform, perspective(900px) rotateX(0deg) rotateY(0deg)) !important;
        transform-style: preserve-3d !important;
        transform-origin: center center !important;
        will-change: transform !important;
        transition: box-shadow .22s ease, filter .22s ease !important;
      }

      ${selector}::before,
      ${selector}::after {
        content: "" !important;
        position: absolute !important;
        pointer-events: none !important;
        opacity: 0;
        transition: opacity 500ms ease;
        image-rendering: pixelated;
      }

      ${selector}::before {
        inset: 0 !important;
        z-index: 1 !important;
        border-radius: inherit !important;
        background-image:
          conic-gradient(
            from 0deg at var(--mouse-x) var(--mouse-y),
            #FFBD8C 0%,
            #FD8585 11%,
            #FD8585 15%,
            #F882FF 27%,
            #F882FF 31%,
            #8785FE 42%,
            #8785FE 46%,
            #9AFCFF 55%,
            #9AFCFF 59%,
            #99FD9C 70%,
            #99FD9C 74%,
            #FFFD84 87%,
            #FFFD84 91%,
            #FFBD8C 100%
          ),
          radial-gradient(
            calc(var(--light-size) * 1.5) circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, .7),
            rgba(0, 0, 0, .5) 50%
          ),
          radial-gradient(
            calc(var(--light-size) * 1.5) circle at var(--mouse-x) var(--mouse-y),
            transparent,
            rgb(33, 22, 44) 60%,
            var(--background) 120%
          );
        background-blend-mode: hue, color-dodge;
      }

      ${selector}::after {
        --bgoffsetx: calc(3px * var(--ratio-x));
        --bgoffsety: calc(3px * var(--ratio-y));
        --pointerx: calc(100% * var(--ratio-x));
        --pointery: calc(100% * var(--ratio-y));
        inset: 1px !important;
        z-index: 2 !important;
        border-radius: max(0px, calc(12px - 1px)) !important;
        background-color: var(--background-card-content);
        background-image:
          radial-gradient(var(--light-size) circle at var(--pointerx) var(--pointery), rgba(0, 0, 0, .75), black),
          radial-gradient(var(--light-size) circle at var(--pointerx) var(--pointery), #252525cc, rgb(16, 16, 16) calc(var(--light-size) * 1)),
          var(--glitter2),
          var(--glitter2);
        background-position: center, center, center, calc(var(--bgoffsetx) * 1) calc(var(--bgoffsety) * 1);
        background-size: 300px 300px;
        background-blend-mode: normal, color-burn, color-dodge;
        filter: brightness(1.4) contrast(.725);
        mix-blend-mode: screen;
      }

      ${selector}:hover {
        filter: brightness(1.06);
      }

      ${selector}:hover::before {
        opacity: 1;
        transition-delay: .1s;
      }

      ${selector}:hover::after {
        opacity: .5;
        transition-delay: 0s;
      }
    `;
    document.head.append(style);
  };

  const update = () => {
    animationFrame = 0;

    cards.forEach((card) => {
      if (!card.isConnected) {
        cards.delete(card);
        return;
      }

      if (!shouldRun()) {
        resetCard(card);
        return;
      }

      const currentX = parseFloat(card.style.getPropertyValue("--rotateX")) || 0;
      const currentY = parseFloat(card.style.getPropertyValue("--rotateY")) || 0;
      const targetX = parseFloat(card.dataset.rotateX) || 0;
      const targetY = parseFloat(card.dataset.rotateY) || 0;
      const nextX = Math.abs(targetX - currentX) < 0.01 ? targetX : lerp(currentX, targetX, lerpAmount);
      const nextY = Math.abs(targetY - currentY) < 0.01 ? targetY : lerp(currentY, targetY, lerpAmount);

      card.style.setProperty("--rotateX", `${nextX}deg`);
      card.style.setProperty("--rotateY", `${nextY}deg`);
      card.style.setProperty("--mrjindev-tilt-transform", `perspective(900px) rotateX(${nextX}deg) rotateY(${nextY}deg)`);
    });

    animationFrame = requestAnimationFrame(update);
  };

  const start = () => {
    ensureStyle();
    enhanceCards();
    console.info(`[MrjinDev] Tilt cards enhanced: ${cards.size}`);
    if (!animationFrame) animationFrame = requestAnimationFrame(update);
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches?.(selector)) enhanceCard(node);
        enhanceCards(node);
      });
    });
  });

  const onCapabilityChange = () => {
    cards.forEach(resetCard);
  };

  reducedMotion.addEventListener?.("change", onCapabilityChange);
  canHover.addEventListener?.("change", onCapabilityChange);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
