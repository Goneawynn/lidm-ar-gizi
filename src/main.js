  /* ── Loader ── */
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
      }, 1800);
    });

    /* ── Navbar scroll ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── FAB visibility ── */
    const fab = document.getElementById('fab');
    window.addEventListener('scroll', () => {
      fab.classList.toggle('visible', window.scrollY > window.innerHeight * .5);
    }, { passive: true });

    /* ── Scroll-triggered fade-up ── */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature-card, .step').forEach(el => observer.observe(el));

    /* ── Keyboard scroll indicator ── */
    document.querySelector('.scroll-indicator').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        document.getElementById('welcome').scrollIntoView({ behavior: 'smooth' });
      }
    });