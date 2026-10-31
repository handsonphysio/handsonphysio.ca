(() => {
  const menu = document.querySelector('.menu[aria-controls="service-navigation"]');
  const navigation = document.querySelector('#service-navigation');
  if (!menu || !navigation) return;

  const setOpen = (open) => {
    navigation.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };

  menu.addEventListener('click', () => {
    setOpen(menu.getAttribute('aria-expanded') !== 'true');
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menu.focus();
    }
  });

  const compactNavigation = window.matchMedia('(max-width: 1100px)');
  compactNavigation.addEventListener('change', () => setOpen(false));
})();
