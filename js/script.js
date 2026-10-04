/**
 * Naman Creative Advertising — site behaviour
 * Vanilla JS: navigation, filters, product cards, form validation.
 */

(function () {
  'use strict';

  /* Encode each path segment so spaces, commas, and parentheses work on the web. */
  function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
  }

  /* Real catalogue — filenames match files inside images/ */
  var PRODUCTS = [
    { id: 1, category: 'countertop', name: 'Single-shelf countertop unit', description: 'Compact branded CTU for a focused product story on checkout counters.', image: 'images/countertop/1 shelf CTU.png' },
    { id: 2, category: 'countertop', name: 'Two-shelf countertop unit', description: 'Two-tier counter display with header panel and side branding area.', image: 'images/countertop/2 shelf CTU.png' },
    { id: 3, category: 'countertop', name: 'Peg-hook countertop display', description: 'Counter unit with hanging hooks and a lower tray for boxed or accessory products.', image: 'images/countertop/countertop display 2.png' },
    { id: 4, category: 'countertop', name: 'Three-tier snack rack', description: 'Plastic countertop rack with three shelves for pouches and packaged snacks.', image: 'images/countertop/Plastic CTU.png' },
    { id: 5, category: 'countertop', name: 'Three-shelf FSU-style unit', description: 'Larger countertop / FSU-style display with header and three product shelves.', image: 'images/countertop/Sunpack CTU FSU.jpeg' },
    { id: 6, category: 'countertop', name: 'Two-tier snack display', description: 'Open two-shelf unit with a printed header for impulse snack placement.', image: 'images/countertop/ChatGPT Image Jun 14, 2026, 06_05_07 PM.png' },
    { id: 7, category: 'countertop', name: 'Two-shelf paint display', description: 'Countertop unit with a wide header and two open shelves for canned products.', image: 'images/countertop/ChatGPT Image Jun 14, 2026, 06_10_05 PM.png' },
    { id: 8, category: 'countertop', name: 'Wire bottle countertop stand', description: 'Metal wire unit with header card, suited to bottled products on a counter.', image: 'images/countertop/ChatGPT Image May 27, 2026, 08_58_22 PM.png' },
    { id: 9, category: 'countertop', name: 'Two-shelf personal care display', description: 'Studio-finished two-shelf unit for bottles, lotions, and small personal care packs.', image: 'images/countertop/WhatsApp Image 2026-06-18 at 8.54.14 PM.jpeg' },
    { id: 10, category: 'countertop', name: 'Gravity-feed countertop display', description: 'Multi-pocket gravity feed unit for sachets, seed packs, or similar SKUs.', image: 'images/countertop/WhatsApp Image 2026-06-18 at 8.54.15 PM.jpeg' },
    { id: 11, category: 'countertop', name: 'Two-step well countertop unit', description: 'Stepped unit with bottle wells for personal care products on a counter.', image: 'images/countertop/WhatsApp Image 2026-06-18 at 8.54.15 PM (1).jpeg' },
    { id: 12, category: 'countertop', name: 'Two-shelf bottle FSU', description: 'Narrow two-shelf unit with a header, suited to bottled products on a counter or floor edge.', image: 'images/countertop/WhatsApp Image 2026-06-18 at 8.54.15 PM (2).jpeg' },
    { id: 13, category: 'countertop', name: 'Tray-style bottle display', description: 'Low-profile tray with bottle wells and a printed header panel.', image: 'images/countertop/WhatsApp Image 2026-06-18 at 9.00.26 PM.jpeg' },
    { id: 14, category: 'countertop', name: 'Three-well corrugated tray', description: 'Corrugated tray with three bottle wells and a printed header panel.', image: 'images/countertop/WhatsApp Image 2026-06-18 at 9.00.26 PM (1).jpeg' },

    { id: 15, category: 'hangers', name: 'Half-moon bottle hanger', description: 'Plastic half-moon hanger with hook and lower rail for hanging bottled SKUs.', image: 'images/display hangers/Bottle hanger (1).jpeg' },
    { id: 16, category: 'hangers', name: 'Ring bottle hanger', description: 'Circular hanging display with multiple bottle rings and a header card.', image: 'images/display hangers/Bottle hanger (2).jpeg' },
    { id: 17, category: 'hangers', name: 'Curved-bar bottle hanger', description: 'Slim hanging bar with rope mount, suited to a short row of bottles.', image: 'images/display hangers/Bottle hanger (3).jpeg' },
    { id: 18, category: 'hangers', name: 'Printed half-moon hanger', description: 'Branded half-moon hanger with graphic panel and bottle rail.', image: 'images/display hangers/Bottle hanger (5).jpeg' },
    { id: 19, category: 'hangers', name: 'Header-rail bottle hanger', description: 'Wide header plate with a lower rail for hanging bottled products.', image: 'images/display hangers/Bottle hanger (8).jpeg' },
    { id: 20, category: 'hangers', name: 'Pouch display hanger', description: 'Hanging bar with a branded header for pouches and small packed goods.', image: 'images/display hangers/Pouch Display hanger.jpeg' },
    { id: 21, category: 'hangers', name: 'Three-slot pouch hanger', description: 'Red hanging frame with three lower slots for pouches or sachets.', image: 'images/display hangers/Pouch Display hanger (2).jpeg' },
    { id: 22, category: 'hangers', name: 'Two-slot branded pouch hanger', description: 'Hanging display with a printed header and two pouch openings.', image: 'images/display hangers/Pouch Display hanger (3).jpeg' },
    { id: 23, category: 'hangers', name: 'Two-slot pouch hanger', description: 'Hanging pouch unit with a wide graphic header and two lower slots.', image: 'images/display hangers/Pouch Display hanger (4).jpeg' },

    { id: 24, category: 'stands', name: 'Four-shelf floor display', description: 'Tall branded floor stand with four open shelves and a header panel.', image: 'images/hero display.png' },
    { id: 25, category: 'stands', name: 'Three-tier bottle floor stand', description: 'Floor unit with three bottle shelves and a header for in-aisle placement.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_34_09 PM.png' },
    { id: 26, category: 'stands', name: 'Four-shelf plastic floor rack', description: 'Open plastic rack with header card, suited to bottled or boxed products.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_34_22 PM.png' },
    { id: 27, category: 'stands', name: 'Blue metal A-frame stand', description: 'Powder-coated A-frame bottle stand with an open header panel.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_34_40 PM.png' },
    { id: 28, category: 'stands', name: 'Wire-shelf floor merchandiser', description: 'Floor unit with wire shelves, header, and large side branding panels.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_34_51 PM.png' },
    { id: 29, category: 'stands', name: 'Three-shelf plastic floor rack', description: 'Open plastic floor rack with perforated shelves and a header card.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_35_05 PM.png' },
    { id: 30, category: 'stands', name: 'Metal bottle rack stand', description: 'Powder-coated metal stand with multiple bottle rails and a top header.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_35_26 PM.png' },
    { id: 31, category: 'stands', name: 'Multi-tier ring bottle tower', description: 'Pedestal tower with stacked bottle rings and a branded canopy top.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_35_33 PM.png' },
    { id: 32, category: 'stands', name: 'Wheeled metal display trolley', description: 'Slim metal trolley with three trays and wheels for movable in-store placement.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_35_39 PM.png' },
    { id: 33, category: 'stands', name: 'Wheeled bottle trolley stand', description: 'Handled trolley stand with bottle cut-outs on each shelf and rear wheels.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_35_43 PM.png' },
    { id: 34, category: 'stands', name: 'Rotating bottle floor stand', description: 'Pedestal stand with circular bottle rings and a header board.', image: 'images/Display Stands/ChatGPT Image Jun 4, 2026, 09_51_30 PM.png' },
    { id: 35, category: 'stands', name: 'Three-tier plastic floor stand', description: 'Slotted plastic shelves with header pocket for a custom brand card.', image: 'images/Display Stands/ChatGPT Image Jun 17, 2026, 10_38_06 PM.png' },
    { id: 36, category: 'stands', name: 'Four-shelf FSU floor stand', description: 'Carded FSU with four shelves and a header for stationery or boxed goods.', image: 'images/Display Stands/ChatGPT Image Jun 18, 2026, 03_17_35 PM.png' },
    { id: 37, category: 'stands', name: 'A-frame bottle floor stand', description: 'Inclined A-frame stand with branded rails for bottled products.', image: 'images/Display Stands/ChatGPT Image Jun 18, 2026, 03_24_26 PM.png' }
  ];

  var CATEGORY_LABELS = {
    countertop: 'Countertop',
    hangers: 'Hanger',
    stands: 'Floor stand'
  };

  var PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='460'%3E%3Crect fill='%23F7F3EA' width='400' height='460'/%3E%3C/svg%3E";

  var header = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav__link');
  var backToTopBtn = document.getElementById('back-to-top');
  var contactForm = document.getElementById('contact-form');
  var productsGrid = document.getElementById('products-grid');
  var activeFilter = 'all';

  function categoryLabel(category) {
    return CATEGORY_LABELS[category] || category;
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function renderProducts(filter) {
    if (!productsGrid) return;

    activeFilter = filter || 'all';
    var list = PRODUCTS.filter(function (product) {
      return activeFilter === 'all' || product.category === activeFilter;
    });

    productsGrid.innerHTML = list.map(function (product) {
      return (
        '<article class="product-card reveal">' +
          '<div class="product-card__image">' +
            '<img data-src="' + encodePath(product.image) + '" src="' + PLACEHOLDER + '" alt="' + escapeAttr(product.name) + '" width="400" height="460" loading="lazy" class="lazy">' +
          '</div>' +
          '<div class="product-card__body">' +
            '<p class="product-card__cat">' + categoryLabel(product.category) + '</p>' +
            '<h3 class="product-card__name">' + escapeAttr(product.name) + '</h3>' +
            '<p class="product-card__desc">' + escapeAttr(product.description) + '</p>' +
            '<span class="product-card__moq">Quote on request</span>' +
            '<a href="#contact" class="btn btn--primary btn--sm btn--full product-quote-btn" data-product="' + escapeAttr(product.name) + '">Request Quote</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    bindQuoteButtons();
    initLazyLoading();
    initScrollReveal();
  }

  function bindQuoteButtons() {
    document.querySelectorAll('.product-quote-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var productInput = document.getElementById('product');
        if (productInput) {
          productInput.value = btn.getAttribute('data-product');
        }
      });
    });
  }

  function setFilter(filter) {
    renderProducts(filter);

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function initFilters() {
    document.querySelectorAll('[data-filter]').forEach(function (el) {
      el.addEventListener('click', function () {
        var filter = el.getAttribute('data-filter');
        if (!filter) return;
        setFilter(filter);
        if (el.tagName === 'BUTTON' && el.classList.contains('category-card__link')) {
          document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function initMobileNav() {
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    function closeMenu() {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      overlay.classList.remove('visible');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMenu() {
      navToggle.classList.add('active');
      navMenu.classList.add('open');
      overlay.classList.add('visible');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    navToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    overlay.addEventListener('click', closeMenu);
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.querySelector('.nav__cta-item .btn').addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function initActiveNav() {
    var watched = ['home', 'about', 'products', 'why-us', 'contact'];

    function updateActiveLink() {
      var scrollPos = window.scrollY + 120;
      var current = 'home';

      watched.forEach(function (id) {
        var section = document.getElementById(id);
        if (section && scrollPos >= section.offsetTop) current = id;
      });

      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  function initHeaderScroll() {
    function handleScroll() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function initBackToTop() {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
        backToTopBtn.removeAttribute('hidden');
      } else {
        backToTopBtn.classList.remove('visible');
        backToTopBtn.setAttribute('hidden', '');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal:not(.revealed)');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  function initLazyLoading() {
    var lazyImages = document.querySelectorAll('img.lazy');

    function load(img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      }
    }

    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach(load);
      return;
    }

    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          load(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '120px' });

    lazyImages.forEach(function (img) { imageObserver.observe(img); });
  }

  function initFormValidation() {
    if (!contactForm) return;

    var fields = {
      name: {
        el: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate: function (value) {
          if (!value.trim()) return 'Please enter your name.';
          if (value.trim().length < 2) return 'Name must be at least 2 characters.';
          return '';
        }
      },
      phone: {
        el: document.getElementById('phone'),
        error: document.getElementById('phone-error'),
        validate: function (value) {
          if (!value.trim()) return 'Please enter your phone number.';
          if (!/^[\d\s+\-()]{10,15}$/.test(value.trim())) return 'Please enter a valid phone number.';
          return '';
        }
      },
      product: {
        el: document.getElementById('product'),
        error: document.getElementById('product-error'),
        validate: function (value) {
          if (!value.trim()) return 'Please specify the product required.';
          return '';
        }
      }
    };

    function validateField(fieldName) {
      var field = fields[fieldName];
      var errorMsg = field.validate(field.el.value);
      field.error.textContent = errorMsg;
      if (errorMsg) {
        field.el.classList.add('error');
        field.el.setAttribute('aria-invalid', 'true');
      } else {
        field.el.classList.remove('error');
        field.el.removeAttribute('aria-invalid');
      }
      return !errorMsg;
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', function () { validateField(key); });
      fields[key].el.addEventListener('input', function () {
        if (fields[key].el.classList.contains('error')) validateField(key);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) isValid = false;
      });
      if (!isValid) {
        var firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      var successMsg = document.getElementById('form-success');
      successMsg.hidden = false;
      contactForm.reset();
      setTimeout(function () { successMsg.hidden = true; }, 5000);
    });
  }

  function init() {
    renderProducts('all');
    initFilters();
    initMobileNav();
    initSmoothScroll();
    initActiveNav();
    initHeaderScroll();
    initBackToTop();
    initScrollReveal();
    initLazyLoading();
    initFormValidation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
