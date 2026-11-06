(() => {
  if (window.ichancyInfoPanelInstalled) return;
  window.ichancyInfoPanelInstalled = true;

  const style = document.createElement('style');
  style.textContent = `
    [data-ichancy-info-text] { overflow: hidden; max-height: 72px; }
    [data-ichancy-info-text][data-expanded="true"] { max-height: none; }
    [data-ichancy-info-toggle] {
      margin-top: 12px; padding: 8px 16px; border: 1px solid #8cc4df;
      border-radius: 4px; background: transparent; color: #fff;
      height: 32px;
      font-weight: 300; cursor: pointer;
    }
    [data-ichancy-info-toggle]:hover { background: #2940666b; }
  `;
  document.head.appendChild(style);

  function setupWidgets() {
    document.querySelectorAll('[data-mj="widget-info-panel"]').forEach((panel) => {
      if (panel.querySelector('[data-ichancy-info-toggle]')) return;
      const text = panel.querySelector('.app-ltr-1fpio1d, .app-rtl-1fpio1d');
      if (!text) return;
      text.dataset.ichancyInfoText = '';
      text.dataset.expanded = 'false';
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.ichancyInfoToggle = '';
      button.textContent = 'See more';
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => {
        const expanded = text.dataset.expanded !== 'true';
        text.dataset.expanded = String(expanded);
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? 'See less' : 'See more';
      });
      text.after(button);
    });
  }

  function start() {
    setupWidgets();
    new MutationObserver(setupWidgets).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
