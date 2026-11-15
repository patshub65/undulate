/* Motion layer, taken from Ladenkit (ported there from Tinker & Borrow). Vanilla, no build step.
   Contract (attributes in the markup):
     data-reveal                 rises and fades in when it enters the viewport
     data-reveal-stagger         on a container: its [data-reveal] children follow each other
     img data-fade               fades in once loaded
     data-parallax [data-parallax-range="30"]   drifts +-range px while crossing the viewport
     data-tuck                   hides on scroll down, returns on scroll up
     data-hscroll                horizontal strip, draggable with a mouse
   Smooth scrolling uses Lenis when window.Lenis is loaded.
   Loaded as a classic script in src/layouts/BaseLayout.astro (CSS: src/motion/motion.css). Variations use the attributes, never their own scroll JS. */
(function () {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function smoothScroll() {
    if (reduced() || !window.Lenis) return null;
    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.6,
    });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href*="#"]').forEach(link => {
      const url = new URL(link.href, location.href);
      if (url.hash.length <= 1 || url.pathname !== location.pathname) return;
      link.addEventListener('click', e => {
        const target = document.querySelector(url.hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target);
        history.pushState(null, '', url.hash);
      });
    });
    return lenis;
  }

  function reveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
    const step = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--reveal-step')) || 90;
    document.querySelectorAll('[data-reveal-stagger]').forEach(group => {
      [...group.querySelectorAll('[data-reveal]')].filter(el => el.closest('[data-reveal-stagger]') === group)
        .forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * step}ms`));
    });
    // Anything already on screen at load shows at once. The -12% margin below only suits elements that scroll in;
    // a pinned (sticky) element that starts in the bottom 12% would otherwise never reveal.
    const vh = innerHeight;
    els.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add('is-visible'); });
    const io = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(el => { if (!el.classList.contains('is-visible')) io.observe(el); });
    // At the very bottom of the page, the last elements can never rise above the -12% line: show what is on screen.
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (innerHeight + scrollY < document.documentElement.scrollHeight - 2) return;
        els.forEach(el => { const r = el.getBoundingClientRect(); if (!el.classList.contains('is-visible') && r.top < innerHeight && r.bottom > 0) { el.classList.add('is-visible'); io.unobserve(el); } });
      });
    }, { passive: true });
  }

  function imageFade() {
    document.querySelectorAll('img[data-fade]').forEach(img => {
      const done = () => img.classList.add('is-loaded');
      if (reduced() || (img.complete && img.naturalWidth > 0)) return done();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  function parallax() {
    const els = [...document.querySelectorAll('[data-parallax]')];
    if (!els.length || reduced()) return;
    const active = new Set(), applied = new WeakMap();
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting ? active.add(e.target) : active.delete(e.target)), { rootMargin: '20% 0px' });
    els.forEach(el => io.observe(el));
    let ticking = false;
    function update() {
      const vh = innerHeight;
      active.forEach(el => {
        const r = el.getBoundingClientRect();
        const top = r.top - (applied.get(el) || 0);             // measure the untransformed position
        const progress = Math.max(-1, Math.min(1, 1 - (2 * (top + r.height / 2)) / (vh + r.height)));
        const py = progress * (parseFloat(el.dataset.parallaxRange) || 30);
        applied.set(el, py);
        el.style.setProperty('--py', `${py.toFixed(2)}px`);
      });
      ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  }

  function tuck() {
    const els = document.querySelectorAll('[data-tuck]');
    if (!els.length || reduced()) return;
    let lastY = scrollY, ticking = false;
    function update() {
      const y = Math.max(0, scrollY);
      if (Math.abs(y - lastY) > 6) { els.forEach(el => el.classList.toggle('is-tucked', y > lastY && y > 160)); lastY = y; }
      ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  }

  function hscroll() {
    document.querySelectorAll('[data-hscroll]').forEach(el => {
      let down = false, startX = 0, startLeft = 0, moved = false;
      el.setAttribute('data-lenis-prevent-horizontal', '');
      el.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
      });
      el.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = e.clientX - startX;
        // capture only once it is a drag: capturing on pointerdown sends a plain click to the strip, not to a link in it
        if (!moved && Math.abs(dx) > 3) { moved = true; el.setPointerCapture(e.pointerId); el.classList.add('is-dragging'); }
        el.scrollLeft = startLeft - dx;
      });
      const release = e => { if (!down) return; down = false; el.classList.remove('is-dragging'); try { el.releasePointerCapture(e.pointerId); } catch (_) {} };
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    });
  }

  window.UndulateMotion = {
    // Set early (before content renders) so revealed elements start hidden instead of flashing.
    gate() { if (!reduced()) document.documentElement.classList.add('motion'); },
    init() { const lenis = smoothScroll(); reveal(); imageFade(); parallax(); tuck(); hscroll(); return lenis; },
  };
})();
