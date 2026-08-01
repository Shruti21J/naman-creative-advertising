/**
 * Naman Creative Advertising — Main JavaScript
 * Handles navigation, animations, form validation, and product rendering.
 * Written in vanilla JS for easy understanding and future FastAPI integration.
 */

(function () {
  'use strict';

  /* ==========================================================
     PRODUCT DATA
     Centralized product list — easy to replace with API data later
     ========================================================== */
  const PRODUCTS = [
    {
      id: 1,
      name: 'HDPE Storage Container 5L',
      description: 'Food-grade HDPE container with airtight lid, ideal for dry goods storage.',
      moq: '500 units',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Industrial Plastic Bucket 20L',
      description: 'Heavy-duty bucket with reinforced handle for construction and industrial use.',
      moq: '200 units',
      image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69bb?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'PET Water Bottle 1L',
      description: 'Crystal-clear PET bottle suitable for mineral water and beverage packaging.',
      moq: '1000 units',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6ce?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Plastic Crates 600×400mm',
      description: 'Stackable plastic crates for warehouse storage and logistics transportation.',
      moq: '100 units',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Shrink Wrap Film Roll',
      description: 'High-strength LDPE shrink wrap for pallet wrapping and product bundling.',
      moq: '50 rolls',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Plastic Kitchen Container Set',
      description: 'Microwave-safe container set with snap-lock lids for household retail.',
      moq: '300 sets',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'PVC Pipe 110mm',
      description: 'Standard PVC drainage pipe for plumbing and construction applications.',
      moq: '500 units',
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Plastic Pallet 1200×1000',
      description: 'Export-quality plastic pallet for warehouse and shipping operations.',
      moq: '50 units',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Spray Bottle 500ml',
      description: 'Trigger spray bottle for cleaning products, gardening, and personal care.',
      moq: '800 units',
      image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69bb?w=400&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Plastic Dustbin 60L',
      description: 'Outdoor-grade dustbin with wheels and pedal mechanism for commercial use.',
      moq: '100 units',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0fe00?w=400&h=300&fit=crop'
    },
    {
      id: 11,
      name: 'Plastic Jar 500g',
      description: 'Transparent PP jar with screw cap, perfect for spices, creams, and powders.',
      moq: '600 units',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop'
    },
    {
      id: 12,
      name: 'Plastic Chair (Stackable)',
      description: 'Durable molded plastic chair for events, restaurants, and outdoor seating.',
      moq: '150 units',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    }
  ];

  /* Placeholder SVG used before lazy images load */
  const IMG_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3C/svg%3E";

  /* ==========================================================
     DOM REFERENCES
     ========================================================== */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const productsGrid = document.getElementById('products-grid');
  const revealElements = document.querySelectorAll('.reveal');

  /* ==========================================================
     RENDER PRODUCTS
     Builds product cards dynamically from PRODUCTS array
     ========================================================== */
  function renderProducts() {
    if (!productsGrid) return;

    productsGrid.innerHTML = PRODUCTS.map(function (product) {
      return (
        '<article class="product-card reveal">' +
          '<div class="product-card__image">' +
            '<img ' +
              'data-src="' + product.image + '" ' +
              'src="' + IMG_PLACEHOLDER + '" ' +
              'alt="' + product.name + '" ' +
              'width="400" height="300" ' +
              'loading="lazy" ' +
              'class="lazy"' +
            '>' +
          '</div>' +
          '<div class="product-card__body">' +
            '<h3 class="product-card__name">' + product.name + '</h3>' +
            '<p class="product-card__desc">' + product.description + '</p>' +
            '<span class="product-card__moq">' + product.moq + '</span>' +
            '<a href="#contact" class="btn btn--primary btn--sm btn--full product-quote-btn" data-product="' + product.name + '">' +
              'Request Quote' +
            '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    /* Re-bind lazy load after render (scroll reveal runs once in init) */
    initLazyLoading();

    /* Pre-fill product field when "Request Quote" is clicked */
    document.querySelectorAll('.product-quote-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var productInput = document.getElementById('product');
        if (productInput) {
          productInput.value = btn.getAttribute('data-product');
        }
      });
    });
  }

  /* ==========================================================
     HAMBURGER MENU
     ========================================================== */
  function initMobileNav() {
    /* Create overlay element for mobile menu backdrop */
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
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    /* Close menu when a nav link is clicked */
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* Close menu on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ==========================================================
     SMOOTH SCROLLING
     Enhances anchor link navigation with offset for sticky header
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ==========================================================
     ACTIVE NAVIGATION HIGHLIGHT
     Updates active nav link based on scroll position
     ========================================================== */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
      var scrollPos = window.scrollY + 100;

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ==========================================================
     HEADER SCROLL EFFECT
     Adds shadow to header when page is scrolled
     ========================================================== */
  function initHeaderScroll() {
    function handleScroll() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==========================================================
     BACK TO TOP BUTTON
     ========================================================== */
  function initBackToTop() {
    var scrollThreshold = 400;

    window.addEventListener('scroll', function () {
      if (window.scrollY > scrollThreshold) {
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

  /* ==========================================================
     SCROLL REVEAL ANIMATIONS
     Uses Intersection Observer for performance
     ========================================================== */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal:not(.revealed)');

    if (!('IntersectionObserver' in window)) {
      /* Fallback: show all elements immediately */
      elements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================
     LAZY IMAGE LOADING
     Loads images when they enter the viewport
     ========================================================== */
  function initLazyLoading() {
    var lazyImages = document.querySelectorAll('img.lazy');

    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach(function (img) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
        }
      });
      return;
    }

    var imageObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '100px' }
    );

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ==========================================================
     FORM VALIDATION
     Client-side validation with accessible error messages
     ========================================================== */
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
          var phoneRegex = /^[\d\s+\-()]{10,15}$/;
          if (!phoneRegex.test(value.trim())) return 'Please enter a valid phone number.';
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

    /* Validate a single field */
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

    /* Real-time validation on blur */
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', function () {
        validateField(key);
      });

      fields[key].el.addEventListener('input', function () {
        if (fields[key].el.classList.contains('error')) {
          validateField(key);
        }
      });
    });

    /* Form submission */
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) {
          isValid = false;
        }
      });

      if (!isValid) {
        /* Focus first invalid field */
        var firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      /* Collect form data (ready for future API integration) */
      var formData = {
        name: fields.name.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        product: fields.product.el.value.trim(),
        message: document.getElementById('message').value.trim()
      };

      /* Show success message — replace with API call when backend is ready */
      console.log('Form submitted:', formData);

      var successMsg = document.getElementById('form-success');
      successMsg.hidden = false;
      contactForm.reset();

      /* Hide success message after 5 seconds */
      setTimeout(function () {
        successMsg.hidden = true;
      }, 5000);
    });
  }

  /* ==========================================================
     INITIALIZE ALL MODULES
     ========================================================== */
  function init() {
    renderProducts();
    initMobileNav();
    initSmoothScroll();
    initActiveNav();
    initHeaderScroll();
    initBackToTop();
    initScrollReveal();
    initLazyLoading();
    initFormValidation();
  }

  /* Run when DOM is fully loaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
