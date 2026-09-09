(function () {
  'use strict';

  /* ---------- Header solid-on-scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-solid');
    else if (!header.dataset.forceSolid) header.classList.remove('is-solid');
  }
  if (header && header.classList.contains('is-solid')) {
    header.dataset.forceSolid = 'true';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var announce = document.querySelector('.announce');
  if (!announce && header) header.classList.add('no-announce');

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navMobile.classList.toggle('is-open');
      document.body.style.overflow = navMobile.classList.contains('is-open') ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Search overlay (submits to Shopify's native /search) ---------- */
  var searchBtns = document.querySelectorAll('.js-search-toggle');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchClose = document.getElementById('searchClose');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { searchInput && searchInput.focus(); }, 60);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  searchBtns.forEach(function (btn) { btn.addEventListener('click', openSearch); });
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('is-open')) {
      closeSearch();
    }
  });

  /* ---------- Hero video: plays on any screen size, skipped only for reduced-motion ---------- */
  var heroVideo = document.getElementById('heroVideo');
  var heroPoster = document.getElementById('heroPoster');
  if (heroVideo) {
    var mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function setupHeroMedia() {
      if (!mqReduced.matches) {
        heroVideo.style.display = 'block';
        if (heroPoster) heroPoster.style.display = 'none';
        heroVideo.play && heroVideo.play().catch(function () {});
      } else {
        heroVideo.pause();
        heroVideo.style.display = 'none';
        if (heroPoster) heroPoster.style.display = 'block';
      }
    }
    setupHeroMedia();
    mqReduced.addEventListener('change', setupHeroMedia);
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Toast ---------- */
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2800);
  }
  window.vortexToast = showToast;

  /* ---------- Cart count bubble, kept in sync with Shopify's real cart ---------- */
  var cartCountEls = document.querySelectorAll('.js-cart-count');
  function refreshCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        cartCountEls.forEach(function (el) { el.textContent = cart.item_count; });
      })
      .catch(function () {});
  }
  refreshCartCount();

  /* ---------- AJAX add-to-cart for every [data-add-cart] form/button on the page ---------- */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-add-cart-form], form.js-add-cart-form');
    if (!form) return;
    e.preventDefault();
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        items: [{
          id: form.querySelector('[name="id"]').value,
          quantity: parseInt((form.querySelector('[name="quantity"]') || {}).value || '1', 10)
        }]
      })
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (err) { throw err; });
        return r.json();
      })
      .then(function () {
        refreshCartCount();
        showToast((form.getAttribute('data-product-title') || 'Producto') + ' agregado al carrito');
      })
      .catch(function (err) {
        showToast((err && err.description) || 'No se pudo agregar al carrito');
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });

  /* ---------- Newsletter feedback (form still submits normally to Shopify) ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function () {
      showToast('¡Gracias por suscribirte!');
    });
  }

  /* ---------- PDP: quantity stepper ---------- */
  document.querySelectorAll('[data-qty]').forEach(function (qtyWrap) {
    var input = qtyWrap.querySelector('[data-qty-input]');
    if (!input) return;
    qtyWrap.querySelector('[data-qty-minus]').addEventListener('click', function () {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    });
    qtyWrap.querySelector('[data-qty-plus]').addEventListener('click', function () {
      input.value = (parseInt(input.value, 10) || 1) + 1;
    });
  });

  /* ---------- PDP: accordion ---------- */
  document.querySelectorAll('[data-accordion]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.accordion-item');
      var panel = item.querySelector('.accordion-panel');
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.accordion-item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- PDP: variant picker — matches a real Shopify variant from the
     selected option pills and keeps price / image / availability / the
     hidden variant id input all in sync. ---------- */
  document.querySelectorAll('[data-product-form]').forEach(function (root) {
    var dataEl = root.querySelector('[data-product-json]');
    if (!dataEl) return;
    var product;
    try { product = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var variantInput = root.querySelector('[name="id"]');
    var priceEl = root.querySelector('[data-price]');
    var comparePriceEl = root.querySelector('[data-compare-price]');
    var addBtn = root.querySelector('[data-add-submit]');
    var galleryMain = root.querySelector('[data-gallery-main]');

    function formatMoney(cents) {
      return '$' + Math.round(cents / 100).toLocaleString('es-CL');
    }

    function selectedOptions() {
      var values = [];
      root.querySelectorAll('[data-option-index]').forEach(function (group) {
        var active = group.querySelector('.is-selected');
        values[parseInt(group.getAttribute('data-option-index'), 10)] = active ? active.getAttribute('data-value') : null;
      });
      return values;
    }

    function findVariant() {
      var values = selectedOptions();
      return product.variants.find(function (v) {
        return v.options.every(function (val, i) { return val === values[i]; });
      });
    }

    function updateUI() {
      var variant = findVariant();
      root.querySelectorAll('[data-option-index]').forEach(function (group) {
        var idx = parseInt(group.getAttribute('data-option-index'), 10);
        group.querySelectorAll('[data-value]').forEach(function (pill) {
          var testValues = selectedOptions().slice();
          testValues[idx] = pill.getAttribute('data-value');
          var stillPossible = product.variants.some(function (v) {
            return v.options.every(function (val, i) { return testValues[i] == null || val === testValues[i]; });
          });
          pill.classList.toggle('is-disabled', !stillPossible);
        });
      });

      if (!variant) return;
      if (variantInput) variantInput.value = variant.id;
      if (priceEl) priceEl.textContent = formatMoney(variant.price);
      if (comparePriceEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          comparePriceEl.textContent = formatMoney(variant.compare_at_price);
          comparePriceEl.hidden = false;
        } else {
          comparePriceEl.hidden = true;
        }
      }
      if (addBtn) {
        addBtn.disabled = !variant.available;
        addBtn.textContent = variant.available ? addBtn.getAttribute('data-label-available') : addBtn.getAttribute('data-label-sold-out');
      }
      if (galleryMain && variant.featured_image) {
        var img = galleryMain.querySelector('img');
        if (img) img.src = variant.featured_image.src.replace(/(\.[a-z]+)(\?|$)/i, '_800x$1$2');
      }
    }

    root.querySelectorAll('[data-option-index] [data-value]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        if (pill.classList.contains('is-disabled')) return;
        pill.parentElement.querySelectorAll('[data-value]').forEach(function (p) { p.classList.remove('is-selected'); });
        pill.classList.add('is-selected');
        updateUI();
      });
    });

    root.querySelectorAll('[data-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        root.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        if (galleryMain) {
          var img = galleryMain.querySelector('img');
          if (img) img.src = thumb.getAttribute('data-full');
        }
      });
    });

    updateUI();
  });

})();
