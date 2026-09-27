/**
 * LumaLoop Cyber-Minimal Experience Script
 * Performance-focused, zero-dependency interactions
 */

(function () {
  'use strict';

  function initHeaderScroll() {
    const headerWrapper = document.querySelector('.header-wrapper');
    if (!headerWrapper) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        headerWrapper.classList.add('scrolled');
      } else {
        headerWrapper.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.lumaloop-reveal');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  function initStickyAddToCart() {
    const stickyBar = document.querySelector('.lumaloop-sticky-bar');
    const mainBuyBtn = document.querySelector('.product-form__buttons');
    if (!stickyBar || !mainBuyBtn) return;

    if (!('IntersectionObserver' in window)) {
      stickyBar.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When main buy button is NOT intersecting and is above the viewport
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }, {
      threshold: 0
    });

    observer.observe(mainBuyBtn);

    // Sync sticky button click with main form submit
    const stickyBtn = stickyBar.querySelector('.lumaloop-sticky-submit');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const mainSubmitBtn = mainBuyBtn.querySelector('[type="submit"]');
        if (mainSubmitBtn) {
          mainSubmitBtn.click();
        }
      });
    }
  }

  function initInteractiveCardGlow() {
    // Subtle cyber mouse glow on cards
    const cards = document.querySelectorAll('.lumaloop-glass-card, .card-wrapper');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // Initialize on DOMContentLoaded and Shopify section loads
  function initAll() {
    initHeaderScroll();
    initScrollReveals();
    initStickyAddToCart();
    initInteractiveCardGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Support Shopify Theme Editor live updates
  document.addEventListener('shopify:section:load', initAll);
  document.addEventListener('shopify:section:select', initAll);
})();
