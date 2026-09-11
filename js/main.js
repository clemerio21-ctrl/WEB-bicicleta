(function () {
  'use strict';

  /* ---------- Header solid-on-scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-solid');
    else if (!header.classList.contains('is-solid') || window.scrollY <= 40) {
      if (window.scrollY <= 40 && !header.dataset.forceSolid) header.classList.remove('is-solid');
    }
  }
  if (header && header.classList.contains('is-solid')) {
    header.dataset.forceSolid = 'true';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hide announcement offset once scrolled (keep header snug to top on inner pages) */
  var announce = document.querySelector('.announce');
  if (!announce) header && header.classList.add('no-announce');

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

  /* ---------- Search overlay ---------- */
  var searchBtns = document.querySelectorAll('#searchBtn');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchClose = document.getElementById('searchClose');
  var searchForm = document.getElementById('searchForm');

  function renderSearchResults(query) {
    if (!searchResults || !window.VORTEX_CATALOG) return;
    var catalog = window.VORTEX_CATALOG;
    var q = query.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!q) {
      searchResults.innerHTML = '<p class="search-hint">Prueba con "polera", "pantalón", "guantes"...</p>';
      return;
    }
    var matches = catalog.products.filter(function (p) {
      var inName = p.name.toLowerCase().indexOf(q) !== -1;
      var inCategory = p.category.some(function (c) {
        return (catalog.categoryLabels[c] || c).toLowerCase().indexOf(q) !== -1;
      });
      return inName || inCategory;
    }).slice(0, 8);

    if (!matches.length) {
      var empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'Sin resultados para "' + query.trim() + '".';
      searchResults.appendChild(empty);
      return;
    }
    matches.forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'search-result';
      a.href = 'categoria.html?cat=' + encodeURIComponent(p.category[0]);
      var color = p.colors[0] ? p.colors[0].hex : '#0a0a0c';

      var swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = color;

      var info = document.createElement('span');
      info.className = 'info';
      var name = document.createElement('span');
      name.className = 'name';
      name.textContent = p.name;
      var cat = document.createElement('span');
      cat.className = 'cat';
      cat.textContent = catalog.categoryLabels[p.category[0]] || '';
      info.appendChild(name);
      info.appendChild(cat);

      var price = document.createElement('span');
      price.className = 'price';
      price.textContent = catalog.formatPrice(p.price);

      a.appendChild(swatch);
      a.appendChild(info);
      a.appendChild(price);
      searchResults.appendChild(a);
    });
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    renderSearchResults(searchInput ? searchInput.value : '');
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
  if (searchForm) searchForm.addEventListener('submit', function (e) { e.preventDefault(); });
  if (searchInput) {
    searchInput.addEventListener('input', function () { renderSearchResults(searchInput.value); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('is-open')) {
      closeSearch();
    }
  });

  /* ---------- Contact float (mensaje flotante a correo) ----------
     Envía la consulta mediante api/enviar-consulta.js — el correo de
     destino se configura en Vercel (variable CONTACT_EMAIL), no acá. */
  var contactFloatBtn = document.getElementById('contactFloatBtn');
  var contactPanel = document.getElementById('contactPanel');
  var contactPanelClose = document.getElementById('contactPanelClose');
  var contactForm = document.getElementById('contactForm');

  function toggleContactPanel(open) {
    if (!contactPanel) return;
    contactPanel.classList.toggle('is-open', open);
    if (contactFloatBtn) contactFloatBtn.classList.toggle('is-open', open);
  }
  if (contactFloatBtn) {
    contactFloatBtn.addEventListener('click', function () {
      toggleContactPanel(!contactPanel.classList.contains('is-open'));
    });
  }
  if (contactPanelClose) {
    contactPanelClose.addEventListener('click', function () { toggleContactPanel(false); });
  }
  document.addEventListener('click', function (e) {
    if (!contactPanel || !contactPanel.classList.contains('is-open')) return;
    if (contactPanel.contains(e.target) || (contactFloatBtn && contactFloatBtn.contains(e.target))) return;
    toggleContactPanel(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contactPanel && contactPanel.classList.contains('is-open')) {
      toggleContactPanel(false);
    }
  });
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

      fetch('/api/enviar-consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: contactForm.nombre.value.trim(),
          correo: contactForm.correo.value.trim(),
          mensaje: contactForm.mensaje.value.trim()
        })
      })
        .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (result) {
          if (!result.ok) throw new Error((result.data && result.data.error) || 'No se pudo enviar el mensaje.');
          showToast('¡Mensaje enviado! Te responderemos pronto.');
          contactForm.reset();
          toggleContactPanel(false);
        })
        .catch(function (err) {
          showToast(err.message || 'No se pudo enviar el mensaje.');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        });
    });
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

  /* ---------- Size / color pill selection (event delegation) ---------- */
  document.addEventListener('click', function (e) {
    var sizeBtn = e.target.closest('.size-pill, .pdp-size');
    if (sizeBtn) {
      var group = sizeBtn.parentElement;
      group.querySelectorAll('.size-pill, .pdp-size').forEach(function (b) { b.classList.remove('active'); });
      sizeBtn.classList.add('active');
    }

    var colorBtn = e.target.closest('.color-dot');
    if (colorBtn) {
      var cgroup = colorBtn.parentElement;
      cgroup.querySelectorAll('.color-dot').forEach(function (b) { b.classList.remove('active'); });
      colorBtn.classList.add('active');
    }

    var quick = e.target.closest('[data-quickview]');
    if (quick) {
      e.preventDefault();
      showToast('Vista rápida — disponible en la versión completa de la tienda.');
    }
  });

  /* ---------- Cart (demo, in-memory count only) ---------- */
  var cartCountEls = document.querySelectorAll('#cartCount');
  var cartCount = 0;
  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add-cart]');
    if (!addBtn) return;
    e.preventDefault();
    cartCount += 1;
    cartCountEls.forEach(function (el) { el.textContent = cartCount; });
    var name = addBtn.getAttribute('data-name') || 'Producto';
    showToast(name + ' agregado al carrito (demo)');
  });

  var buyBtn = document.getElementById('buyBtn');
  if (buyBtn) {
    buyBtn.addEventListener('click', function () {
      var originalLabel = buyBtn.textContent;
      buyBtn.disabled = true;
      buyBtn.textContent = 'Redirigiendo...';

      fetch('/api/crear-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: buyBtn.getAttribute('data-product-id') || 'polera-araucaria' })
      })
        .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (result) {
          if (!result.ok || !result.data.url) throw new Error((result.data && result.data.error) || 'Error desconocido');
          window.location.href = result.data.url;
        })
        .catch(function (err) {
          showToast(err.message || 'No se pudo iniciar el pago.');
          buyBtn.disabled = false;
          buyBtn.textContent = originalLabel;
        });
    });
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
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  /* ---------- Newsletter form (demo) ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('¡Gracias! (formulario de ejemplo, sin envío real)');
      newsletterForm.reset();
    });
  }

  /* ---------- PDP: gallery thumbs swap the main photo ---------- */
  var galleryMain = document.getElementById('galleryMain');
  document.querySelectorAll('.pdp-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      document.querySelectorAll('.pdp-thumb').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (galleryMain) {
        var img = galleryMain.querySelector('img');
        if (img) img.src = thumb.getAttribute('data-full');
      }
    });
  });

  /* ---------- PDP: color swatches update the label ---------- */
  var colorValue = document.getElementById('colorValue');
  document.querySelectorAll('.pdp-color').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (colorValue) colorValue.textContent = btn.getAttribute('data-color-name');
    });
  });

  /* ---------- PDP: quantity stepper ---------- */
  var qtyWrap = document.querySelector('[data-qty]');
  if (qtyWrap) {
    var qtyValue = qtyWrap.querySelector('[data-qty-value]');
    var qty = 1;
    qtyWrap.querySelector('[data-qty-minus]').addEventListener('click', function () {
      qty = Math.max(1, qty - 1);
      qtyValue.textContent = qty;
    });
    qtyWrap.querySelector('[data-qty-plus]').addEventListener('click', function () {
      qty = Math.min(10, qty + 1);
      qtyValue.textContent = qty;
    });
  }

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

})();
