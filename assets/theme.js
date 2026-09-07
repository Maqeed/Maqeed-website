(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------------------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------------------------------------------------------------------
     Cart drawer
  --------------------------------------------------------------------- */
  var cartDrawer = document.querySelector('[data-cart-drawer]');
  var cartDrawerBody = document.querySelector('[data-cart-drawer-body]');

  function openCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-cart-drawer-open]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  document.querySelectorAll('[data-cart-drawer-close]').forEach(function (el) {
    el.addEventListener('click', closeCartDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCartDrawer();
  });

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.setAttribute('data-cart-count', count);
    });
  }

  function refreshCartDrawer() {
    if (!cartDrawerBody) return Promise.resolve();
    return fetch('/?section_id=cart-drawer')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newBody = doc.querySelector('[data-cart-drawer-body]');
        if (newBody) cartDrawerBody.innerHTML = newBody.innerHTML;
        bindCartEvents();
      });
  }

  function bindCartEvents() {
    var scope = cartDrawerBody || document;

    scope.querySelectorAll('[data-cart-remove]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var item = el.closest('[data-cart-item]');
        var input = item && item.querySelector('[data-qty-input]');
        if (input) changeLine(input.dataset.line, 0);
      });
    });

    scope.querySelectorAll('[data-qty-increase]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.parentElement.querySelector('[data-qty-input]');
        if (input) changeLine(input.dataset.line, parseInt(input.value, 10) + 1);
      });
    });

    scope.querySelectorAll('[data-qty-decrease]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.parentElement.querySelector('[data-qty-input]');
        if (input) changeLine(input.dataset.line, Math.max(0, parseInt(input.value, 10) - 1));
      });
    });

    scope.querySelectorAll('[data-qty-input]').forEach(function (input) {
      input.addEventListener('change', function () {
        changeLine(input.dataset.line, Math.max(0, parseInt(input.value, 10) || 0));
      });
    });
  }

  function changeLine(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        refreshCartDrawer();
      });
  }

  bindCartEvents();

  /* ---------------------------------------------------------------------
     Product form — AJAX add to cart
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-product-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('[data-add-to-cart]');
      var textEl = form.querySelector('[data-add-to-cart-text]');
      var originalText = textEl ? textEl.textContent : '';
      if (button) button.disabled = true;
      if (textEl) textEl.textContent = 'Adding…';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.querySelector('[name="id"]').value,
          quantity: parseInt(form.querySelector('[name="quantity"]').value, 10) || 1
        })
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          return fetch('/cart.js').then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          if (button) button.disabled = false;
          if (textEl) textEl.textContent = originalText;
          refreshCartDrawer();
          openCartDrawer();
        })
        .catch(function () {
          if (button) button.disabled = false;
          if (textEl) textEl.textContent = originalText;
          form.submit();
        });
    });
  });

  /* ---------------------------------------------------------------------
     Product variant swatches -> hidden select -> id input
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-product-form]').forEach(function (form) {
    var select = form.querySelector('[data-product-variant-select]');
    if (!select) return;
    var radios = form.querySelectorAll('input[name^="option-"]');

    function syncVariant() {
      var chosen = [];
      var optionInputs = form.querySelectorAll('.product-option');
      optionInputs.forEach(function (group) {
        var checked = group.querySelector('input:checked');
        chosen.push(checked ? checked.value : '');
      });
      var options = select.querySelectorAll('option');
      var matched = null;
      options.forEach(function (opt) {
        var values = (opt.dataset.optionValues || '').split('||');
        if (values.join('||') === chosen.join('||')) matched = opt;
      });
      if (matched) {
        select.value = matched.value;
        var idInput = form.querySelector('input[name="id"]');
        if (idInput) idInput.value = matched.value;
        else select.name = 'id';
      }
    }

    radios.forEach(function (radio) {
      radio.addEventListener('change', syncVariant);
    });
  });

  /* ---------------------------------------------------------------------
     Product thumbnails
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-product-thumb]').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var mainImg = document.getElementById('ProductMainImage');
      if (mainImg) mainImg.src = thumb.dataset.productThumb;
      document.querySelectorAll('[data-product-thumb]').forEach(function (t) {
        t.classList.remove('is-active');
      });
      thumb.classList.add('is-active');
    });
  });

  /* ---------------------------------------------------------------------
     Blend tool
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-blend-tool]').forEach(function (tool) {
    var tabs = tool.querySelectorAll('[data-blend-tab]');
    var panes = tool.querySelectorAll('[data-blend-pane]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var index = tab.dataset.blendTab;
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        panes.forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var pane = tool.querySelector('[data-blend-pane="' + index + '"]');
        if (pane) pane.classList.add('is-active');
      });
    });

    panes.forEach(function (pane) {
      var slider = pane.querySelector('[data-blend-slider]');
      var visual = pane.querySelector('[data-blend-visual]');
      var result = pane.querySelector('[data-blend-result]');

      if (!slider) return;

      function update() {
        var value = parseInt(slider.value, 10);
        if (visual) visual.style.setProperty('--pos', value + '%');
        if (result) {
          var closeness = 1 - Math.abs(value - 50) / 50;
          result.style.opacity = String(0.55 + closeness * 0.45);
        }
      }

      slider.addEventListener('input', update);
      update();
    });
  });

  /* ---------------------------------------------------------------------
     Newsletter form — no-JS fallback works natively; nothing to bind.
  --------------------------------------------------------------------- */
})();
