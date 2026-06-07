/* ============================================================
   GREATBRIDGE ACADEMY — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ──────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.top = mouseY + 'px';
      cursor.style.left = mouseX + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.top = followerY + 'px';
      follower.style.left = followerX + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverEls = document.querySelectorAll('a, button, .program-card, .pillar, .cf-item, .news-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
        follower.style.opacity = '0.2';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.opacity = '0.5';
      });
    });
  }

  /* ── Navbar Scroll ──────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Mobile Menu ────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    const spans = menuToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Count-up animation ─────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  function countUp(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));

  /* ── Testimonials Carousel ──────────────────────────────── */
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('tPrev');
  const nextBtn  = document.getElementById('tNext');
  const dotsWrap = document.getElementById('tDots');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let current = 0;

    function visibleCount() {
      return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const pageCount = Math.ceil(cards.length / visibleCount());
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'tn-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(page) {
      const vc = visibleCount();
      const maxPage = Math.ceil(cards.length / vc) - 1;
      current = Math.max(0, Math.min(page, maxPage));
      cards.forEach((card, idx) => {
        const start = current * vc;
        card.style.display = (idx >= start && idx < start + vc) ? 'block' : 'none';
      });
      dotsWrap.querySelectorAll('.tn-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
    buildDots();
    goTo(0);

    setInterval(() => {
      const maxPage = Math.ceil(cards.length / visibleCount()) - 1;
      goTo(current < maxPage ? current + 1 : 0);
    }, 5000);
  }

  /* ── Contact Form ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1200);
    });
  }

  /* ── Smooth scroll ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
        window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav highlight ───────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) a.style.color = 'var(--gold)';
    });
  }, { passive: true });

  /* ── Parallax hero orbs ─────────────────────────────────── */
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${scrollY * (i + 1) * 0.08}px)`;
    });
  }, { passive: true });

  /* ── Gallery Filter & Lightbox ──────────────────────────── */
  const tabs         = document.querySelectorAll('.gtab');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lbImg');
  const lbPlaceholder= document.getElementById('lbPlaceholder');
  const lbIcon       = document.getElementById('lbIcon');
  const lbCat        = document.getElementById('lbCat');
  const lbTitle      = document.getElementById('lbTitle');
  const lbClose      = document.getElementById('lbClose');
  const lbPrev       = document.getElementById('lbPrev');
  const lbNext       = document.getElementById('lbNext');

  let activeItems = [];
  let lbIndex = 0;

  // When filter tab is clicked, show/hide items
  // but also respect which gallery items are currently visible (not hidden-item)
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      galleryItems.forEach(item => {
        // If item is an extra (hidden by load more) keep it hidden regardless of filter
        const isExtra = item.dataset.extra === 'gallery' && item.classList.contains('hidden-item');
        if (isExtra) return;
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  function getActiveItems() {
    return Array.from(galleryItems).filter(item =>
      !item.classList.contains('hidden') &&
      !item.classList.contains('hidden-item') &&
      !item.classList.contains('gallery-item--quote')
    );
  }

  function openLightbox(item) {
    activeItems = getActiveItems();
    lbIndex = activeItems.indexOf(item);
    showLightboxItem(lbIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showLightboxItem(index) {
    const item = activeItems[index];
    if (!item) return;
    const img   = item.querySelector('img');
    const icon  = item.querySelector('.gi-ph-icon');
    const cat   = item.querySelector('.gi-cat');
    const title = item.querySelector('.gi-title');

    lbCat.textContent   = cat   ? cat.textContent   : '';
    lbTitle.textContent = title ? title.textContent : '';

    if (img && img.complete && img.naturalWidth > 0) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbImg.classList.add('loaded');
      lbPlaceholder.style.display = 'none';
    } else {
      lbImg.classList.remove('loaded');
      lbPlaceholder.style.display = 'flex';
      lbIcon.textContent = icon ? icon.textContent : '🖼️';
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    galleryItems.forEach(item => {
      if (item.classList.contains('gallery-item--quote')) return;
      item.addEventListener('click', () => openLightbox(item));
    });
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lbPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      lbIndex = (lbIndex - 1 + activeItems.length) % activeItems.length;
      showLightboxItem(lbIndex);
    });
    lbNext.addEventListener('click', (e) => {
      e.stopPropagation();
      lbIndex = (lbIndex + 1) % activeItems.length;
      showLightboxItem(lbIndex);
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + activeItems.length) % activeItems.length; showLightboxItem(lbIndex); }
      if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % activeItems.length; showLightboxItem(lbIndex); }
    });
  }

  /* ══════════════════════════════════════════════════════════
     SHOW MORE / LOAD MORE BUTTONS
  ══════════════════════════════════════════════════════════ */

  /**
   * Generic show-more toggle
   * @param {string} btnId       — id of the button
   * @param {string} extraAttr   — value of data-extra on the hidden items
   * @param {string} showLabel   — button label when items are hidden
   * @param {string} hideLabel   — button label when items are shown
   */
  function initShowMore(btnId, extraAttr, showLabel, hideLabel) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const items = document.querySelectorAll(`[data-extra="${extraAttr}"]`);
    let expanded = false;

    btn.addEventListener('click', () => {
      expanded = !expanded;
      items.forEach(item => {
        item.classList.toggle('hidden-item', !expanded);
        // Trigger reveal animation for newly shown items
        if (expanded && !item.classList.contains('visible')) {
          setTimeout(() => item.classList.add('visible'), 50);
        }
      });
      // Update button text & arrow
      btn.querySelector('.btn-arrow') && (btn.querySelector('.btn-arrow').textContent = expanded ? '▴' : '▾');
      btn.classList.toggle('expanded', expanded);
      const textNode = btn.childNodes[0];
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = expanded ? hideLabel + ' ' : showLabel + ' ';
      }
    });
  }

  // Junior School Subjects — show 6 / hide 6
  initShowMore('subjectsToggle', 'subjects', 'View More Subjects', 'Show Less');

  // Academic Programmes — show 3 / hide 3
  initShowMore('programmesToggle', 'programmes', 'View More Programmes', 'Show Less');

  // Admission Forms — show 2 / hide 3
  initShowMore('admissionToggle', 'admission', 'View All Forms', 'Show Less');

  // Gallery Load More — show 8 / hide rest
  initShowMore('galleryToggle', 'gallery', 'Load More Photos', 'Show Less');

  /* ══════════════════════════════════════════════════════════
     ACCORDION — School Rules
  ══════════════════════════════════════════════════════════ */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const body = trigger.nextElementSibling;
      const isOpen = trigger.classList.contains('open');

      // Close all others (one open at a time)
      accordionTriggers.forEach(t => {
        t.classList.remove('open');
        t.nextElementSibling.classList.remove('open');
      });

      // Toggle clicked one
      if (!isOpen) {
        trigger.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  // Open first accordion by default so users know it's clickable
  if (accordionTriggers.length > 0) {
    accordionTriggers[0].classList.add('open');
    accordionTriggers[0].nextElementSibling.classList.add('open');
  }

});