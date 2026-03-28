document.addEventListener('DOMContentLoaded', () => {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const announce = (message) => {
    let liveRegion = qs('#app-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'app-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0 0 0 0)';
      liveRegion.style.clipPath = 'inset(50%)';
      liveRegion.style.whiteSpace = 'nowrap';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  };

  const createToastContainer = () => {
    let container = qs('.toast-container');
    if (container) return container;

    container = document.createElement('div');
    container.className = 'toast-container';
    Object.assign(container.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: '9999',
      display: 'grid',
      gap: '10px',
      width: 'min(360px, calc(100vw - 32px))'
    });

    document.body.appendChild(container);
    return container;
  };

  const showToast = (message) => {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = message;

    Object.assign(toast.style, {
      background: '#1d1d1f',
      color: '#fff',
      padding: '14px 16px',
      borderRadius: '16px',
      boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
      fontSize: '0.92rem',
      lineHeight: '1.5',
      transform: 'translateY(8px)',
      opacity: '0',
      transition: 'opacity 180ms ease, transform 180ms ease'
    });

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      window.setTimeout(() => toast.remove(), 180);
    }, 2200);
  };

  const setActiveWithinGroup = (target, selector, activeClass = 'active') => {
    const group = target.closest('[data-choice-group]') || target.parentElement;
    if (!group) return;

    qsa(selector, group).forEach((item) => item.classList.remove(activeClass));
    target.classList.add(activeClass);
  };

  const updateHeaderCount = (type, delta = 1) => {
    const iconMap = {
      cart: '.icon-btn[aria-label="Cart"] .count',
      wishlist: '.icon-btn[aria-label="Wishlist"] .count'
    };

    const badge = qs(iconMap[type]);
    if (!badge) return;

    const currentValue = Number.parseInt(badge.textContent || '0', 10);
    const nextValue = Number.isNaN(currentValue) ? delta : currentValue + delta;
    badge.textContent = String(Math.max(nextValue, 0));
  };

  const initWishlistButtons = () => {
    qsa('.wishlist-btn, .icon-btn[aria-label="Add to wishlist"]').forEach((button) => {
      button.addEventListener('click', () => {
        const icon = qs('i', button);
        const isActive = button.classList.toggle('is-active');

        if (icon) {
          icon.classList.toggle('fa-regular', !isActive);
          icon.classList.toggle('fa-solid', isActive);
        }

        if (button.classList.contains('wishlist-btn')) {
          updateHeaderCount('wishlist', isActive ? 1 : -1);
        }

        const card = button.closest('.product-card, .related-card, .summary-shell');
        const title = qs('h3, h1', card)?.textContent?.trim() || 'Item';
        const message = isActive ? `${title} added to wishlist` : `${title} removed from wishlist`;
        showToast(message);
        announce(message);
      });
    });
  };

  const initSwatches = () => {
    qsa('.swatches, .swatch-row').forEach((group) => {
      const swatches = qsa('.swatch', group);
      swatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
          swatches.forEach((item) => item.classList.remove('active'));
          swatch.classList.add('active');

          const label = swatch.getAttribute('aria-label') || 'Color selected';
          const section = group.closest('.variant-section, .product-card, .related-card');
          const helper = qs('.variant-header span', section);

          if (helper && helper.textContent.toLowerCase().includes('selected')) {
            helper.textContent = `Selected: ${label}`;
          }

          showToast(`${label} selected`);
          announce(`${label} selected`);
        });
      });
    });
  };

  const initChoiceButtons = () => {
    qsa('.choice-grid').forEach((group) => {
      group.setAttribute('data-choice-group', 'true');
      qsa('.choice', group).forEach((choice) => {
        choice.addEventListener('click', () => {
          setActiveWithinGroup(choice, '.choice');
          const value = choice.textContent.trim();
          showToast(`${value} selected`);
          announce(`${value} selected`);
        });
      });
    });
  };

  const initChipsAndTabs = () => {
    qsa('.chips, .toolbar, .tabs-nav').forEach((group) => {
      const buttons = qsa('.chip, .tab-btn', group);
      if (!buttons.length) return;

      group.setAttribute('data-choice-group', 'true');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          setActiveWithinGroup(button, '.chip, .tab-btn');

          if (button.classList.contains('tab-btn')) {
            const label = button.textContent.trim();
            showToast(`${label} tab opened`);
            announce(`${label} tab opened`);
          }
        });
      });
    });
  };

  const initProductGallery = () => {
    const galleryShell = qs('.gallery-shell');
    if (!galleryShell) return;

    const mainImage = qs('.hero-media img', galleryShell);
    const thumbs = qsa('.thumb', galleryShell);
    if (!mainImage || !thumbs.length) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((item) => item.classList.remove('active'));
        thumb.classList.add('active');

        const image = qs('img', thumb);
        if (!image) return;

        const fullSrc = image.src.replace(/w=700/, 'w=1400');
        mainImage.src = fullSrc;
        mainImage.alt = image.alt.replace('Thumbnail of ', '');
        announce('Product image updated');
      });
    });
  };

  const initQuantityControls = () => {
    qsa('.qty-box').forEach((box) => {
      const valueEl = qs('.qty-value', box);
      const buttons = qsa('.qty-btn', box);
      if (!valueEl || buttons.length < 2) return;

      let quantity = Number.parseInt(valueEl.textContent || '1', 10);
      if (Number.isNaN(quantity) || quantity < 1) quantity = 1;
      valueEl.textContent = String(quantity);

      buttons[0].addEventListener('click', () => {
        quantity = Math.max(1, quantity - 1);
        valueEl.textContent = String(quantity);
        announce(`Quantity ${quantity}`);
      });

      buttons[1].addEventListener('click', () => {
        quantity += 1;
        valueEl.textContent = String(quantity);
        announce(`Quantity ${quantity}`);
      });
    });
  };

  const getProductNameFromContext = (scope) => {
    return (
      qs('h1', scope)?.textContent?.trim() ||
      qs('h3', scope)?.textContent?.trim() ||
      'Item'
    );
  };

  const initAddToCart = () => {
    qsa('.product-cta .btn-light, .btn-dark, .btn-whatsapp').forEach((button) => {
      const text = button.textContent.trim().toLowerCase();
      const isCartButton = text.includes('add to cart');
      const isBuyButton = text.includes('buy now');
      const isWhatsAppButton = text.includes('whatsapp');

      if (!isCartButton && !isBuyButton && !isWhatsAppButton) return;

      button.addEventListener('click', (event) => {
        if (isWhatsAppButton) {
          announce('Opening WhatsApp order flow');
          return;
        }

        if (button.tagName.toLowerCase() === 'a') {
          event.preventDefault();
        }

        const scope = button.closest('.product-card, .related-card, .summary-shell') || document;
        const productName = getProductNameFromContext(scope);

        if (isCartButton) {
          updateHeaderCount('cart', 1);
          showToast(`${productName} added to cart`);
          announce(`${productName} added to cart`);
          return;
        }

        if (isBuyButton) {
          showToast(`Proceeding to checkout for ${productName}`);
          announce(`Proceeding to checkout for ${productName}`);
        }
      });
    });
  };

  const initPagination = () => {
    qsa('.pagination').forEach((pagination) => {
      const pages = qsa('.page-btn', pagination);
      pages.forEach((page) => {
        page.addEventListener('click', () => {
          const hasNumber = /^\d+$/.test(page.textContent.trim());
          if (!hasNumber) {
            showToast('Pagination demo only');
            return;
          }

          pages.forEach((btn) => btn.classList.remove('active'));
          page.classList.add('active');
          const pageNo = page.textContent.trim();
          showToast(`Moved to page ${pageNo}`);
          announce(`Moved to page ${pageNo}`);
        });
      });
    });
  };

  const initFilterInteractions = () => {
    qsa('.filter-card input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', () => {
        const labelText = input.closest('label')?.textContent?.trim() || 'Filter';
        const state = input.checked ? 'applied' : 'removed';
        showToast(`${labelText} ${state}`);
        announce(`${labelText} ${state}`);
      });
    });

    qsa('.clear-link').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        qsa('.filter-card input[type="checkbox"]').forEach((input) => {
          input.checked = false;
        });
        showToast('Filters cleared');
        announce('Filters cleared');
      });
    });

    qsa('.mobile-filter').forEach((button) => {
      button.addEventListener('click', () => {
        const sidebar = qs('.sidebar');
        if (!sidebar) return;

        const isHidden = getComputedStyle(sidebar).display === 'none';
        sidebar.style.display = isHidden ? 'grid' : 'none';
        showToast(isHidden ? 'Filters opened' : 'Filters hidden');
        announce(isHidden ? 'Filters opened' : 'Filters hidden');
      });
    });
  };

  const initViewToggle = () => {
    qsa('.view-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const grid = qs('.products-grid');
        if (!grid) return;

        const isList = grid.classList.toggle('list-view');

        if (isList) {
          grid.style.gridTemplateColumns = '1fr';
          showToast('List view enabled');
          announce('List view enabled');
        } else {
          grid.style.gridTemplateColumns = '';
          showToast('Grid view enabled');
          announce('Grid view enabled');
        }
      });
    });
  };

  const initSearchForms = () => {
    qsa('.search').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = qs('input', form);
        const value = input?.value?.trim();
        if (!value) {
          showToast('Enter a search term');
          announce('Enter a search term');
          return;
        }

        showToast(`Searching for “${value}”`);
        announce(`Searching for ${value}`);
      });
    });
  };

  const initNewsletter = () => {
    qsa('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = qs('input[type="email"]', form);
        const email = input?.value?.trim();

        if (!email) {
          showToast('Please enter your email address');
          announce('Please enter your email address');
          return;
        }

        showToast('Thanks for subscribing');
        announce('Thanks for subscribing');
        form.reset();
      });
    });
  };

  const initThumbHoverState = () => {
    qsa('.thumb').forEach((thumb) => {
      thumb.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          thumb.click();
        }
      });
    });
  };

  const initMenuPlaceholder = () => {
    qsa('.mobile-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const nav = qs('.mega-nav');
        if (!nav) return;
        const isHidden = getComputedStyle(nav).display === 'none';
        nav.style.display = isHidden ? 'block' : 'none';
        announce(isHidden ? 'Navigation opened' : 'Navigation hidden');
      });
    });
  };

  initWishlistButtons();
  initSwatches();
  initChoiceButtons();
  initChipsAndTabs();
  initProductGallery();
  initQuantityControls();
  initAddToCart();
  initPagination();
  initFilterInteractions();
  initViewToggle();
  initSearchForms();
  initNewsletter();
  initThumbHoverState();
  initMenuPlaceholder();
});
