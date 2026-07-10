// Brand Name Changes — site interactions.
// Base UI has zero dependencies. The tactile layer (home only) progressively
// enhances IF gsap + anime.js are present. Everything is guarded so the shared
// subpages, no-JS, touch, and reduced-motion all get a clean experience.
(function () {
  var docEl = document.documentElement;
  var REDUCE = docEl.classList.contains('no-motion');
  var hasAnime = typeof anime !== 'undefined';
  var hasGsap  = typeof gsap !== 'undefined';

  /* ── Sticky-nav border on scroll ──────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile menu toggle ───────────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* ── Reveal-on-scroll ─────────────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Legacy equaliser motif (subpages / no-tactile) ───────────────────── */
  document.querySelectorAll('.eq span').forEach(function (bar, i) {
    bar.style.animationDelay = (i * 0.07 + Math.random() * 0.2).toFixed(2) + 's';
    bar.style.animationDuration = (1.1 + Math.random() * 0.9).toFixed(2) + 's';
  });

  /* ── Footer year ──────────────────────────────────────────────────────── */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ========================================================================
     TACTILE LAYER (home) — kinetic wordmark, cursor, tilt, parallax.
     ===================================================================== */

  // A tiny rAF ticker shared by the smooth-follow effects.
  var ticks = [];
  var ticking = false;
  function startTicker() {
    if (ticking) return; ticking = true;
    (function loop() { for (var i = 0; i < ticks.length; i++) ticks[i](); requestAnimationFrame(loop); })();
  }

  /* ── Kinetic wordmark: cycle the product names, then spring-assemble ───── */
  var wm = document.querySelector('.wm-inner');
  if (wm) {
    var ROSTER = ['Cadence', 'SolarReach', 'Loom', 'Grove', 'Quantdesk', 'Propintel', 'Narrative Studio'];
    var FINAL = 'Brand Name Changes';

    function splitLetters(el, text) {
      el.textContent = '';
      var frag = document.createDocumentFragment();
      text.split('').forEach(function (ch) {
        if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = 'wm-char'; s.textContent = ch;
        frag.appendChild(s);
      });
      el.appendChild(frag);
      return el.querySelectorAll('.wm-char');
    }

    function introReveal() {
      if (!hasAnime) { return; }
      anime({
        targets: '.hero-inner .anim-in', opacity: [0, 1], translateY: [22, 0],
        delay: anime.stagger(90, { start: 120 }), duration: 820, easing: 'easeOutExpo'
      });
      anime({
        targets: '.hero-chips .chip', opacity: [0, 1], scale: [0.55, 1],
        delay: anime.stagger(75, { start: 260, from: 'center' }), duration: 900, easing: 'spring(1, 68, 11, 0)'
      });
    }

    function assemble() {
      wm.classList.remove('cycling');
      wm.style.cssText = ''; // clear flick residue from the container
      var chars = splitLetters(wm, FINAL);
      // Snap letters to their exact natural position — kills any spring sub-pixel drift.
      var settle = function () { chars.forEach(function (c) { c.style.transform = ''; c.style.opacity = ''; }); };
      if (!hasAnime) { settle(); introReveal(); return; }
      anime.set(chars, {
        translateX: function () { return anime.random(-280, 280); },
        translateY: function () { return anime.random(-160, 160); },
        rotate:     function () { return anime.random(-90, 90); },
        scale: 0.3, opacity: 0
      });
      anime({
        targets: chars, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1,
        delay: anime.stagger(26, { from: 'center' }), duration: 1000, easing: 'spring(1, 80, 12, 0)',
        complete: settle
      });
      setTimeout(settle, 2600); // hard safety net for any environment where the spring never fires 'complete'
      introReveal();
    }

    if (REDUCE || !hasAnime) {
      // Calm path: no flicker, no scatter — just the final name.
      splitLetters(wm, FINAL).forEach(function (c) { c.style.opacity = 1; });
    } else {
      wm.classList.add('cycling');
      var i = 0;
      (function flick() {
        if (i >= ROSTER.length) { assemble(); return; }
        wm.textContent = ROSTER[i];
        anime.remove(wm);
        var accent = i % 2 ? '#7A2BFF' : '#FF2D78';
        anime({ targets: wm, opacity: [0, 1], translateY: [18, 0], translateX: [anime.random(-10, 10), 0], skewX: ['10deg', '0deg'], scale: [1.14, 1], color: [accent, '#ffffff'], duration: 150, easing: 'easeOutExpo' });
        i++;
        setTimeout(flick, 165);
      })();
    }
  }

  /* ── Magnetic cursor ──────────────────────────────────────────────────── */
  var finePointer = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var cursor = document.querySelector('.cursor');
  if (cursor && finePointer && !REDUCE) {
    docEl.classList.add('has-cursor');
    var dot = cursor.querySelector('.cursor-dot');
    var ring = cursor.querySelector('.cursor-ring');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
    window.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
    document.querySelectorAll('a, button, summary, .tilt, [data-cursor]').forEach(function (el) {
      el.addEventListener('pointerenter', function () { cursor.classList.add('is-hot'); });
      el.addEventListener('pointerleave', function () { cursor.classList.remove('is-hot'); });
    });
    ticks.push(function () {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform  = 'translate(' + (mx - 3.5) + 'px,' + (my - 3.5) + 'px)';
      ring.style.transform = 'translate(' + (rx - 20) + 'px,' + (ry - 20) + 'px)';
    });
    startTicker();
  }

  /* ── Magnetic buttons (smooth pull toward cursor) ─────────────────────── */
  if (finePointer && !REDUCE) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }, active = false, strength = 0.4;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        tgt.x = (e.clientX - (r.left + r.width / 2)) * strength;
        tgt.y = (e.clientY - (r.top + r.height / 2)) * strength;
      });
      el.addEventListener('pointerenter', function () { active = true; });
      el.addEventListener('pointerleave', function () { tgt.x = 0; tgt.y = 0; });
      ticks.push(function () {
        cur.x += (tgt.x - cur.x) * 0.16; cur.y += (tgt.y - cur.y) * 0.16;
        if (Math.abs(cur.x) < 0.05 && Math.abs(cur.y) < 0.05 && !active) return;
        el.style.transform = 'translate(' + cur.x.toFixed(2) + 'px,' + cur.y.toFixed(2) + 'px)';
      });
    });
    if (document.querySelector('.magnetic')) startTicker();
  }

  /* ── 3D tilt cards (with cursor-tracked glare) ────────────────────────── */
  if (finePointer && !REDUCE) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointerenter', function () { el.classList.add('tilting'); });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg)';
        el.style.setProperty('--mx', (px * 100 + 50).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100 + 50).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('tilting');
        el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* ── Scroll parallax on floating chips (GSAP) ─────────────────────────── */
  if (hasGsap && typeof ScrollTrigger !== 'undefined' && !REDUCE) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.chip').forEach(function (chip) {
      var depth = parseFloat(chip.getAttribute('data-depth') || '0.4');
      gsap.to(chip, {
        yPercent: -140 * depth, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }
})();
