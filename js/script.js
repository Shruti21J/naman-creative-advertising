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
  var PRODUCTS = [];


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
  
async function loadProducts() {
  try {
    var response = await fetch("http://127.0.0.1:8000/products");

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    var data = await response.json();

    PRODUCTS = data.products.map(function (product) {
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description || "",
        image: product.image_url || "",
        moq: product.moq || null
      };
    });

    renderProducts(activeFilter || "all");
  } catch (error) {
    console.error("Product loading failed:", error);
    if (productsGrid) {
      productsGrid.innerHTML =
        '<p class="product-loading-error">Products could not be loaded. Please try again later.</p>';
    }
  }
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

    contactForm.addEventListener('submit', async function (e) {
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

      
var formData = {
  name: fields.name.el.value.trim(),
  phone: fields.phone.el.value.trim(),
  product: fields.product.el.value.trim(),
  message: document.getElementById('message').value.trim()
};

var submitButton = contactForm.querySelector('button[type="submit"]');
submitButton.disabled = true;
submitButton.textContent = 'Submitting...';

try {
  var response = await fetch('http://127.0.0.1:8000/enquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error('Could not submit enquiry.');
  }

  var successMsg = document.getElementById('form-success');
  successMsg.hidden = false;
  contactForm.reset();

  setTimeout(function () {
    successMsg.hidden = true;
  }, 5000);

} catch (error) {
  alert('We could not submit your enquiry. Please try again.');

} finally {
  submitButton.disabled = false;
  submitButton.textContent = 'Submit Enquiry';
}

    });
  }

  function init() {
    loadProducts('all');
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
