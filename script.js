(() => {
  'use strict';

  const STORAGE_KEYS = {
    cart: 'velvet_crown_cart',
    wishlist: 'velvet_crown_wishlist'
  };

  const PRODUCT_CATALOG = {
    p1: {
      id: 'p1',
      name: 'Velvet Body Wave Frontal',
      price: 2450,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=velvet-body-wave-frontal'
    },
    p2: {
      id: 'p2',
      name: 'Silk Straight Closure Unit',
      price: 1980,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=silk-straight-closure-unit'
    },
    p3: {
      id: 'p3',
      name: 'Deep Wave Glueless Wig',
      price: 2320,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=deep-wave-glueless-wig'
    },
    p4: {
      id: 'p4',
      name: 'Ombre Melt Luxury Unit',
      price: 2480,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=ombre-melt-luxury-unit'
    },
    p5: {
      id: 'p5',
      name: 'Classic Blunt Bob Wig',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=classic-blunt-bob-wig'
    },
    p6: {
      id: 'p6',
      name: 'Water Curl HD Frontal Wig',
      price: 2780,
      image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=water-curl-hd-frontal-wig'
    },
    p7: {
      id: 'p7',
      name: 'AirFit Glueless Straight Wig',
      price: 2120,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=airfit-glueless-straight-wig'
    },
    p8: {
      id: 'p8',
      name: 'Soft Loose Curl Closure Wig',
      price: 1890,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=soft-loose-curl-closure-wig'
    },
    p9: {
      id: 'p9',
      name: 'Royal Length Straight Unit',
      price: 3180,
      image: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=royal-length-straight-unit'
    },
    p10: {
      id: 'p10',
      name: 'Wine Silk Closure Wig',
      price: 2040,
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=wine-silk-closure-wig'
    },
    p11: {
      id: 'p11',
      name: 'Everyday Closure Silk Wig',
      price: 1420,
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=everyday-closure-silk-wig'
    },
    p12: {
      id: 'p12',
      name: 'Runway Straight Frontal Wig',
      price: 2640,
      image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=600&q=80',
      link: 'product.html?slug=runway-straight-frontal-wig'
    }
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    cart: loadStorage(STORAGE_KEYS.cart, []),
    wishlist: loadStorage(STORAGE_KEYS.wishlist, []),
    products: [],
    filters: {
      category: 'all',
      texture: 'all',
      lace: 'all',
      color: 'all',
      length: 'all',
      price: 'all'
    },
    sort: 'featured',
    openPanel: null,
    openDrawer: null
  };

  function loadStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage failures
    }
  }

  function formatPrice(value) {
    return `GH₵${Number(value).toLocaleString()}`;
  }

  function createToastContainer() {
    let container = $('.toast-container');
    if (container) return container;

    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  function toast(message) {
    const container = createToastContainer();
    const item = document.createElement('div');
    item.className = 'app-toast';
    item.textContent = message;
    item.style.opacity = '0';
    item.style.transform = 'translateY(8px)';
    item.style.transition = 'opacity 180ms ease, transform 180ms ease';
    container.appendChild(item);

    requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      window.setTimeout(() => item.remove(), 220);
    }, 2200);
  }

  function announce(message) {
    let region = $('#live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'live-region';
      region.className = 'sr-only';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = message;
  }

  function getProductFromButton(button) {
    const id = button.dataset.productId;
    if (id && PRODUCT_CATALOG[id]) return PRODUCT_CATALOG[id];

    const card = button.closest('[data-product-id]');
    const fallbackId = card?.dataset.productId;
    if (fallbackId && PRODUCT_CATALOG[fallbackId]) return PRODUCT_CATALOG[fallbackId];

    const name = button.dataset.productName || card?.dataset.name || 'Product';
    const price = Number(button.dataset.price || card?.dataset.price || 0);
    const image = $('img', card)?.src || '';
    const link = $('a[href*="product.html"]', card)?.getAttribute('href') || '#';

    return {
      id: fallbackId || name.toLowerCase().replace(/\s+/g, '-'),
      name,
      price,
      image,
      link
    };
  }

  function syncCountBadges() {
    $$('[data-cart-count]').forEach((node) => {
      const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      node.textContent = String(totalQty);
    });

    $$('[data-wishlist-count]').forEach((node) => {
      node.textContent = String(state.wishlist.length);
    });
  }

  function renderCart() {
    const target = $('[data-cart-items]');
    const totalNode = $('[data-cart-total]');
    if (!target) return;

    target.innerHTML = '';

    if (!state.cart.length) {
      target.innerHTML = `
        <div class="empty-state">
          <p>Your cart is empty.</p>
          <a href="products.html" class="btn btn-dark">Shop now</a>
        </div>
      `;
      if (totalNode) totalNode.textContent = formatPrice(0);
      return;
    }

    const fragment = document.createDocumentFragment();
    let total = 0;

    state.cart.forEach((item) => {
      total += item.price * item.quantity;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-copy">
          <strong>${item.name}</strong>
          <span>${formatPrice(item.price)} each</span>
          <span>Quantity: ${item.quantity}</span>
        </div>
        <div class="item-actions">
          <button class="item-mini-btn" type="button" data-cart-action="decrease" data-product-id="${item.id}">−</button>
          <button class="item-mini-btn" type="button" data-cart-action="increase" data-product-id="${item.id}">+</button>
          <button class="item-mini-btn" type="button" data-cart-action="remove" data-product-id="${item.id}">Remove</button>
        </div>
      `;
      fragment.appendChild(row);
    });

    target.appendChild(fragment);
    if (totalNode) totalNode.textContent = formatPrice(total);
  }

  function renderWishlist() {
    const target = $('[data-wishlist-items]');
    if (!target) return;

    target.innerHTML = '';

    if (!state.wishlist.length) {
      target.innerHTML = `
        <div class="empty-state">
          <p>No saved items yet.</p>
          <a href="products.html" class="btn btn-dark">Discover wigs</a>
        </div>
      `;
      syncWishlistButtons();
      return;
    }

    const fragment = document.createDocumentFragment();

    state.wishlist.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'wishlist-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-copy">
          <strong>${item.name}</strong>
          <span>${formatPrice(item.price)}</span>
          <span><a href="${item.link}">View product</a></span>
        </div>
        <div class="item-actions">
          <button class="item-mini-btn" type="button" data-wishlist-action="cart" data-product-id="${item.id}">Add to cart</button>
          <button class="item-mini-btn" type="button" data-wishlist-action="remove" data-product-id="${item.id}">Remove</button>
        </div>
      `;
      fragment.appendChild(row);
    });

    target.appendChild(fragment);
    syncWishlistButtons();
  }

  function syncWishlistButtons() {
    const wishlistIds = new Set(state.wishlist.map((item) => item.id));
    $$('[data-product-id].wishlist-btn, .wishlist-btn[data-product-id]').forEach((button) => {
      const id = button.dataset.productId;
      const icon = $('i', button);
      const active = wishlistIds.has(id);
      button.classList.toggle('is-active', active);
      if (icon) {
        icon.classList.toggle('fa-regular', !active);
        icon.classList.toggle('fa-solid', active);
      }
    });
  }

  function addToCart(product, quantity = 1) {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({ ...product, quantity });
    }

    saveStorage(STORAGE_KEYS.cart, state.cart);
    syncCountBadges();
    renderCart();
    toast(`${product.name} added to cart`);
    announce(`${product.name} added to cart`);
  }

  function updateCartItem(id, action) {
    const item = state.cart.find((entry) => entry.id === id);
    if (!item) return;

    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      item.quantity = Math.max(1, item.quantity - 1);
    } else if (action === 'remove') {
      state.cart = state.cart.filter((entry) => entry.id !== id);
    }

    saveStorage(STORAGE_KEYS.cart, state.cart);
    syncCountBadges();
    renderCart();
  }

  function toggleWishlist(product) {
    const exists = state.wishlist.some((item) => item.id === product.id);
    if (exists) {
      state.wishlist = state.wishlist.filter((item) => item.id !== product.id);
      toast(`${product.name} removed from wishlist`);
      announce(`${product.name} removed from wishlist`);
    } else {
      state.wishlist.push(product);
      toast(`${product.name} saved to wishlist`);
      announce(`${product.name} saved to wishlist`);
    }

    saveStorage(STORAGE_KEYS.wishlist, state.wishlist);
    syncCountBadges();
    renderWishlist();
  }

  function moveWishlistItemToCart(id) {
    const item = state.wishlist.find((entry) => entry.id === id);
    if (!item) return;
    addToCart(item, 1);
    state.wishlist = state.wishlist.filter((entry) => entry.id !== id);
    saveStorage(STORAGE_KEYS.wishlist, state.wishlist);
    syncCountBadges();
    renderWishlist();
  }

  function openElementPanel(panelId) {
    const target = document.getElementById(panelId);
    const overlay = $('[data-overlay]');
    if (!target) return;

    closeAllPanels(false);
    target.hidden = false;
    target.classList.add('is-open');
    state.openPanel = panelId;

    if (overlay) {
      overlay.hidden = false;
    }

    document.body.classList.add('panel-open');
  }

  function openDrawer(drawerId) {
    const target = document.getElementById(drawerId);
    const overlay = $('[data-overlay]');
    if (!target) return;

    closeAllPanels(false);
    target.hidden = false;
    target.classList.add('is-open');
    state.openDrawer = drawerId;

    if (overlay) {
      overlay.hidden = false;
    }

    document.body.classList.add('panel-open');
  }

  function closeAllPanels(updateOverlay = true) {
    $$('.side-panel, .mobile-menu-drawer, .mobile-filters-panel').forEach((panel) => {
      panel.classList.remove('is-open');
      panel.hidden = true;
    });

    state.openPanel = null;
    state.openDrawer = null;

    if (updateOverlay) {
      const overlay = $('[data-overlay]');
      if (overlay) overlay.hidden = true;
      document.body.classList.remove('panel-open');
    }
  }

  function initPanelControls() {
    $$('[data-open-panel]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const target = trigger.dataset.openPanel;
        if (target === 'filters-panel') {
          openDrawer(target);
        } else {
          openElementPanel(target);
        }
      });
    });

    $$('.mobile-nav-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        openDrawer('mobile-menu');
      });
    });

    $$('.close-panel, .mobile-nav-close').forEach((button) => {
      button.addEventListener('click', () => {
        closeAllPanels();
      });
    });

    const overlay = $('[data-overlay]');
    if (overlay) {
      overlay.addEventListener('click', () => {
        closeAllPanels();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAllPanels();
      }
    });
  }

  function initSearchSuggestions() {
    $$('.global-search').forEach((form) => {
      const input = $('input[type="search"]', form);
      const suggestions = $('.search-suggestions', form);
      if (!input || !suggestions) return;

      input.addEventListener('focus', () => {
        if (input.value.trim() || document.body.dataset.page) {
          suggestions.hidden = false;
        }
      });

      input.addEventListener('input', () => {
        const hasValue = input.value.trim().length > 0;
        suggestions.hidden = !hasValue;
      });

      input.addEventListener('blur', () => {
        window.setTimeout(() => {
          suggestions.hidden = true;
        }, 120);
      });

      form.addEventListener('submit', (event) => {
        const value = input.value.trim();
        if (!value) {
          event.preventDefault();
          toast('Enter a search term');
          announce('Enter a search term');
        }
      });
    });

    $$('.mobile-search').forEach((form) => {
      const input = $('input[type="search"]', form);
      form.addEventListener('submit', (event) => {
        if (!input || input.value.trim()) return;
        event.preventDefault();
        toast('Enter a search term');
      });
    });
  }

  function initSwatchesAndChips() {
    $$('[data-choice-group]').forEach((group) => {
      group.addEventListener('click', (event) => {
        const target = event.target.closest('.chip, .swatch');
        if (!target || !group.contains(target)) return;

        const siblings = $$('.chip, .swatch', group);
        siblings.forEach((item) => item.classList.remove('active'));
        target.classList.add('active');
      });
    });
  }

  function initHomeFilters() {
    const buttons = $$('[data-home-filter]');
    const cards = $$('[data-product-grid] .product-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.homeFilter;
        cards.forEach((card) => {
          const category = card.dataset.category || '';
          const visible = filter === 'all' || category.includes(filter);
          card.hidden = !visible;
        });
      });
    });
  }

  function collectProducts() {
    state.products = $$('[data-results-grid] .product-card');
  }

  function priceMatches(price, filter) {
    if (filter === 'all') return true;
    if (filter === 'under-1800') return price < 1800;
    if (filter === '1800-2400') return price >= 1800 && price <= 2400;
    if (filter === '2400-3000') return price > 2400 && price <= 3000;
    if (filter === '3000-plus') return price > 3000;
    return true;
  }

  function applyFilters() {
    if (!state.products.length) return;

    state.products.forEach((card) => {
      const category = card.dataset.category || '';
      const texture = card.dataset.texture || '';
      const lace = card.dataset.lace || '';
      const color = card.dataset.color || '';
      const length = card.dataset.length || '';
      const price = Number(card.dataset.price || 0);

      const matches = [
        state.filters.category === 'all' || category === state.filters.category,
        state.filters.texture === 'all' || texture === state.filters.texture,
        state.filters.lace === 'all' || lace === state.filters.lace,
        state.filters.color === 'all' || color === state.filters.color,
        state.filters.length === 'all' || length === state.filters.length,
        priceMatches(price, state.filters.price)
      ].every(Boolean);

      card.hidden = !matches;
    });

    updateResultsCount();
    updateActiveFilterChips();
  }

  function sortProducts() {
    const grid = $('[data-results-grid]');
    if (!grid || !state.products.length) return;

    const items = [...state.products];
    const sorter = state.sort;

    items.sort((a, b) => {
      const priceA = Number(a.dataset.price || 0);
      const priceB = Number(b.dataset.price || 0);
      const ratingA = Number(a.dataset.rating || 0);
      const ratingB = Number(b.dataset.rating || 0);
      const nameA = (a.dataset.name || '').toLowerCase();
      const nameB = (b.dataset.name || '').toLowerCase();

      switch (sorter) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating-high':
          return ratingB - ratingA;
        case 'name-az':
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    items.forEach((item) => grid.appendChild(item));
  }

  function updateResultsCount() {
    const countNode = $('[data-results-count]');
    if (!countNode) return;

    const visible = state.products.filter((card) => !card.hidden).length;
    countNode.textContent = String(visible);
  }

  function labelForFilter(key, value) {
    const map = {
      category: {
        'lace-front': 'Lace Front',
        closure: 'Closure',
        glueless: 'Glueless',
        colored: 'Colored',
        bob: 'Bob'
      },
      texture: {
        'body-wave': 'Body Wave',
        straight: 'Straight',
        'deep-wave': 'Deep Wave',
        'water-curl': 'Water Curl',
        'loose-curl': 'Loose Curl'
      },
      lace: {
        '13x4': '13x4 Frontal',
        '13x6': '13x6 Frontal',
        '5x5': '5x5 Closure',
        '6x6': '6x6 Closure',
        'glueless-cap': 'Glueless Cap'
      },
      color: {
        'jet-black': 'Jet Black',
        'natural-black': 'Natural Black',
        brown: 'Brown',
        ombre: 'Ombre',
        blonde: 'Blonde',
        burgundy: 'Burgundy'
      },
      length: {
        short: '10” - 14”',
        medium: '16” - 24”',
        long: '26” - 32”'
      },
      price: {
        'under-1800': 'Under GH₵1,800',
        '1800-2400': 'GH₵1,800 - GH₵2,400',
        '2400-3000': 'GH₵2,400 - GH₵3,000',
        '3000-plus': 'GH₵3,000+'
      }
    };

    return map[key]?.[value] || value;
  }

  function updateActiveFilterChips() {
    const chips = $$('[data-clear-filter]');
    const clearAll = $('[data-clear-all]');
    let activeCount = 0;

    chips.forEach((chip) => {
      const key = chip.dataset.clearFilter;
      const value = state.filters[key];
      if (!value || value === 'all') {
        chip.classList.add('is-hidden');
        return;
      }

      chip.classList.remove('is-hidden');
      $('span', chip).textContent = labelForFilter(key, value);
      activeCount += 1;
    });

    if (clearAll) {
      clearAll.classList.toggle('is-hidden', activeCount === 0);
    }
  }

  function setDesktopFilter(groupName, value) {
    const input = $(`input[name="${groupName}"][value="${value}"]`);
    if (input) input.checked = true;
  }

  function syncMobileChips(key, value) {
    const group = $(`[data-mobile-filter-group="${key}"]`);
    if (!group) return;

    $$('.chip', group).forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filterValue === value);
    });
  }

  function syncColorButtons(value) {
    const buttons = $$('[data-color-filter]');
    buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.colorFilter === value);
    });
  }

  function setFilter(key, value) {
    state.filters[key] = value;
    if (key !== 'color') {
      setDesktopFilter(key, value);
      syncMobileChips(key, value);
    } else {
      syncColorButtons(value);
    }
    applyFilters();
  }

  function resetFilters() {
    state.filters = {
      category: 'all',
      texture: 'all',
      lace: 'all',
      color: 'all',
      length: 'all',
      price: 'all'
    };

    ['category', 'texture', 'lace', 'length', 'price'].forEach((key) => {
      setDesktopFilter(key, 'all');
      syncMobileChips(key, 'all');
    });

    syncColorButtons('all');
    applyFilters();
  }

  function initDesktopFilters() {
    ['category', 'texture', 'lace', 'length', 'price'].forEach((key) => {
      $$(`input[name="${key}"]`).forEach((input) => {
        input.addEventListener('change', () => {
          setFilter(key, input.value);
        });
      });
    });

    $$('[data-color-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.colorFilter;
        setFilter('color', value);
      });
    });
  }

  function initMobileFilters() {
    $$('[data-mobile-filter-group]').forEach((group) => {
      group.addEventListener('click', (event) => {
        const chip = event.target.closest('.chip');
        if (!chip) return;
        const key = group.dataset.mobileFilterGroup;
        const value = chip.dataset.filterValue;
        setFilter(key, value);
      });
    });
  }

  function initClearFilterButtons() {
    $$('[data-clear-filter]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.clearFilter;
        setFilter(key, 'all');
      });
    });

    $$('[data-clear-all]').forEach((button) => {
      button.addEventListener('click', () => {
        resetFilters();
      });
    });
  }

  function initSorting() {
    const select = $('[data-sort-select]');
    if (!select) return;

    select.addEventListener('change', () => {
      state.sort = select.value;
      sortProducts();
      toast(`Sorted by ${select.options[select.selectedIndex].textContent.replace('Sort: ', '')}`);
    });
  }

  function initWishlistButtons() {
    $$('.wishlist-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const product = getProductFromButton(button);
        toggleWishlist(product);
      });
    });
  }

  function initCartButtons() {
    $$('.add-to-cart-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const product = getProductFromButton(button);
        addToCart(product, 1);
      });
    });

    document.addEventListener('click', (event) => {
      const cartAction = event.target.closest('[data-cart-action]');
      if (cartAction) {
        const { productId, cartAction: action } = cartAction.dataset;
        updateCartItem(productId, action);
        return;
      }

      const wishlistAction = event.target.closest('[data-wishlist-action]');
      if (wishlistAction) {
        const { productId, wishlistAction: action } = wishlistAction.dataset;
        if (action === 'remove') {
          state.wishlist = state.wishlist.filter((item) => item.id !== productId);
          saveStorage(STORAGE_KEYS.wishlist, state.wishlist);
          syncCountBadges();
          renderWishlist();
        }

        if (action === 'cart') {
          moveWishlistItemToCart(productId);
        }
      }
    });
  }

  function initNewsletter() {
    $$('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = $('input[type="email"]', form);
        const value = input?.value.trim();
        if (!value) {
          toast('Enter your email address');
          announce('Enter your email address');
          return;
        }
        form.reset();
        toast('You are subscribed');
        announce('You are subscribed');
      });
    });
  }

  function initQueryPrefill() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      $$('.global-search input[name="q"], .mobile-search input[name="q"]').forEach((input) => {
        input.value = q;
      });

      if (state.products.length) {
        const keyword = q.toLowerCase();
        state.products.forEach((card) => {
          const haystack = [
            card.dataset.name,
            card.dataset.category,
            card.dataset.texture,
            card.dataset.lace,
            card.dataset.color,
            card.textContent
          ]
            .join(' ')
            .toLowerCase();

          card.hidden = !haystack.includes(keyword);
        });
        updateResultsCount();
      }
    }

    const category = params.get('category');
    if (category) setFilter('category', category);
    const collection = params.get('collection');
    if (collection === 'sale' && state.products.length) {
      state.products.forEach((card) => {
        const isSale = !!$('.badge.sale', card);
        card.hidden = !isSale;
      });
      updateResultsCount();
    }
  }

  function initQuickCategoryCards() {
    $$('.quick-category-card').forEach((link) => {
      link.addEventListener('click', () => {
        const url = new URL(link.href, window.location.origin);
        const category = url.searchParams.get('category');
        if (category && window.location.pathname.includes('products.html')) {
          setFilter('category', category);
        }
      });
    });
  }

  function initFaq() {
    $$('details.faq-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        $$('details.faq-item').forEach((other) => {
          if (other !== item && other.closest('.small-faq') === item.closest('.small-faq')) {
            other.open = false;
          }
        });
      });
    });
  }

  function initProductLinkSafety() {
    $$('.product-card a, .category-card, .quick-category-card, .nav-row a, .mobile-menu-grid a').forEach((link) => {
      link.addEventListener('click', () => {
        closeAllPanels();
      });
    });
  }

  function initState() {
    syncCountBadges();
    renderCart();
    renderWishlist();
    syncWishlistButtons();
    initPanelControls();
    initSearchSuggestions();
    initSwatchesAndChips();
    initHomeFilters();
    collectProducts();
    initDesktopFilters();
    initMobileFilters();
    initClearFilterButtons();
    initSorting();
    initWishlistButtons();
    initCartButtons();
    initNewsletter();
    initQuickCategoryCards();
    initFaq();
    initProductLinkSafety();

    if (state.products.length) {
      sortProducts();
      applyFilters();
      initQueryPrefill();
    } else {
      initQueryPrefill();
    }
  }

  document.addEventListener('DOMContentLoaded', initState);
})();
