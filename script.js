document.addEventListener('DOMContentLoaded', () => {

  /* ─── Element refs ─── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('nav-overlay');
  const sections  = document.querySelectorAll('section[id]');

  /* ─── Open / close menu helper ─── */
  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent scroll behind menu
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  }

  /* ─── Hamburger click ─── */
  hamburger.addEventListener('click', toggleMenu);

  /* ─── Overlay click → close ─── */
  overlay.addEventListener('click', closeMenu);

  /* ─── Escape key → close ─── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ─── Nav link click → close + smooth scroll ─── */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId.startsWith('#')) return;
      e.preventDefault();
      closeMenu();
      // small delay so menu closes before scroll
      setTimeout(() => {
        const target = document.querySelector(targetId);
        if (!target) return;
        const offset = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }, 50);
    });
  });

  /* ─── Smooth scroll for all anchor links (incl. logo) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.closest('.nav-links')) return; // already handled above
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ─── Navbar scroll effect ─── */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── Active nav link on scroll ─── */
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navbar.offsetHeight - 10) {
        current = sec.id;
      }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ─── Profile image fallback ─── */
  const heroPhoto   = document.getElementById('hero-photo');
  const placeholder = document.getElementById('photo-placeholder');
  if (heroPhoto) {
    heroPhoto.addEventListener('error', () => {
      heroPhoto.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    });
  }

  /* ─── Animated counters ─── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + (current >= target ? '+' : '');
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  function tryStartCounters() {
    if (countersStarted) return;
    const hero = document.getElementById('home');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.95) {
      countersStarted = true;
      statNums.forEach(el => animateCounter(el));
    }
  }
  window.addEventListener('scroll', tryStartCounters, { passive: true });
  tryStartCounters();

  /* ─── Scroll-reveal (data-aos) ─── */
  const aosEls = document.querySelectorAll('[data-aos]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-aos]')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.06}s`;
        entry.target.classList.add('aos-animate');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  aosEls.forEach(el => revealObserver.observe(el));

  /* ─── Ripple effect on buttons ─── */
  document.querySelectorAll('.btn, .btn-cv').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      circle.style.cssText = `
        position:absolute;pointer-events:none;
        width:${diameter}px;height:${diameter}px;
        border-radius:50%;background:rgba(255,255,255,0.3);
        transform:scale(0);animation:_ripple .5s linear forwards;
        left:${e.clientX - rect.left - diameter / 2}px;
        top:${e.clientY - rect.top - diameter / 2}px;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 500);
    });
  });

  if (!document.getElementById('_ripple-style')) {
    const s = document.createElement('style');
    s.id = '_ripple-style';
    s.textContent = '@keyframes _ripple { to { transform:scale(2.5); opacity:0; } }';
    document.head.appendChild(s);
  }

  /* ─── Belt stripe hover ─── */
  const rankCircle = document.querySelector('.rank-circle');
  if (rankCircle) {
    rankCircle.addEventListener('mouseenter', () => {
      rankCircle.style.boxShadow = '0 0 0 12px rgba(30,58,95,0.10), 0 12px 40px rgba(30,58,95,0.18)';
    });
    rankCircle.addEventListener('mouseleave', () => {
      rankCircle.style.boxShadow = '';
    });
  }

  /* ─── Resize: close menu if going wide ─── */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });

  /* ─── Gallery preview lightbox ─── */
  const previewGrid = document.querySelector('.gallery-preview-grid');
  if (previewGrid) {
    const previewItems = [...previewGrid.querySelectorAll('.gallery-item:not(.gallery-see-more-card)')];
    const previewLightbox = document.getElementById('preview-lightbox');
    const previewLbImg    = document.getElementById('preview-lb-img');
    const previewLbCount  = document.getElementById('preview-lb-counter');
    const previewTotal    = previewItems.length;
    let previewCurrent    = 0;

    const pSrcs = previewItems.map(el => el.querySelector('img').src);
    const pAlts = previewItems.map(el => el.querySelector('img').alt);

    function openPreview(idx) {
      previewCurrent = (idx + previewTotal) % previewTotal;
      previewLbImg.src = pSrcs[previewCurrent];
      previewLbImg.alt = pAlts[previewCurrent];
      previewLbCount.textContent = `${previewCurrent + 1} / ${previewTotal}`;
      previewLightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      previewLbImg.style.animation = 'none';
      previewLbImg.offsetHeight;
      previewLbImg.style.animation = '';
    }

    function closePreview() {
      previewLightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    previewItems.forEach((item, idx) => {
      item.addEventListener('click', () => openPreview(idx));
    });

    document.getElementById('preview-lb-close').addEventListener('click', closePreview);
    document.getElementById('preview-lb-prev').addEventListener('click', e => { e.stopPropagation(); openPreview(previewCurrent - 1); });
    document.getElementById('preview-lb-next').addEventListener('click', e => { e.stopPropagation(); openPreview(previewCurrent + 1); });
    previewLightbox.addEventListener('click', e => { if (e.target === previewLightbox) closePreview(); });

    document.addEventListener('keydown', e => {
      if (!previewLightbox.classList.contains('active')) return;
      if (e.key === 'Escape')     closePreview();
      if (e.key === 'ArrowLeft')  openPreview(previewCurrent - 1);
      if (e.key === 'ArrowRight') openPreview(previewCurrent + 1);
    });

    let pTouchX = 0;
    previewLightbox.addEventListener('touchstart', e => { pTouchX = e.touches[0].clientX; }, { passive: true });
    previewLightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - pTouchX;
      if (Math.abs(dx) > 50) openPreview(dx < 0 ? previewCurrent + 1 : previewCurrent - 1);
    });
  }

});
