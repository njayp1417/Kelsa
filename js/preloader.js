/**
 * Preloader for Kelsa Events
 * Improves perceived performance by showing a loading animation
 */

// Create preloader element
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
  <div class="preloader-content">
    <div class="preloader-spinner"></div>
    <div class="preloader-text">Loading Kelsa Events...</div>
  </div>
`;

// Add preloader to body
document.body.appendChild(preloader);

// Hide preloader when page is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('preloader-hidden');
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }, 500);
});