
(function () {
    'use strict';
  
    const API_BASE_URL = 'http://127.0.0.1:8000';
  
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
  
    const loading = document.getElementById('product-loading');
    const error = document.getElementById('product-error');
    const content = document.getElementById('product-content');
  
    const mainImage = document.getElementById('main-product-image');
    
  
    function getImageUrl(path) {
      if (!path) return '';
  
      if (/^(https?:|data:)/i.test(path)) {
        return path;
      }
  
      return path.split('/').map(encodeURIComponent).join('/');
    }
  
    function showError(message) {
      loading.hidden = true;
      content.hidden = true;
      error.hidden = false;
  
      if (message) {
        error.textContent = message;
      }
    }
  
    function displaySpecifications(specifications) {
      const container = document.getElementById(
        'product-specifications-list'
      );
  
      container.innerHTML = '';
  
      if (
        !specifications ||
        typeof specifications !== 'object' ||
        Object.keys(specifications).length === 0
      ) {
        container.textContent = 'Specifications available on request.';
        return;
      }
  
      const table = document.createElement('table');
      table.className = 'product-specifications__table';
  
      Object.entries(specifications).forEach(function ([key, value]) {
        const row = document.createElement('tr');
        const heading = document.createElement('th');
        const detail = document.createElement('td');
  
        heading.textContent = key;
        detail.textContent = Array.isArray(value)
          ? value.join(', ')
          : String(value ?? '');
  
        row.append(heading, detail);
        table.appendChild(row);
      });
  
      container.appendChild(table);
    }
  
    
let galleryImages = [];
let currentImageIndex = 0;

function displayGallery(images) {
  galleryImages = images;
  currentImageIndex = 0;

  const previousButton = document.getElementById('gallery-prev');
  const nextButton = document.getElementById('gallery-next');
  const counter = document.getElementById('gallery-counter');

  function showImage(index) {
    if (!galleryImages.length) return;

    currentImageIndex =
      (index + galleryImages.length) % galleryImages.length;

    mainImage.src = getImageUrl(galleryImages[currentImageIndex]);
    mainImage.alt = 'Product image ' + (currentImageIndex + 1);

    counter.textContent =
      (currentImageIndex + 1) + ' / ' + galleryImages.length;

    previousButton.disabled = galleryImages.length <= 1;
    nextButton.disabled = galleryImages.length <= 1;
  }

  previousButton.onclick = function () {
    showImage(currentImageIndex - 1);
  };

  nextButton.onclick = function () {
    showImage(currentImageIndex + 1);
  };

  // Swipe support for touchscreens
  let touchStartX = 0;

  mainImage.ontouchstart = function (event) {
    touchStartX = event.changedTouches[0].screenX;
  };

  mainImage.ontouchend = function (event) {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchEndX - touchStartX;

    if (Math.abs(difference) < 40) return;

    showImage(
      difference < 0
        ? currentImageIndex + 1
        : currentImageIndex - 1
    );
  };

  if (!galleryImages.length) {
    mainImage.removeAttribute('src');
    mainImage.alt = 'Product image unavailable';
    counter.textContent = 'No images available';
    previousButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  showImage(0);
}

  
    function displayProduct(product) {
      document.getElementById('product-category').textContent =
        product.category || 'Product';
  
      document.getElementById('product-name').textContent =
        product.name || 'Product';
  
      document.getElementById('product-description').textContent =
        product.description || '';
  
      document.getElementById('product-moq').textContent =
        product.moq || 'Quote on request';
  
      document.getElementById('product-price').textContent =
        product.price != null ? product.price : 'Available on request';
  
        const images = [
          product.image_url,
          ...(Array.isArray(product.images) ? product.images : [])
      ].filter(function (image, index, array) {
          return typeof image === 'string' &&
              image.trim() &&
              array.indexOf(image) === index;
      });
  
      displayGallery(images);
      displaySpecifications(product.specifications);
  
      loading.hidden = true;
      error.hidden = true;
      content.hidden = false;
    }
  
    async function loadProduct() {
      if (!productId) {
        showError('No product was selected. Please browse our products.');
        return;
      }
  
      try {
        const response = await fetch(API_BASE_URL + '/products');
  
        if (!response.ok) {
          throw new Error('Could not load products.');
        }
  
        const data = await response.json();
        const products = Array.isArray(data) ? data : data.products;
  
        if (!Array.isArray(products)) {
          throw new Error('Unexpected product data received.');
        }
  
        const product = products.find(function (item) {
          return String(item.id) === productId;
        });
  
        if (!product) {
          showError('This product could not be found.');
          return;
        }
  
        displayProduct(product);
  
        document.title =
          product.name + ' | Naman Creative Advertising';
  
      } catch (err) {
        console.error('Product loading error:', err);
        showError('Unable to load product details. Please try again later.');
      }
    }
  
    loadProduct();
  
  })();
  