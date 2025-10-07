/**
 * Advanced Image Optimization for Kelsa Events
 * Handles responsive images, lazy loading, and format detection
 */

class ImageOptimizer {
  constructor() {
    this.supportsWebP = false;
    this.supportsAVIF = false;
    this.checkImageFormats();
    this.initLazyLoading();
    this.setupResponsiveImages();
  }

  // Check which modern image formats are supported
  async checkImageFormats() {
    // Check WebP support
    this.supportsWebP = await this.testFormat('webp');
    
    // Check AVIF support
    this.supportsAVIF = await this.testFormat('avif');
    
    // Add class to body for CSS usage
    if (this.supportsWebP) document.body.classList.add('webp');
    if (this.supportsAVIF) document.body.classList.add('avif');
  }

  // Test if a specific format is supported
  testFormat(format) {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = function() {
        resolve(image.width === 1);
      };
      image.onerror = function() {
        resolve(false);
      };
      image.src = `data:image/${format};base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`;
    });
  }

  // Initialize enhanced lazy loading
  initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading
      document.querySelectorAll('img:not([loading]):not([fetchpriority="high"])').forEach(img => {
        this.prepareImage(img);
        img.loading = 'lazy';
      });
    } else {
      // Fallback with Intersection Observer
      const config = {
        rootMargin: '200px 0px',
        threshold: 0.01
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, config);
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    }
    
    // Add loading="eager" to above-the-fold images
    document.querySelectorAll('.hero img:not([loading])').forEach(img => {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    });
  }

  // Prepare image with best format and responsive attributes
  prepareImage(img) {
    // Set source based on supported formats
    if (this.supportsAVIF && img.dataset.avif) {
      img.src = img.dataset.avif;
    } else if (this.supportsWebP && img.dataset.webp) {
      img.src = img.dataset.webp;
    } else if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    
    // Handle srcset if available
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    
    // Handle sizes if available
    if (img.dataset.sizes) {
      img.sizes = img.dataset.sizes;
    }
  }

  // Load image when it comes into view
  loadImage(img) {
    this.prepareImage(img);
    
    // Remove placeholder and show image
    img.classList.add('loaded');
    img.classList.remove('loading');
    
    // Dispatch event when loaded
    img.addEventListener('load', () => {
      img.dispatchEvent(new CustomEvent('imageLoaded'));
    });
  }

  // Setup responsive images with appropriate srcset and sizes
  setupResponsiveImages() {
    document.querySelectorAll('img:not([srcset])').forEach(img => {
      const src = img.src;
      if (!src) return;
      
      // Skip images that already have srcset
      if (img.srcset) return;
      
      // Skip SVGs and other non-standard images
      if (src.endsWith('.svg') || src.startsWith('data:')) return;
      
      // Add loading="lazy" if not already set
      if (!img.loading && !img.closest('.hero')) {
        img.loading = 'lazy';
      }
      
      // Add sizes attribute if not already set
      if (!img.sizes) {
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      }
      
      // Add fade-in animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    });
  }
  
  // Add blur-up effect for images
  addBlurUpEffect() {
    document.querySelectorAll('.blur-up').forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';
      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.style.background = '#f0f0f0';
      
      const placeholder = document.createElement('img');
      placeholder.src = img.dataset.placeholder || img.src;
      placeholder.className = 'placeholder';
      placeholder.style.position = 'absolute';
      placeholder.style.top = '0';
      placeholder.style.left = '0';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.filter = 'blur(10px)';
      placeholder.style.transform = 'scale(1.1)';
      placeholder.style.transition = 'opacity 0.3s ease';
      
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(placeholder);
      wrapper.appendChild(img);
      
      img.addEventListener('load', () => {
        placeholder.style.opacity = '0';
        setTimeout(() => {
          placeholder.remove();
        }, 300);
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.imageOptimizer = new ImageOptimizer();
});