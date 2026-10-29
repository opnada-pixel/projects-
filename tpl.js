/* El Alfy Holding — project templates motion engine. No dependencies.
   Attributes:
   data-r            fade + rise when scrolled into view (use style="--d:n" to stagger)
   data-wipe         image reveals from the bottom ("side" = from left, "iris" = from centre)
   data-split        heading rises word by word; data-split="lines" rises line by line (split on <br>)
   data-line         a rule that draws left to right
   data-count        number counts up; optional data-dec
   data-par="0.12"   parallax strength on an image inside an overflow:hidden box
   data-progress     sets --p (0→1) as the element passes through the viewport
   data-pin          pinned horizontal gallery: needs a child .track
   data-lightbox     click to enlarge (caption = attribute value)
*/
(function () {
  var d = document.documentElement;
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var stat = /[?&]static\b/.test(location.search);
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = !stat && !reduce && 'IntersectionObserver' in window;
  d.classList.add(motion ? 'js-motion' : 'html-static');

  /* ---- nav: stays visible; transparent over a dark hero, solid elsewhere ---- */
  var nav = document.querySelector('.nav'), lastY = 0;
  function navUpd() {
    if (!nav) return;
    var y = scrollY, dark = document.querySelector('[data-dark-hero]');
    var overDark = dark && y < dark.offsetHeight - 80;
    nav.classList.toggle('on-dark', !!overDark);
    nav.classList.toggle('solid', !overDark && (y > 20 || !dark));
    lastY = y;
  }

  /* ---- counters (finish instantly when static) ---- */
  q('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0);
    var f = function (v) { return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
    if (!motion) { el.textContent = f(end); return; }
    el.textContent = f(0);
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; o.disconnect();
      var t0 = performance.now(), D = 1900;
      (function tick(n) { var p = Math.min(1, (n - t0) / D), e = 1 - Math.pow(1 - p, 4); el.textContent = f(end * e); if (p < 1) requestAnimationFrame(tick); })(t0);
    }, { threshold: .5 });
    o.observe(el);
  });

  /* ---- lightbox ---- */
  var lb;
  q('[data-lightbox]').forEach(function (fig) {
    fig.setAttribute('tabindex', '0'); fig.setAttribute('role', 'button');
    function open() {
      var img = fig.querySelector('img'); if (!img) return;
      if (!lb) {
        lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
        lb.innerHTML = '<button class="x sc" type="button">Close</button><img alt=""><span class="cap sc"></span>';
        document.body.appendChild(lb);
        var close = function () { lb.classList.remove('open'); };
        lb.querySelector('.x').onclick = close; lb.onclick = function (e) { if (e.target === lb) close(); };
        addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      }
      lb.querySelector('img').src = img.currentSrc || img.src; lb.querySelector('img').alt = img.alt;
      lb.querySelector('.cap').textContent = fig.getAttribute('data-lightbox') || img.alt;
      lb.classList.add('open'); lb.querySelector('.x').focus();
    }
    fig.addEventListener('click', open);
    fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  /* ---- pinned horizontal galleries (desktop + motion only) ---- */
  var pins = q('[data-pin]').map(function (box) { return { box: box, track: box.querySelector('.track') }; });
  function pinSize() {
    pins.forEach(function (p) {
      var off = !motion || innerWidth < 900;
      p.box.classList.toggle('pin-off', off);
      if (off) { p.box.style.height = ''; p.track.style.transform = ''; return; }
      p.box.style.height = (p.track.scrollWidth - innerWidth + innerHeight) + 'px';
    });
  }

  /* ---- mobile menu ---- */
  var mb = nav && nav.querySelector('.menu');
  if (mb) mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu'; });

  /* ---- review switcher: move between the templates ---- */
  var T = [['template-a-editorial.html', 'A', 'Editorial'], ['template-b-material.html', 'B', 'Material'], ['template-c-scale.html', 'C', 'Scale'], ['template-d-journey.html', 'D', 'Journey'], ['template-e-immersive.html', 'E', 'Immersive']];
  var here = location.pathname.split('/').pop(), keep = stat ? '?static' : '';
  if (T.some(function (t) { return t[0] === here; })) {
    var sw = document.createElement('nav'); sw.className = 'review'; sw.setAttribute('aria-label', 'Template review');
    sw.innerHTML = '<span class="sc">Template</span>' + T.map(function (t) {
      return '<a href="' + t[0] + keep + '"' + (t[0] === here ? ' aria-current="page"' : '') + '><b>' + t[1] + '</b><span>' + t[2] + '</span></a>';
    }).join('');
    document.body.appendChild(sw);
  }

  /* ---- before / after compare (works with or without motion): range input drives --x ---- */
  q('[data-compare]').forEach(function (box) {
    var r = box.querySelector('input[type=range]'), set = function (v) { box.style.setProperty('--x', v + '%'); };
    set(r ? r.value : 50); if (r) r.addEventListener('input', function () { set(r.value); });
  });

  /* ---- scrollytelling: [data-steps] holds [data-step="n"] panels and [data-step-label="n"] labels ---- */
  q('[data-steps]').forEach(function (wrap) {
    var labels = q('[data-step-label]', wrap), panels = q('[data-step]', wrap);
    function on(n) { labels.forEach(function (l) { l.classList.toggle('active', l.getAttribute('data-step-label') === n); }); wrap.style.setProperty('--step', n); }
    on(panels.length ? panels[0].getAttribute('data-step') : '1');
    if (!('IntersectionObserver' in window)) return;
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) on(e.target.getAttribute('data-step')); }); }, { rootMargin: '-45% 0px -45% 0px' });
    panels.forEach(function (pn) { so.observe(pn); });
  });

  addEventListener('scroll', navUpd, { passive: true }); navUpd();
  if (!motion) { pinSize(); q('[data-progress]').forEach(function (el) { el.style.setProperty('--p', '1'); }); return; }

  /* ---- split headings ---- */
  q('[data-split]').forEach(function (el) {
    if (el.getAttribute('data-split') === 'lines') {
      el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(function (p, i) { return '<span class="ln" style="--i:' + (i * 2) + '"><span>' + p + '</span></span>'; }).join('');
      return;
    }
    var i = 0;
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'wd'; o.style.setProperty('--i', i++);
            var x = document.createElement('span'); x.textContent = w; o.appendChild(x); f.appendChild(o);
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
  });
  q('.chips, .facts').forEach(function (g) { q('span, div', g).forEach(function (c, i) { if (c.parentNode === g) c.style.setProperty('--i', i); }); });

  /* ---- reveal observer; clip-path hides a target from IntersectionObserver, so wipes use their parent as proxy ---- */
  var proxy = new Map();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      (proxy.get(e.target) || [e.target]).forEach(function (t) { t.classList.add('is-in'); });
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: .06 });
  q('[data-r],[data-split],[data-line],.chips,.facts,.mat,.sw').forEach(function (el) { io.observe(el); });
  q('[data-wipe]').forEach(function (el) { var p = el.parentNode; if (!proxy.has(p)) { proxy.set(p, []); io.observe(p); } proxy.get(p).push(el); });
  function endCheck() { if (innerHeight + scrollY >= d.scrollHeight - 4) q('[data-r],[data-wipe],[data-split],[data-line],.chips,.facts').forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---- scroll-linked: progress bar, parallax, --p, pinned tracks ---- */
  var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  var par = q('[data-par]'), prog = q('[data-progress]'), stack = q('[data-stack] > *'), ticking = false;
  par.forEach(function (el) { el.style.scale = '1.16'; });
  function run() {
    var vh = innerHeight, H = d.scrollHeight - vh;
    bar.style.setProperty('--sp', H > 0 ? (scrollY / H).toFixed(4) : 0);
    par.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
      var k = parseFloat(el.getAttribute('data-par')) || .12;
      el.style.translate = '0 ' + ((r.top + r.height / 2 - vh / 2) * -k).toFixed(1) + 'px';
    });
    prog.forEach(function (el) {
      var r = el.getBoundingClientRect(), mode = el.getAttribute('data-progress');
      var p = mode === 'stick' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (r.height + vh);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
    });
    /* stacked cards: as card i+1 slides over card i, --c on card i goes 0 → 1 */
    stack.forEach(function (c, i) {
      var nx = stack[i + 1]; if (!nx) return;
      var t = nx.getBoundingClientRect().top; c.style.setProperty('--c', Math.min(1, Math.max(0, 1 - t / vh)).toFixed(4));
    });
    pins.forEach(function (p) {
      if (p.box.classList.contains('pin-off')) return;
      var r = p.box.getBoundingClientRect(), max = p.track.scrollWidth - innerWidth;
      var t = Math.min(1, Math.max(0, -r.top / (p.box.offsetHeight - vh)));
      p.track.style.transform = 'translate3d(' + (-t * max).toFixed(1) + 'px,0,0)';
      p.box.style.setProperty('--p', t.toFixed(4));
    });
    endCheck(); ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', function () { pinSize(); run(); });
  addEventListener('load', function () { pinSize(); run(); });
  pinSize(); run();

  /* ---- magnetic buttons ---- */
  if (matchMedia('(hover:hover)').matches) q('.btn, .next .arr').forEach(function (b) {
    b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .2).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px)'; });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });

  requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('ready'); }); });
})();
