/**
 * Scroll Animations Module
 * Handles reveal-on-scroll animations using Intersection Observer API
 */

const ScrollAnimations = {
  /**
   * Initialize scroll animations
   */
  init() {
    this.setupIntersectionObserver();
    this.observeElements();
  },

  /**
   * Setup Intersection Observer with optimized settings
   */
  setupIntersectionObserver() {
    const options = {
      root: null, // viewport
      rootMargin: '0px 0px -100px 0px', // trigger 100px before element enters viewport
      threshold: 0.15 // trigger when 15% of element is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add active class to trigger animation
          entry.target.classList.add('active');

          // Optional: stop observing after animation (performance optimization)
          // Uncomment if you want one-time animations only
          // this.observer.unobserve(entry.target);
        } else {
          // Optional: remove active class when element leaves viewport
          // Uncomment if you want repeating animations
          // entry.target.classList.remove('active');
        }
      });
    }, options);
  },

  /**
   * Observe all elements with reveal classes
   */
  observeElements() {
    // Select all elements with reveal classes
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    // Observe each element
    revealElements.forEach(el => {
      this.observer.observe(el);
    });
  },

  /**
   * Add reveal class to an element
   * @param {HTMLElement} element - Element to add reveal animation to
   * @param {string} direction - Animation direction: 'up', 'left', 'right', 'scale'
   */
  addReveal(element, direction = 'up') {
    if (!element) return;

    const className = direction === 'up' ? 'reveal' : `reveal-${direction}`;
    element.classList.add(className);
    this.observer.observe(element);
  },

  /**
   * Manually trigger animation on an element
   * @param {HTMLElement} element - Element to animate
   */
  triggerAnimation(element) {
    if (!element) return;
    element.classList.add('active');
  },

  /**
   * Remove animation from an element
   * @param {HTMLElement} element - Element to remove animation from
   */
  removeAnimation(element) {
    if (!element) return;
    element.classList.remove('active');
  },

  /**
   * Destroy observer (cleanup)
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ScrollAnimations.init();
  });
} else {
  ScrollAnimations.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollAnimations;
}
