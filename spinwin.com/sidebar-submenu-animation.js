(function () {
  var closingClass = "rb-sidebar-submenu-closing";
  var bypassAttr = "data-rb-submenu-close-bypass";
  var closeDelay = 220;
  var closingButtons = new WeakSet();

  function findSection(button) {
    return button.closest('[data-mj="sidebar-section"], li');
  }

  function findSubmenus(section) {
    if (!section) return [];
    return Array.prototype.slice.call(
      section.querySelectorAll(".app-ltr-i6bazn, .app-ltr-7j3ixa")
    );
  }

  function handleCloseIntent(event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var button = target.closest(
      'button[aria-label="arrow_up"].sl-icon.app-ltr-62n98p'
    );

    if (!button || button.hasAttribute(bypassAttr)) return;

    if (closingButtons.has(button)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return;
    }

    var submenus = findSubmenus(findSection(button));
    if (!submenus.length) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    closingButtons.add(button);
    submenus.forEach(function (submenu) {
      submenu.classList.add(closingClass);
    });

    window.setTimeout(function () {
      button.setAttribute(bypassAttr, "true");
      button.click();
      button.removeAttribute(bypassAttr);
      closingButtons.delete(button);
    }, closeDelay);
  }

  ["pointerdown", "mousedown", "click"].forEach(function (eventName) {
    document.addEventListener(eventName, handleCloseIntent, true);
  });
})();
