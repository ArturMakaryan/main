(() => {
  const selector = '[data-mj="widget-collection-slider-list"]';

  const removeSliderLists = () => {
    document.querySelectorAll(selector).forEach((element) => {
      element.remove();
    });
  };

  removeSliderLists();

  new MutationObserver(removeSliderLists).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
