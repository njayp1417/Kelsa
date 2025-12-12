# Chapter 1: GitHub Pages Architecture and Deployment
## Professional Static Site Hosting for Business Websites

---

## 1.1 Repository Structure and Organization

```
Kelsa-main/
├── assets/
│   ├── images/          # Optimized WebP images
│   └── favicon.ico      # Site icon
├── css/
│   ├── styles.css       # Main stylesheet
│   ├── mobile.css       # Mobile-specific styles
│   └── form-styles.css  # Form styling
├── js/
│   ├── main.js          # Core functionality
│   ├── form-handler.js  # Form processing
│   ├── image-optimizer.js # Image optimization
│   └── service-worker.js  # PWA functionality
├── invoice/             # Invoice system
├── index.html           # Homepage
├── rentals.html         # Rental catalog
├── event.html           # Event services
├── contact.html         # Contact page
├── manifest.json        # PWA manifest
├── sitemap.xml          # SEO sitemap
└── CNAME               # Custom domain configuration
```

**ORGANIZATION PRINCIPLES:**

1. **Asset Optimization**: Images stored in WebP format for performance
2. **Modular CSS**: Separate stylesheets for different concerns
3. **Progressive Enhancement**: JavaScript enhances but doesn't break core functionality
4. **SEO Structure**: Proper file naming and sitemap implementation

## 1.2 GitHub Pages Configuration

### 1.2.1 Repository Settings

```yaml
# Repository configuration for GitHub Pages
Repository: njayp1417/Kelsa
Branch: main
Source: / (root)
Custom Domain: kelsaevents.com.ng
Enforce HTTPS: Enabled
```

**DEPLOYMENT WORKFLOW:**

1. **Push to Main**: Changes automatically deploy to production
2. **Build Process**: GitHub Pages serves static files directly
3. **CDN Distribution**: Global content delivery via GitHub's CDN
4. **SSL Certificate**: Automatic Let's Encrypt certificate provisioning

### 1.2.2 Custom Domain Setup

```dns
# DNS Configuration for kelsaevents.com.ng
Type    Name    Value
CNAME   www     njayp1417.github.io
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

**CNAME File Configuration:**
```
kelsaevents.com.ng
```

**DOMAIN VERIFICATION:**
- GitHub Pages automatically verifies domain ownership
- SSL certificate provisioned within 24 hours
- Redirects configured for www and non-www versions

## 1.3 Performance Optimization

### 1.3.1 Image Optimization Strategy

```javascript
// Image optimization implementation
class ImageOptimizer {
    constructor() {
        this.supportedFormats = this.checkWebPSupport();
        this.lazyLoadImages();
    }
    
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadOptimizedImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    loadOptimizedImage(img) {
        if (this.supportedFormats && img.dataset.webp) {
            img.src = img.dataset.webp;
        } else {
            img.src = img.dataset.src || img.src;
        }
        img.classList.remove('loading');
    }
}
```

### 1.3.2 Caching Strategy

```html
<!-- Cache-friendly resource loading -->
<link rel="stylesheet" href="css/styles.css?v=2025.1">
<script src="js/main.js?v=2025.1"></script>

<!-- Preload critical resources -->
<link rel="preload" href="assets/images/kelsaevent1.webp" as="image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
```

**CACHING HEADERS:**
GitHub Pages automatically sets appropriate cache headers:
- **Static Assets**: 1 year cache for CSS/JS with versioning
- **Images**: 1 month cache with ETag validation
- **HTML**: No cache to ensure fresh content

## 1.4 SEO and Analytics Integration

### 1.4.1 Google Analytics 4 Setup

```html
<!-- Google Analytics 4 Implementation -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T5H6Q75N2P"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-T5H6Q75N2P');
</script>
```

### 1.4.2 Structured Data Implementation

```html
<!-- Local Business Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Kelsa Events",
  "alternateName": "Kelsa Rental",
  "description": "Professional event planning and equipment rental services in Abuja, Nigeria",
  "url": "https://kelsaevents.com.ng",
  "telephone": "+234-913-463-6775",
  "email": "kelsarentalsevent@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop B2 Beaufort Court Estate Lugbe",
    "addressLocality": "Abuja",
    "addressRegion": "FCT",
    "addressCountry": "Nigeria"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "9.0579",
    "longitude": "7.4951"
  },
  "areaServed": {
    "@type": "City",
    "name": "Abuja"
  },
  "serviceType": ["Event Planning", "Equipment Rental", "Wedding Planning"],
  "priceRange": "₦₦",
  "openingHours": "Mo-Sa 09:00-17:00"
}
</script>
```

## 1.5 Security and Best Practices

### 1.5.1 Content Security Policy

```html
<!-- Security headers via meta tags -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
">
```

### 1.5.2 Progressive Enhancement

```javascript
// Ensure core functionality works without JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Enhance forms only if JavaScript is available
    if (typeof FormData !== 'undefined') {
        enhanceContactForm();
    }
    
    // Add interactive features progressively
    if ('IntersectionObserver' in window) {
        initializeAnimations();
    }
    
    // Service worker registration
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
});

function enhanceContactForm() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
}
```

## 1.6 Deployment Automation

### 1.6.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Optimize Images
      run: |
        # Convert images to WebP format
        find assets/images -name "*.jpg" -o -name "*.png" | while read img; do
          cwebp "$img" -o "${img%.*}.webp"
        done
    
    - name: Minify CSS and JS
      run: |
        # Minify CSS files
        npx clean-css-cli css/*.css -o css/styles.min.css
        # Minify JavaScript files
        npx terser js/*.js -o js/scripts.min.js
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

### 1.6.2 Performance Monitoring

```javascript
// Core Web Vitals monitoring
function measureWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        gtag('event', 'LCP', {
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals'
        });
    }).observe({entryTypes: ['largest-contentful-paint']});
    
    // First Input Delay
    new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        gtag('event', 'FID', {
            value: Math.round(firstInput.processingStart - firstInput.startTime),
            event_category: 'Web Vitals'
        });
    }).observe({entryTypes: ['first-input']});
    
    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
        gtag('event', 'CLS', {
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals'
        });
    }).observe({entryTypes: ['layout-shift']});
}
```

This chapter demonstrates how to properly configure and deploy a professional static website using GitHub Pages, with focus on performance, security, and business requirements for the Nigerian market.