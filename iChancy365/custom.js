(function () {
  var telegramUrl = "https://t.me/Ichancy365";

  function addTelegramButton() {
    if (document.querySelector('[data-mj="telegram-button"]')) return;

    var headerRight = document.querySelector(
      '[data-mj="custom-header"] [data-mj="header-right"]'
    );

    if (!headerRight) return;

    var button = document.createElement("a");
    button.setAttribute("data-mj", "telegram-button");
    button.href = telegramUrl;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "Telegram");

    headerRight.prepend(button);
  }

  addTelegramButton();

  new MutationObserver(addTelegramButton).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
