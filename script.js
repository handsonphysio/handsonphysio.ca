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

  const assistantLaunch = document.querySelector('.assistant-launch');
  const assistantPanel = document.querySelector('.assistant-panel');
  const assistantClose = document.querySelector('.assistant-close');
  const assistantMessages = document.querySelector('.assistant-messages');
  const assistantForm = document.querySelector('.assistant-form');
  const assistantInput = document.querySelector('#assistant-question');

  const openAssistant = () => {
    assistantPanel?.classList.add('is-open');
    assistantPanel?.setAttribute('aria-hidden', 'false');
    assistantLaunch?.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => assistantInput?.focus(), 100);
  };
  const closeAssistant = () => {
    assistantPanel?.classList.remove('is-open');
    assistantPanel?.setAttribute('aria-hidden', 'true');
    assistantLaunch?.setAttribute('aria-expanded', 'false');
    assistantLaunch?.focus();
  };
  const addAssistantMessage = (text, user = false, action = null) => {
    if (!assistantMessages) return;
    const message = document.createElement('div');
    message.className = `assistant-message${user ? ' assistant-message--user' : ''}`;
    message.textContent = text;
    if (action) {
      const link = document.createElement('a');
      link.href = action.href;
      link.textContent = action.label;
      if (action.external) {
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      message.append(document.createElement('br'), link);
    }
    assistantMessages.append(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  };
  const assistantReplies = {
    book: {
      text: 'You can book online anytime, or call the clinic if you would like help choosing a time.',
      action: { href: 'https://handsonphysio.janeapp.com', label: 'Book an appointment ↗', external: true }
    },
    billing: {
      text: 'We can submit eligible direct-billing claims through participating provider networks. Please bring your benefit card and confirm your individual coverage before treatment.',
      action: { href: '#billing', label: 'View direct-billing information' }
    },
    location: {
      text: 'Hands-On Physio is located at Unit 203, 8268 120 Street, Surrey, BC V3W 3N4.',
      action: { href: 'https://www.google.com/maps/search/?api=1&query=Unit+203%2C+8268+120+Street%2C+Surrey%2C+BC+V3W+3N4', label: 'Get directions ↗', external: true }
    },
    services: {
      text: 'We offer physiotherapy, dry needling / IMS, exercise therapy, cupping therapy and shockwave therapy. Your physiotherapist can discuss which options suit your needs.',
      action: { href: '#services', label: 'Explore services' }
    },
    contact: {
      text: 'You can call us at (778) 998-1600 or email info.handsonphysio@gmail.com.',
      action: { href: 'tel:+17789981600', label: 'Call Hands-On Physio' }
    },
    emergency: {
      text: 'This assistant cannot help with urgent medical concerns. If this is an emergency, call 911 or seek immediate medical care.',
      action: null
    },
    default: {
      text: 'I can help with booking, direct billing, location, services, or contacting the clinic. Try one of the options above, or call us for personal care questions.',
      action: { href: 'tel:+17789981600', label: 'Call (778) 998-1600' }
    }
  };
  const respondToAssistant = (question) => {
    const value = question.toLowerCase();
    const key = /emergency|urgent|chest pain|suicid|severe/.test(value) ? 'emergency'
      : /book|appointment|schedule|jane/.test(value) ? 'book'
      : /bill|benefit|insurance|coverage|claim/.test(value) ? 'billing'
      : /address|location|directions|parking|where/.test(value) ? 'location'
      : /service|treatment|physio|needl|ims|exercise|cupping|shockwave/.test(value) ? 'services'
      : /call|phone|email|contact/.test(value) ? 'contact' : 'default';
    const reply = assistantReplies[key];
    addAssistantMessage(reply.text, false, reply.action);
  };

  assistantLaunch?.addEventListener('click', () => {
    assistantPanel?.classList.contains('is-open') ? closeAssistant() : openAssistant();
  });
  assistantClose?.addEventListener('click', closeAssistant);
  document.querySelectorAll('[data-assistant-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const reply = assistantReplies[button.dataset.assistantAction];
      if (reply) addAssistantMessage(reply.text, false, reply.action);
    });
  });
  assistantForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = assistantInput?.value.trim();
    if (!question) return;
    addAssistantMessage(question, true);
    assistantInput.value = '';
    window.setTimeout(() => respondToAssistant(question), 180);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && assistantPanel?.classList.contains('is-open')) closeAssistant();
  });
})();
