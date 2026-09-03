const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

document.addEventListener('DOMContentLoaded', () => {
  // Smooth Scroll
  qsa('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = qs(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Animated Counter
  const animateCounter = (el, target) => {
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + (target === 240 ? 'M' : '+');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 25);
  };

  const statEls = qsa('.stat-card h3');
  if (statEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statEls.forEach((el) => animateCounter(el, parseInt(el.dataset.target, 10)));
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(qs('.stats'));
  }

  // Catalog Filtering
  const filterControls = qsa('[data-filter]');
  const catalogCards = qsa('.catalog .card');
  const resultCount = qs('#resultCount');
  const emptyCatalog = qs('#emptyCatalog');

  const updateCatalog = () => {
    const filters = Object.fromEntries(filterControls.map((c) => [c.dataset.filter, c.value]));
    let count = 0;
    catalogCards.forEach((card) => {
      const match = Object.entries(filters).every(([k, v]) => v === 'all' || card.dataset[k] === v);
      card.hidden = !match;
      if (match) count++;
    });
    if (resultCount) resultCount.textContent = `Showing ${count} verified fabric series`;
    if (emptyCatalog) emptyCatalog.hidden = count !== 0;
  };

  filterControls.forEach((c) => c.addEventListener('change', updateCatalog));
  qs('#resetFilters')?.addEventListener('click', () => {
    filterControls.forEach((c) => (c.value = 'all'));
    updateCatalog();
  });

  // Sample Request Modal Logic
  const modal = qs('#sampleModal');
  const closeModalBtn = qs('.close-modal');

  qsa('.sample-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  // Form Handlers
  qs('#rfqForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('RFQ Submitted successfully! Your dedicated account manager will respond within 24 hours.');
    e.target.reset();
  });

  qs('#sampleForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Swatch Request Received! Tracking details will be emailed shortly.');
    if (modal) modal.classList.remove('open');
    e.target.reset();
  });
});