// Brand Name Changes — site interactions.
// Base UI is dependency-free. The home motion layer progressively enhances IF
// anime.js is present, and is fully guarded so shared subpages, no-JS, touch
// and reduced-motion all get a clean experience.
(function () {
  var docEl = document.documentElement;
  var REDUCE = docEl.classList.contains('no-motion');
  var hasAnime = typeof anime !== 'undefined';

  /* Sticky-nav border on scroll */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu toggle */
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

  /* Reveal-on-scroll */
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

  /* Footer year */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ===== HOME MOTION: kinetic wordmark, cursor, magnetic, tilt ===== */
  var ticks = [], ticking = false;
  function startTicker() {
    if (ticking) return; ticking = true;
    (function loop() { for (var i = 0; i < ticks.length; i++) ticks[i](); requestAnimationFrame(loop); })();
  }

  /* Kinetic wordmark: slow name crossfade -> word-mask reveal */
  var wm = document.querySelector('.wm-inner');
  if (wm) {
    var ROSTER = ['Cadence', 'SolarReach', 'Loom', 'Quantdesk', 'Propintel', 'Narrative Studio'];
    var FINAL = 'Brand Name Changes';

    function introReveal() {
      if (!hasAnime) return;
      anime({ targets: '.anim-in', opacity: [0, 1], translateY: [16, 0], delay: anime.stagger(110, { start: 60 }), duration: 800, easing: 'easeOutExpo' });
      anime({ targets: '.wm-rule', scaleX: [0, 1], duration: 720, easing: 'easeInOutQuart', delay: 260 });
    }

    function assemble() {
      wm.style.cssText = '';
      wm.innerHTML = FINAL.split(' ').map(function (w) {
        return '<span class="wm-word"><span class="wm-word-in">' + w + '</span></span>';
      }).join(' ');
      var ins = wm.querySelectorAll('.wm-word-in');
      var settle = function () { ins.forEach(function (x) { x.style.transform = ''; }); };
      if (!hasAnime) { settle(); return; }
      anime.set(ins, { translateY: '110%' });
      anime({ targets: ins, translateY: ['110%', '0%'], duration: 860, delay: anime.stagger(110), easing: 'cubicBezier(.2,.85,.25,1)', complete: settle });
      setTimeout(settle, 2200);
      introReveal();
    }

    if (REDUCE || !hasAnime) {
      wm.textContent = FINAL; docEl.classList.add('no-motion'); // static fallback reveals anim-in
    } else {
      var i = 0;
      (function cycle() {
        if (i >= ROSTER.length) { assemble(); return; }
        wm.textContent = ROSTER[i]; i++;
        anime.remove(wm);
        anime.timeline({ easing: 'easeOutCubic' })
          .add({ targets: wm, opacity: [0, 1], translateY: ['0.4em', '0em'], duration: 200 })
          .add({ targets: wm, opacity: [1, 0], translateY: ['0em', '-0.34em'], duration: 170, delay: 190, complete: cycle });
      })();
    }
  }

  /* Magnetic cursor (mix-blend difference, monochrome) */
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
    document.querySelectorAll('a, button, summary, .tilt, .product-row').forEach(function (el) {
      el.addEventListener('pointerenter', function () { cursor.classList.add('is-hot'); });
      el.addEventListener('pointerleave', function () { cursor.classList.remove('is-hot'); });
    });
    ticks.push(function () {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      dot.style.transform  = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      ring.style.transform = 'translate(' + (rx - 17) + 'px,' + (ry - 17) + 'px)';
    });
    startTicker();
  }

  /* Magnetic buttons (subtle pull) */
  if (finePointer && !REDUCE) {
    var mags = document.querySelectorAll('.magnetic');
    mags.forEach(function (el) {
      var cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }, active = false, strength = 0.32;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        tgt.x = (e.clientX - (r.left + r.width / 2)) * strength;
        tgt.y = (e.clientY - (r.top + r.height / 2)) * strength;
      });
      el.addEventListener('pointerenter', function () { active = true; });
      el.addEventListener('pointerleave', function () { tgt.x = 0; tgt.y = 0; active = false; });
      ticks.push(function () {
        cur.x += (tgt.x - cur.x) * 0.16; cur.y += (tgt.y - cur.y) * 0.16;
        if (Math.abs(cur.x) < 0.05 && Math.abs(cur.y) < 0.05 && !active) { el.style.transform = ''; return; }
        el.style.transform = 'translate(' + cur.x.toFixed(2) + 'px,' + cur.y.toFixed(2) + 'px)';
      });
    });
    if (mags.length) startTicker();
  }

  /* Subtle 3D tilt on cards */
  if (finePointer && !REDUCE) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointerenter', function () { el.classList.add('tilting'); });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1000px) rotateY(' + (px * 5).toFixed(2) + 'deg) rotateX(' + (-py * 5).toFixed(2) + 'deg)';
        el.style.setProperty('--mx', (px * 100 + 50).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100 + 50).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('tilting');
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }
})();
