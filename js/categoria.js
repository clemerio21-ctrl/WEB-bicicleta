(function () {
  'use strict';

  var catalog = window.VORTEX_CATALOG;
  if (!catalog) return;

  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat') || 'todos';
  if (!catalog.categoryLabels[cat]) cat = 'todos';

  var baseProducts = cat === 'todos'
    ? catalog.products.slice()
    : catalog.products.filter(function (p) { return p.category.indexOf(cat) !== -1; });

  var state = { sizes: [], colors: [], sort: 'relevancia' };

  var titleEl = document.getElementById('categoryTitle');
  var breadcrumbEl = document.getElementById('breadcrumbCurrent');
  var countEl = document.getElementById('categoryCount');
  var sortEl = document.getElementById('sortSelect');
  var sizeFilterEl = document.getElementById('sizeFilters');
  var colorFilterEl = document.getElementById('colorFilters');
  var clearEl = document.getElementById('filterClear');
  var gridEl = document.getElementById('productGrid');
  var emptyEl = document.getElementById('categoryEmpty');

  var label = catalog.categoryLabels[cat];
  document.title = label + ' — Vortex Crew';
  if (titleEl) titleEl.textContent = label;
  if (breadcrumbEl) breadcrumbEl.textContent = label;

  /* ---------- Build filter options from the category's full product set ---------- */
  function uniqueSizes() {
    var seen = [];
    baseProducts.forEach(function (p) {
      p.sizes.forEach(function (s) { if (seen.indexOf(s) === -1) seen.push(s); });
    });
    return seen;
  }
  function uniqueColors() {
    var seen = [];
    baseProducts.forEach(function (p) {
      p.colors.forEach(function (c) {
        if (!seen.some(function (x) { return x.name === c.name; })) seen.push(c);
      });
    });
    return seen;
  }

  function buildFilters() {
    if (sizeFilterEl) {
      sizeFilterEl.innerHTML = '';
      uniqueSizes().forEach(function (s) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-pill';
        btn.textContent = s;
        btn.dataset.size = s;
        btn.addEventListener('click', function () {
          toggleValue(state.sizes, s);
          btn.classList.toggle('active');
          render();
        });
        sizeFilterEl.appendChild(btn);
      });
    }
    if (colorFilterEl) {
      colorFilterEl.innerHTML = '';
      uniqueColors().forEach(function (c) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-swatch';
        btn.setAttribute('aria-label', c.name);
        btn.title = c.name;
        btn.dataset.color = c.name;
        var span = document.createElement('span');
        span.style.background = c.hex;
        btn.appendChild(span);
        btn.addEventListener('click', function () {
          toggleValue(state.colors, c.name);
          btn.classList.toggle('active');
          render();
        });
        colorFilterEl.appendChild(btn);
      });
    }
  }

  function toggleValue(arr, value) {
    var i = arr.indexOf(value);
    if (i === -1) arr.push(value); else arr.splice(i, 1);
    if (clearEl) clearEl.hidden = state.sizes.length === 0 && state.colors.length === 0;
  }

  if (clearEl) {
    clearEl.addEventListener('click', function () {
      state.sizes = [];
      state.colors = [];
      document.querySelectorAll('.filter-pill.active, .filter-swatch.active').forEach(function (el) {
        el.classList.remove('active');
      });
      clearEl.hidden = true;
      render();
    });
  }

  /* ---------- Sort ---------- */
  var sorters = {
    relevancia: function (a, b) { return 0; },
    'precio-asc': function (a, b) { return a.price - b.price; },
    'precio-desc': function (a, b) { return b.price - a.price; },
    nuevos: function (a, b) { return new Date(b.dateAdded) - new Date(a.dateAdded); },
    alfabetico: function (a, b) { return a.name.localeCompare(b.name, 'es'); }
  };
  if (sortEl) {
    sortEl.addEventListener('change', function () {
      state.sort = sortEl.value;
      render();
    });
  }

  /* ---------- Render ---------- */
  function iconSvg(type) {
    return '<svg class="tile-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      catalog.iconMarkup(type) + '</svg>';
  }

  function cardHtml(p) {
    var badge = p.badge ? '<span class="product-badge' + (p.badge === 'Más vendida' ? ' accent' : '') + '">' + p.badge + '</span>' : '';
    var sizePills = p.sizes.map(function (s, i) {
      return '<button type="button" class="size-pill' + (i === 0 ? ' active' : '') + '">' + s + '</button>';
    }).join('');
    var colorDots = p.colors.map(function (c, i) {
      return '<button type="button" class="color-dot' + (i === 0 ? ' active' : '') + '" aria-label="' + c.name + '"><span style="background:' + c.hex + '"></span></button>';
    }).join('');

    return (
      '<a href="producto.html" class="product-card" data-reveal>' +
        '<div class="product-media ' + p.tile + '">' +
          badge +
          iconSvg(p.icon) +
          '<button class="product-quick" type="button" aria-label="Vista rápida" data-quickview>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-name">' + p.name + '</h3>' +
          '<p class="product-price">' + catalog.formatPrice(p.price) + '</p>' +
          '<div class="option-row"><span class="option-label">Talla</span><div class="size-pills" data-size-group>' + sizePills + '</div></div>' +
          '<div class="option-row"><span class="option-label">Color</span><div class="color-dots" data-color-group>' + colorDots + '</div></div>' +
          '<button class="product-add" type="button" data-add-cart data-name="' + p.name + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
            'Agregar' +
          '</button>' +
        '</div>' +
      '</a>'
    );
  }

  function render() {
    var list = baseProducts.filter(function (p) {
      var sizeOk = state.sizes.length === 0 || p.sizes.some(function (s) { return state.sizes.indexOf(s) !== -1; });
      var colorOk = state.colors.length === 0 || p.colors.some(function (c) { return state.colors.indexOf(c.name) !== -1; });
      return sizeOk && colorOk;
    });
    list.sort(sorters[state.sort] || sorters.relevancia);

    if (countEl) {
      countEl.innerHTML = '<strong>' + list.length + '</strong> producto' + (list.length === 1 ? '' : 's');
    }

    if (!list.length) {
      if (gridEl) gridEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (gridEl) {
      gridEl.innerHTML = list.map(cardHtml).join('');
      gridEl.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  buildFilters();
  render();
})();
