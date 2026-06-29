(() => {
  const selector = "[data-mj=\"widget-pages-item\"], [data-mj=\"widget-collection-slider-item\"]";
  const authButtonSelector = "[data-mj=\"login-button\"], [data-mj=\"register-button\"]";
  const styleId = "mrjindev-game-card-hover-tilt-style";
  const angle = 20;
  const lerpAmount = 0.08;
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
  };

  const onMouseMove = (event) => {
    if (!shouldRun()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const posX = event.clientX - centerX;
    const posY = event.clientY - centerY;
    const x = remap(posX, rect.width / 2, angle);
    const y = remap(posY, rect.height / 2, angle);
    card.dataset.rotateY = String(x);
    card.dataset.rotateX = String(-y);
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
    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
    cards.add(card);
  };

  const enhanceCards = (root = document) => {
    root.querySelectorAll?.(selector).forEach(enhanceCard);
  };

  const getTextElement = (button) => {
    const spans = [...button.querySelectorAll("span")];
    return spans.findLast?.((span) => span.textContent.trim()) || spans.find((span) => span.textContent.trim()) || button;
  };

  const enhanceAuthButtonText = (button) => {
    if (button.dataset.escortesnewLetters === "1") return;
    const textElement = getTextElement(button);
    const label = textElement.textContent.trim();
    if (!label) return;

    button.dataset.escortesnewLetters = "1";
    button.setAttribute("aria-label", button.getAttribute("aria-label") || label);

    const wrapper = document.createElement("span");
    wrapper.className = "escortesnew-auth-text";
    wrapper.setAttribute("aria-hidden", "true");

    [...label].forEach((letter, index) => {
      const span = document.createElement("span");
      span.className = "escortesnew-auth-letter";
      span.style.setProperty("--letter-delay", `${index * 0.08}s`);
      span.textContent = letter === " " ? "\u00A0" : letter;
      wrapper.append(span);
    });

    textElement.replaceChildren(wrapper);
  };

  const enhanceAuthButtons = (root = document) => {
    root.querySelectorAll?.(authButtonSelector).forEach(enhanceAuthButtonText);
  };

  const ensureStyle = () => {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      ${selector} {
        position: relative !important;
        isolation: isolate !important;
        transform: var(--mrjindev-tilt-transform, perspective(900px) rotateX(0deg) rotateY(0deg)) !important;
        transform-style: preserve-3d !important;
        transform-origin: center center !important;
        will-change: transform !important;
        transition: box-shadow .22s ease, filter .22s ease !important;
      }

      ${selector}:hover {
        filter: brightness(1.06);
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
    enhanceAuthButtons();
    console.info(`[MrjinDev] Tilt cards enhanced: ${cards.size}`);
    if (!animationFrame) animationFrame = requestAnimationFrame(update);
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches?.(selector)) enhanceCard(node);
        if (node.matches?.(authButtonSelector)) enhanceAuthButtonText(node);
        enhanceCards(node);
        enhanceAuthButtons(node);
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
