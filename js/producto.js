/* Pinta producto.html según el producto real (?id=slug), usando el catálogo
   de products.js. Debe cargarse ANTES de main.js: main.js conecta los
   botones (talla, color, miniaturas, comprar) a lo que ya esté en el DOM,
   así que el producto tiene que estar pintado primero. */
(function () {
  'use strict';

  var catalog = window.VORTEX_CATALOG;
  if (!catalog) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var product = catalog.products.find(function (p) { return p.id === id; });
  if (!product) product = catalog.products[0];

  document.title = product.name + ' — roots co.';

  var breadcrumbEl = document.getElementById('breadcrumbCurrent');
  if (breadcrumbEl) breadcrumbEl.textContent = product.name;

  var badgeEl = document.getElementById('pdpBadge');
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.classList.toggle('accent', product.badge === 'Más vendida');
      badgeEl.style.display = '';
    } else {
      /* .pdp-info .product-badge sets display:inline-flex, which beats the
         [hidden] UA default — hide it explicitly via inline style instead. */
      badgeEl.style.display = 'none';
    }
  }

  var titleEl = document.getElementById('pdpTitle');
  if (titleEl) titleEl.textContent = product.name;

  var priceEl = document.getElementById('pdpPrice');
  if (priceEl) priceEl.textContent = catalog.formatPrice(product.price);

  var descEl = document.getElementById('pdpDesc');
  if (descEl) descEl.textContent = product.desc || '';

  /* ---------- Detalles ---------- */
  var detailsEl = document.getElementById('pdpDetails');
  if (detailsEl) {
    var details = ['Producto de calidad.'];
    if (product.category.indexOf('poleras') !== -1) details.push('Cierre incluido.');
    detailsEl.innerHTML = details.map(function (d) { return '<li>' + d + '</li>'; }).join('');
  }

  /* ---------- Gallery ---------- */
  var galleryMain = document.getElementById('galleryMain');
  if (galleryMain) {
    galleryMain.innerHTML = '<img src="' + product.images[0] + '" alt="' + product.name + ', vista frontal" />';
  }
  var thumbsEl = document.getElementById('pdpThumbs');
  if (thumbsEl) {
    thumbsEl.innerHTML = product.images.map(function (src, i) {
      return '<button class="pdp-thumb' + (i === 0 ? ' active' : '') + '" type="button" data-full="' + src + '" aria-label="Ver foto ' + (i + 1) + '">' +
        '<img src="' + src + '" alt="" />' +
        '</button>';
    }).join('');
  }

  /* ---------- Sizes ---------- */
  var sizesEl = document.getElementById('pdpSizes');
  if (sizesEl) {
    var firstAvailable = product.sizes.findIndex(function (s) {
      return !product.stock || product.stock[s] > 0;
    });
    if (firstAvailable === -1) firstAvailable = 0;

    sizesEl.innerHTML = product.sizes.map(function (s, i) {
      var outOfStock = product.stock && !(product.stock[s] > 0);
      var classes = 'pdp-size' + (i === firstAvailable ? ' active' : '') + (outOfStock ? ' is-agotado' : '');
      return '<button type="button" class="' + classes + '"' + (outOfStock ? ' disabled aria-label="' + s + ' (agotado)"' : '') + '>' + s + '</button>';
    }).join('');
  }

  /* ---------- Colors ---------- */
  var colorValueEl = document.getElementById('colorValue');
  if (colorValueEl && product.colors[0]) colorValueEl.textContent = product.colors[0].name;
  var colorsEl = document.getElementById('pdpColors');
  if (colorsEl) {
    colorsEl.innerHTML = product.colors.map(function (c, i) {
      return '<button type="button" class="pdp-color' + (i === 0 ? ' active' : '') + '" data-color-name="' + c.name + '"><span style="background:' + c.hex + '"></span></button>';
    }).join('');
  }

  /* ---------- Buy / add to cart ---------- */
  var buyBtn = document.getElementById('buyBtn');
  if (buyBtn) buyBtn.setAttribute('data-product-id', product.id);
  var addCartBtn = document.getElementById('addCartBtn');
  if (addCartBtn) addCartBtn.setAttribute('data-name', product.name);

  /* ---------- Related products: mismas categorías primero ---------- */
  var relatedEl = document.getElementById('relatedGrid');
  if (relatedEl) {
    var related = catalog.products.filter(function (p) {
      return p.id !== product.id && p.category.some(function (c) { return product.category.indexOf(c) !== -1; });
    });
    catalog.products.forEach(function (p) {
      if (related.length >= 3) return;
      if (p.id === product.id) return;
      if (related.indexOf(p) === -1) related.push(p);
    });
    related = related.slice(0, 3);

    relatedEl.innerHTML = related.map(function (p) {
      return (
        '<a href="producto.html?id=' + p.id + '" class="product-card" data-reveal>' +
          '<div class="product-media">' +
            '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy" />' +
          '</div>' +
          '<div class="product-info">' +
            '<h3 class="product-name">' + p.name + '</h3>' +
            '<p class="product-price">' + catalog.formatPrice(p.price) + '</p>' +
            '<button class="product-add" type="button" data-add-cart data-name="' + p.name + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
              'Agregar' +
            '</button>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }
})();
