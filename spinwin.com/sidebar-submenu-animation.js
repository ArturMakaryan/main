(function () {
  var closingClass = "rb-sidebar-submenu-closing";
  var bypassAttr = "data-rb-submenu-close-bypass";
  var closeDelay = 220;

  function findSection(button) {
    return button.closest('[data-mj="sidebar-section"], li');
  }

  function findSubmenu(section) {
    if (!section) return null;
    return section.querySelector(".app-ltr-i6bazn, .app-ltr-7j3ixa");
  }

  document.addEventListener(
    "click",
    function (event) {
      var button = event.target.closest(
        'button[aria-label="arrow_up"].sl-icon.app-ltr-62n98p'
      );

      if (!button || button.hasAttribute(bypassAttr)) return;

      var submenu = findSubmenu(findSection(button));
      if (!submenu || submenu.classList.contains(closingClass)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      submenu.classList.add(closingClass);

      window.setTimeout(function () {
        button.setAttribute(bypassAttr, "true");
        button.click();
        button.removeAttribute(bypassAttr);
      }, closeDelay);
    },
    true
  );
})();
