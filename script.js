// script.js

document.addEventListener("DOMContentLoaded", () => {
  const qs = (sel, parent = document) => parent.querySelector(sel);
  const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  const body = document.body;
  const mobileMenuBtn = qs(".mobile-menu-btn");
  const mainNav = qs(".main-nav");

  const productStorageKey = "gg_selected_product";

  function showToast(message) {
    let toast = qs(".gg-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "gg-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.position = "fixed";
      toast.style.left = "50%";
      toast.style.bottom = "24px";
      toast.style.transform = "translateX(-50%)";
      toast.style.padding = "12px 18px";
      toast.style.borderRadius = "999px";
      toast.style.background = "rgba(20, 20, 20, 0.94)";
      toast.style.color = "#fff";
      toast.style.fontSize = "14px";
      toast.style.letterSpacing = "0.02em";
      toast.style.zIndex = "9999";
      toast.style.opacity = "0";
      toast.style.pointerEvents = "none";
      toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.18)";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(8px)";
    }, 2200);
  }

  function closeMobileMenu() {
    if (!mainNav || !mobileMenuBtn) return;
    mainNav.classList.remove("open");
    body.classList.remove("nav-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }

  function toggleMobileMenu() {
    if (!mainNav || !mobileMenuBtn) return;
    const isOpen = mainNav.classList.toggle("open");
    body.classList.toggle("nav-open", isOpen);
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
  }

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    qsa(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) closeMobileMenu();
      });
    });

    document.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      const clickedInsideHeader = e.target.closest(".site-header");
      if (!clickedInsideHeader) closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  // Mark the current nav link as active
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  qsa(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const target = href.split("#")[0] || "index.html";
    const isHashLink = href.startsWith("#");
    const isActive =
      (!isHashLink && target === currentPath) ||
      (currentPath === "" && target === "index.html");

    if (isActive) link.classList.add("active");
  });

  // Smooth scroll for on-page links
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = qs(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Product card click tracking to make product.html dynamic
  qsa(".product-card").forEach((card) => {
    const titleEl = qs("h3", card);
    const priceEl = qs(".price", card);
    const imgEl = qs("img", card);
    const linkEl = qs('a[href="product.html"]', card);

    if (!linkEl) return;

    linkEl.addEventListener("click", () => {
      const productData = {
        title: titleEl ? titleEl.textContent.trim() : "Luxury Wig",
        price: priceEl ? priceEl.textContent.trim() : "$180.00 USD",
        image: imgEl ? imgEl.getAttribute("src") : "hero.webp",
        alt: imgEl ? imgEl.getAttribute("alt") || titleEl?.textContent.trim() || "Product image" : "Product image",
        summary: "",
        badge: "Best Seller"
      };

      const title = productData.title.toLowerCase();
      if (title.includes("copper")) {
        productData.badge = "Statement";
        productData.summary = "A bold, warm-toned look with volume and shine for standout glam.";
      } else if (title.includes("frontal")) {
        productData.badge = "Frontals";
        productData.summary = "A polished frontal style with a natural-looking hairline and soft movement.";
      } else if (title.includes("closure")) {
        productData.badge = "Easy Wear";
        productData.summary = "A low-maintenance luxury style made for effortless wear.";
      } else if (title.includes("extensions") || title.includes("clip-in")) {
        productData.badge = "Popular";
        productData.summary = "Quick volume and instant fullness with a seamless blend.";
      } else if (title.includes("straight")) {
        productData.badge = "Silky";
        productData.summary = "Glossy, sleek, and ultra refined with a runway-inspired finish.";
      } else if (title.includes("wave") || title.includes("body")) {
        productData.badge = "Best Seller";
        productData.summary = "A soft, flowing texture with rich body and beautiful movement.";
      } else {
        productData.summary = "A premium style designed to look soft, full, and elegant.";
      }

      sessionStorage.setItem(productStorageKey, JSON.stringify(productData));
    });
  });

  // Make product.html dynamic
  const storedProductRaw = sessionStorage.getItem(productStorageKey);
  const isProductPage = currentPath === "product.html";

  if (isProductPage && storedProductRaw) {
    try {
      const product = JSON.parse(storedProductRaw);

      const titleEl = qs(".product-details h1");
      const priceEl = qs(".big-price");
      const summaryEl = qs(".product-summary");
      const mainImage = qs(".main-product-image");
      const badgeEl = qs(".badge-floating");
      const announcementEl = qs(".announcement-bar span");

      if (titleEl && product.title) titleEl.textContent = product.title;
      if (priceEl && product.price) priceEl.textContent = product.price;
      if (mainImage && product.image) {
        mainImage.src = product.image;
        mainImage.alt = product.alt || product.title || "Product image";
      }
      if (badgeEl && product.badge) badgeEl.textContent = product.badge;
      if (summaryEl && product.summary) summaryEl.textContent = product.summary;
      if (announcementEl && product.title) {
        announcementEl.textContent = `Now featuring ${product.title}`;
      }

      document.title = `${product.title} | Glamour Glitz`;
    } catch (error) {
      console.warn("Could not load saved product data:", error);
    }
  }

  // Thumbnail image swap on product page
  const mainProductImage = qs(".main-product-image");
  const thumbButtons = qsa(".thumb-btn");

  if (mainProductImage && thumbButtons.length) {
    thumbButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        thumbButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const thumbImg = qs("img", btn);
        if (!thumbImg) return;

        mainProductImage.src = thumbImg.src;
        mainProductImage.alt = thumbImg.alt || mainProductImage.alt;
      });
    });
  }

  // Quantity selector on product page
  const qtyWrap = qs(".qty-selector");
  if (qtyWrap) {
    const qtyInput = qs("input", qtyWrap);
    const minusBtn = qs("button:first-child", qtyWrap);
    const plusBtn = qs("button:last-child", qtyWrap);

    const normalizeQty = () => {
      const value = parseInt(qtyInput.value, 10);
      if (Number.isNaN(value) || value < 1) qtyInput.value = "1";
    };

    if (qtyInput) {
      qtyInput.addEventListener("change", normalizeQty);
      qtyInput.addEventListener("blur", normalizeQty);
    }

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        const current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = String(Math.max(1, current - 1));
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        const current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = String(current + 1);
      });
    }
  }

  // Prevent dead "#" links and add friendly feedback
  qsa('a[href="#"], .wish-btn, .icon-btn, .btn').forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute && el.getAttribute("href");
      const isDeadLink = href === "#";

      if (isDeadLink) {
        e.preventDefault();
      }

      if (el.classList.contains("wish-btn")) {
        e.preventDefault();
        const isActive = el.classList.toggle("is-active");
        el.textContent = isActive ? "♥" : "♡";
        showToast(isActive ? "Added to wishlist" : "Removed from wishlist");
      }

      if (el.classList.contains("add-to-cart")) {
        e.preventDefault();
        const qtyInput = qs(".qty-selector input");
        const qty = qtyInput ? qtyInput.value : "1";
        showToast(`Added ${qty} item${qty === "1" ? "" : "s"} to cart`);
      }

      if (el.textContent && el.classList.contains("btn-secondary") && el.closest(".secondary-actions")) {
        if (el.textContent.toLowerCase().includes("wishlist")) {
          e.preventDefault();
          showToast("Saved to wishlist");
        }
      }

      if (el.classList.contains("icon-btn")) {
        const label = el.getAttribute("aria-label") || "Action";
        if (label) showToast(label);
      }
    });
  });

  // Simple mobile nav close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });

  // Keep card buttons from looking dead when they are plain buttons
  qsa("button").forEach((btn) => {
    if (!btn.type) btn.type = "button";
  });

  // Auto reset dynamic product data when leaving the product page is not necessary,
  // but keeping the current selection helps if the user returns from the shop.
});
