(() => {
  const body = document.body;
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  const progress = document.querySelector('.scroll-progress span');
  const topButton = document.querySelector('.floating-top');
  const toast = document.querySelector('.toast');

  const closeMenu = () => {
    body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${scrollPercent}%`;
    topButton.classList.toggle('is-visible', window.scrollY > 600);
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => revealObserver.observe(item));

    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        document.querySelector(`[data-nav-link][href="#${entry.target.id}"]`)?.setAttribute('aria-current', 'page');
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        toast.textContent = 'Copied to clipboard';
      } catch {
        toast.textContent = button.dataset.copy;
      }
      toast.classList.add('is-visible');
      window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
    });
  });
})();
