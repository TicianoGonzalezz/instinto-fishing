/* ==========================================================================
   Instinto Fishing · Interacciones de la landing
   ========================================================================== */
(() => {
  'use strict';

  const { config: CFG, models: MODELS, colors: COLORS, promos: PROMOS } = window.GF;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const pad = (n) => String(n).padStart(2, '0');
  const money = (n) => '$' + n.toLocaleString('es-UY');
  const variantCode = (m, c) => m.code + pad(c);
  const lureSrc = (m, c) => `assets/img/lures/${variantCode(m, c).toLowerCase()}.webp`;
  const waHref = (msg) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(CFG.greeting + msg)}`;
  const variantMsg = (m, c) =>
    `Quiero pedir el señuelo ${variantCode(m, c)} · ${m.name} · ${COLORS[c].name} (${COLORS[c].detail.toLowerCase()}).`;

  /* ---------- Links de contacto ---------- */
  function initContactLinks() {
    $$('[data-wa]').forEach((a) => {
      a.href = waHref(a.dataset.waMsg || 'Quiero hacer una consulta.');
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-ig]').forEach((a) => {
      a.href = `https://www.instagram.com/${CFG.instagram}/`;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-ig-handle]').forEach((el) => (el.textContent = '@' + CFG.instagram));
    $$('[data-wa-display]').forEach((el) => (el.textContent = CFG.whatsappDisplay));
    $$('[data-bulk-qty]').forEach((el) => (el.textContent = CFG.bulkDiscount.minQty));
    $$('[data-bulk-percent]').forEach((el) => (el.textContent = CFG.bulkDiscount.percent + '%'));
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- Muestras de color ---------- */
  function swatch(c) {
    const col = COLORS[c];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sw';
    b.dataset.color = c;
    if (col.pattern) b.dataset.pattern = col.pattern;
    b.style.setProperty('--a', col.a);
    b.style.setProperty('--b', col.b);
    b.title = `${pad(c)} · ${col.name}`;
    b.setAttribute('aria-label', `${col.name}: ${col.detail}`);
    b.setAttribute('aria-pressed', 'false');
    return b;
  }

  // Cambia la imagen esperando a que la nueva esté cargada (evita parpadeos al pasar rápido)
  function swapImage(img, src, alt) {
    if (img.dataset.src === src) return;
    img.dataset.src = src;
    img.classList.add('is-swapping');
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      if (img.dataset.src !== src) return;
      img.src = src;
      img.alt = alt;
      requestAnimationFrame(() => img.classList.remove('is-swapping'));
    };
    pre.src = src;
  }

  /* ---------- Catálogo ---------- */
  const state = { especie: 'all', color: null };
  const cards = new Map();

  function renderCards() {
    const grid = $('#grid');
    const frag = document.createDocumentFragment();

    MODELS.forEach((m, i) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.dataset.id = m.id;
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', `${(i % 3) * 90}ms`);
      el.style.viewTransitionName = `card-${m.id}`;

      const specs = [['Peso', m.specs.peso], ['Medida', m.specs.medida], ['Sonido', m.specs.sonido], ['Tipo', m.specs.tipo]]
        .map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`)
        .join('');
      const price = CFG.showPrices
        ? `<p class="price"><b>${money(m.price)}</b><span>c/u</span></p>`
        : `<p class="price--ask">Consultá precio</p>`;

      el.innerHTML = `
        <button class="card-media" type="button" aria-label="Ver todos los colores de ${m.name}">
          <span class="card-num" aria-hidden="true">${pad(i + 1)}</span>
          <span class="tag tag--${m.especie.toLowerCase()}">${m.especie}</span>
          <img alt="" width="480" height="220" loading="lazy" decoding="async">
          <span class="card-code"></span>
          <span class="card-zoom" aria-hidden="true">Ver colores</span>
        </button>
        <div class="card-body">
          <div>
            <h3 class="card-title">${m.name}</h3>
            <p class="card-tagline">${m.tagline}</p>
          </div>
          <ul class="specs">${specs}</ul>
          <div class="swatches" role="group" aria-label="Colores de ${m.name}"></div>
          <div class="card-foot">
            ${price}
            <a class="btn btn-primary btn-sm card-wa" target="_blank" rel="noopener">
              <svg aria-hidden="true"><use href="#i-wa"/></svg><span>Pedir</span>
            </a>
          </div>
        </div>`;

      const img = $('img', el);
      img.src = lureSrc(m, m.colors[0]);
      img.dataset.src = lureSrc(m, m.colors[0]);

      const sws = $('.swatches', el);
      m.colors.forEach((c) => sws.append(swatch(c)));

      const card = { m, el, img, selected: m.colors[0] };
      cards.set(m.id, card);
      setCardColor(card, m.colors[0]);

      // Previsualizar al pasar por los colores, fijar al hacer click
      sws.addEventListener('pointerover', (e) => {
        const sw = e.target.closest('.sw');
        if (sw) previewCard(card, +sw.dataset.color);
      });
      sws.addEventListener('focusin', (e) => {
        const sw = e.target.closest('.sw');
        if (sw) previewCard(card, +sw.dataset.color);
      });
      sws.addEventListener('pointerleave', () => previewCard(card, card.selected));
      sws.addEventListener('focusout', (e) => {
        if (!sws.contains(e.relatedTarget)) previewCard(card, card.selected);
      });
      sws.addEventListener('click', (e) => {
        const sw = e.target.closest('.sw');
        if (sw) setCardColor(card, +sw.dataset.color);
      });
      $('.card-media', el).addEventListener('click', () => openModal(m, card.selected));

      frag.append(el);
    });

    grid.append(frag);
  }

  function previewCard(card, c) {
    swapImage(card.img, lureSrc(card.m, c), `${card.m.name} color ${COLORS[c].name}`);
    $('.card-code', card.el).textContent = variantCode(card.m, c);
  }

  function setCardColor(card, c) {
    card.selected = c;
    previewCard(card, c);
    $$('.sw', card.el).forEach((sw) => sw.setAttribute('aria-pressed', String(+sw.dataset.color === c)));
    $('.card-wa', card.el).href = waHref(variantMsg(card.m, c));
    $('.card-wa', card.el).setAttribute('aria-label', `Pedir ${variantCode(card.m, c)} por WhatsApp`);
  }

  function renderColorFilter() {
    const wrap = $('#color-filter');
    const all = document.createElement('button');
    all.type = 'button';
    all.className = 'chip is-active';
    all.textContent = 'Todos';
    all.dataset.color = '';
    all.setAttribute('aria-pressed', 'true');
    wrap.append(all);
    Object.keys(COLORS).forEach((c) => wrap.append(swatch(+c)));

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const c = btn.dataset.color ? +btn.dataset.color : null;
      state.color = state.color === c ? null : c;
      syncFilterUI();
      runFilter();
    });
  }

  function initEspecieChips() {
    $('#chips-especie').addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      state.especie = btn.dataset.especie;
      syncFilterUI();
      runFilter();
    });
    $('#reset-filters').addEventListener('click', () => {
      state.especie = 'all';
      state.color = null;
      syncFilterUI();
      runFilter();
    });
  }

  function syncFilterUI() {
    $$('#chips-especie .chip').forEach((b) => {
      const on = b.dataset.especie === state.especie;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('#color-filter button').forEach((b) => {
      const on = b.dataset.color ? +b.dataset.color === state.color : state.color === null;
      b.classList.toggle('is-active', on && b.classList.contains('chip'));
      b.setAttribute('aria-pressed', String(on));
    });
  }

  function applyFilters() {
    let shown = 0;
    MODELS.forEach((m) => {
      const card = cards.get(m.id);
      const visible =
        (state.especie === 'all' || m.especie === state.especie) &&
        (state.color === null || m.colors.includes(state.color));
      card.el.hidden = !visible;
      if (!visible) return;
      shown++;
      if (state.color !== null) setCardColor(card, state.color);
    });

    $('#empty').hidden = shown > 0;
    const parts = [`${shown} ${shown === 1 ? 'modelo' : 'modelos'}`];
    if (state.especie !== 'all') parts.push(state.especie);
    if (state.color !== null) parts.push(COLORS[state.color].name);
    $('#filter-status').textContent = parts.join(' · ');
  }

  function runFilter() {
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(applyFilters);
    else applyFilters();
  }

  /* ---------- Especies ---------- */
  function initSpecies() {
    $$('[data-especie-list]').forEach((wrap) => {
      MODELS.filter((m) => m.especie === wrap.dataset.especieList).forEach((m) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mchip';
        b.textContent = m.name;
        b.addEventListener('click', () => openModal(m, cards.get(m.id).selected));
        wrap.append(b);
      });
    });

    $$('[data-goto-especie]').forEach((btn) =>
      btn.addEventListener('click', () => {
        state.especie = btn.dataset.gotoEspecie;
        state.color = null;
        syncFilterUI();
        applyFilters();
        $('#modelos').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      })
    );
  }

  /* ---------- Promos ---------- */
  function renderPromos() {
    const grid = $('#promo-grid');
    const bestUnit = Math.min(...PROMOS.map((p) => p.price / p.qty));

    PROMOS.forEach((p, i) => {
      const unit = p.price / p.qty;
      const isBest = unit === bestUnit;
      const unitText = `${Number.isInteger(unit) ? '' : '≈ '}${money(Math.round(unit))} por señuelo`;
      const shipping = p.price > CFG.freeShippingFrom ? '<span>Envío gratis</span>' : '';

      const el = document.createElement('article');
      el.className = 'promo' + (isBest ? ' is-best' : '');
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', `${i * 120}ms`);
      el.innerHTML = `
        ${isBest ? '<span class="promo-badge">Mejor precio por unidad</span>' : ''}
        <p class="promo-qty">${p.qty}<small>señuelos</small></p>
        <hr>
        <p class="promo-price">${money(p.price)}</p>
        <p class="promo-unit"><span>${unitText}</span>${shipping}</p>
        <a class="btn ${isBest ? 'btn-light' : 'btn-primary'}" target="_blank" rel="noopener"
           href="${waHref(`Me interesa la promo de ${p.qty} señuelos por ${money(p.price)}.`)}">
          <svg aria-hidden="true"><use href="#i-wa"/></svg><span>Quiero esta promo</span>
        </a>`;
      grid.append(el);
    });
  }

  /* ---------- Modal de modelo ---------- */
  const modal = $('#modal');
  const current = { m: null, c: null };

  function openModal(m, c) {
    current.m = m;
    $('#modal-num').textContent = pad(MODELS.indexOf(m) + 1);
    $('#modal-especie').textContent = `Especie · ${m.especie}`;
    $('#modal-title').textContent = m.name;
    $('#modal-desc').textContent = m.desc;
    $('#modal-specs').innerHTML = [
      ['Peso', m.specs.peso],
      ['Medida', m.specs.medida],
      ['Sonido', m.specs.sonido],
      ['Tipo', m.specs.tipo],
      ['Especie', m.especie],
    ]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('');
    $('#modal-count').textContent = `· ${m.colors.length}`;
    $('#modal-price').innerHTML = CFG.showPrices
      ? `<b>${money(m.price)}</b> c/u · Llevando ${CFG.bulkDiscount.minQty} o más: ${CFG.bulkDiscount.percent}% OFF en el total`
      : '';

    const wrap = $('#modal-variants');
    wrap.innerHTML = '';
    m.colors.forEach((col) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'variant';
      b.dataset.color = col;
      b.title = COLORS[col].name;
      b.setAttribute('aria-label', `${variantCode(m, col)}, ${COLORS[col].name}`);
      b.innerHTML = `<img src="${lureSrc(m, col)}" alt="" width="120" height="60" loading="lazy"><span>${variantCode(m, col)}</span>`;
      wrap.append(b);
    });

    setModalColor(c ?? m.colors[0]);
    document.documentElement.classList.add('modal-open');
    if (!modal.open) modal.showModal();
    $('.modal-info', modal).scrollTop = 0;
    $('.modal-card', modal).scrollTop = 0;
  }

  function setModalColor(c) {
    const m = current.m;
    current.c = c;
    const img = $('#modal-img');
    img.src = lureSrc(m, c);
    img.alt = `${m.name} color ${COLORS[c].name}`;
    if (!reduceMotion) {
      img.classList.remove('pop');
      void img.offsetWidth;
      img.classList.add('pop');
    }
    $('#modal-code').textContent = variantCode(m, c);
    $('#modal-color').textContent = `${COLORS[c].name} · ${COLORS[c].detail}`;
    const wa = $('#modal-wa');
    wa.href = waHref(variantMsg(m, c));
    $('span', wa).textContent = `Pedir ${variantCode(m, c)}`;
    wa.setAttribute('aria-label', `Pedir ${variantCode(m, c)} por WhatsApp`);
    $$('#modal-variants .variant').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.color === c)));
    resetCopyButton();

    const card = cards.get(m.id);
    if (card) setCardColor(card, c);
  }

  function stepModal(dir) {
    const list = current.m.colors;
    const i = list.indexOf(current.c);
    setModalColor(list[(i + dir + list.length) % list.length]);
  }

  function closeModal() {
    if (!modal.open || modal.classList.contains('is-closing')) return;
    if (reduceMotion) return modal.close();
    modal.classList.add('is-closing');
    setTimeout(() => {
      modal.classList.remove('is-closing');
      modal.close();
    }, 260);
  }

  const copyBtn = $('#modal-copy');
  function resetCopyButton() {
    $('use', copyBtn).setAttribute('href', '#i-copy');
    $('span', copyBtn).textContent = 'Copiar código';
  }
  async function copyCode() {
    const code = variantCode(current.m, current.c);
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: code });
      ta.style.cssText = 'position:fixed;opacity:0';
      modal.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    $('use', copyBtn).setAttribute('href', '#i-check');
    $('span', copyBtn).textContent = `¡${code} copiado!`;
    clearTimeout(copyCode.t);
    copyCode.t = setTimeout(resetCopyButton, 1800);
  }

  function initModal() {
    $('#modal-variants').addEventListener('click', (e) => {
      const b = e.target.closest('.variant');
      if (b) setModalColor(+b.dataset.color);
    });
    $('#modal-prev').addEventListener('click', () => stepModal(-1));
    $('#modal-next').addEventListener('click', () => stepModal(1));
    $$('[data-close]', modal).forEach((b) => b.addEventListener('click', closeModal));
    copyBtn.addEventListener('click', copyCode);

    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    modal.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') stepModal(1);
      if (e.key === 'ArrowLeft') stepModal(-1);
    });
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    const nav = $('#nav');
    const toggle = $('#nav-toggle');

    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.documentElement.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    $$('#nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => e.matches && setMenu(false));

    // Link activo según la sección visible
    const links = new Map($$('#nav-links a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          const link = links.get(en.target.id);
          if (!link) return;
          if (en.isIntersecting) {
            links.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    links.forEach((_, id) => {
      const sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ---------- Scroll: progreso, nav, parallax, botón flotante ---------- */
  function initScroll() {
    const nav = $('#nav');
    const bar = $('.progress span');
    const waFloat = $('#wa-float');
    const heroVisual = $('.hero-visual');
    let tipShown = false;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      nav.classList.toggle('is-scrolled', y > 24);

      const showFloat = y > window.innerHeight * 0.65;
      waFloat.classList.toggle('is-visible', showFloat);
      if (showFloat && !tipShown) {
        tipShown = true;
        setTimeout(() => waFloat.classList.add('tip-on'), 900);
        setTimeout(() => waFloat.classList.remove('tip-on'), 4800);
      }

      if (!reduceMotion && heroVisual && y < window.innerHeight * 1.2) {
        heroVisual.style.translate = `0 ${y * 0.12}px`;
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Hero ---------- */
  function initHero() {
    // Burbujas
    const bubbles = $('[data-bubbles]');
    if (bubbles && !reduceMotion) {
      const count = window.innerWidth < 700 ? 10 : 18;
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.style.cssText = [
          `--x:${(Math.random() * 100).toFixed(1)}%`,
          `--s:${(4 + Math.random() * 14).toFixed(1)}px`,
          `--dur:${(11 + Math.random() * 14).toFixed(1)}s`,
          `--delay:${(-Math.random() * 22).toFixed(1)}s`,
          `--drift:${((Math.random() - 0.5) * 90).toFixed(0)}px`,
        ].join(';');
        bubbles.append(s);
      }
    }

    // Parallax con el mouse sobre los señuelos
    if (!reduceMotion && finePointer) {
      const hero = $('.hero');
      const layers = $$('[data-depth]', hero);
      let raf = 0;
      let px = 0;
      let py = 0;
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          layers.forEach((l) => {
            const d = +l.dataset.depth;
            l.style.translate = `${(px * d).toFixed(1)}px ${(py * d).toFixed(1)}px`;
          });
          raf = 0;
        });
      });
      hero.addEventListener('pointerleave', () => layers.forEach((l) => (l.style.translate = '0 0')));
    }

    // Contadores
    const counters = $$('[data-count]');
    if (reduceMotion) return;
    counters.forEach((el) => (el.textContent = '0'));
    setTimeout(() => {
      counters.forEach((el) => {
        const target = +el.dataset.count;
        const t0 = performance.now();
        const dur = 1500;
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, 900);
  }

  /* ---------- Cintas infinitas ---------- */
  function initRibbons() {
    $$('.ribbon').forEach((ribbon) => {
      const track = $('.ribbon-track', ribbon);
      const items = [...track.children];
      let guard = 0;
      while (track.scrollWidth < window.innerWidth * 1.2 && guard++ < 8) {
        items.forEach((n) => track.append(n.cloneNode(true)));
      }
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      ribbon.append(clone);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Inicio ---------- */
  initContactLinks();
  renderCards();
  renderColorFilter();
  initEspecieChips();
  applyFilters();
  initSpecies();
  renderPromos();
  initModal();
  initNav();
  initScroll();
  initHero();
  initRibbons();
  initReveal();
})();
