/*
  Hooked Soul - Interaction Logic (app.js)
  Handles navigation toggles, header scroll effects, product order simulator, copy‑to‑clipboard,
  testimonial slider, and smooth scrolling.
*/

/* --- Utility Functions --- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* --- Header Scroll Effect --- */
const header = $('#main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* --- Mobile Hamburger Menu --- */
const hamburger = $('#nav-hamburger-menu');
const navMenu = $('#nav-menu-list');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  // Close menu on link click (mobile)
  $$('ul.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });
}

/* --- Smooth Anchor Scrolling --- */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* --- Order Simulator Logic --- */
const simForm = $('#sim-form');
const receiptList = $('#sim-receipt-list-items');
const totalItem = receiptList.querySelector('.total span:last-child');
const orderPrompt = $('#order-prompt-text-content');

// Helpers to retrieve selected values
function getSelectedBase() {
  const baseRad = document.querySelector('input[name="sim-base"]:checked');
  return {
    name: baseRad ? baseRad.value : '',
    price: baseRad ? parseInt(baseRad.dataset.price) : 0,
  };
}
function getSelectedColor() {
  const colorRad = document.querySelector('input[name="sim-color"]:checked');
  return colorRad ? colorRad.value : '';
}
function getSelectedExtras() {
  return $$('input[name="sim-extra"]:checked').map(cb => ({
    name: cb.value,
    price: parseInt(cb.dataset.price),
  }));
}

function updateReceipt() {
  const base = getSelectedBase();
  const color = getSelectedColor();
  const extras = getSelectedExtras();

  // Build receipt items HTML
  const items = [];
  items.push(`<li class="sim-receipt-item"><span>Base Product: ${base.name}</span><span>₹${base.price}</span></li>`);
  items.push(`<li class="sim-receipt-item"><span>Color: ${color}</span><span>₹0</span></li>`);
  extras.forEach(e => {
    items.push(`<li class="sim-receipt-item"><span>${e.name}</span><span>+₹${e.price}</span></li>`);
  });

  const total = base.price + extras.reduce((sum, e) => sum + e.price, 0);
  items.push(`<li class="sim-receipt-item total"><span>Estimated Total:</span><span>₹${total}</span></li>`);

  receiptList.innerHTML = items.join('\n');

  // Generate order prompt text (copy‑ready)
  let prompt = `Hi Hooked Soul!\nI would like to order a ${base.name}`;
  if (extras.length) {
    const extraNames = extras.map(e => e.name).join(', ');
    prompt += ` with ${extraNames}`;
  }
  prompt += `, color: ${color}.\nEstimated total: ₹${total}.\nPlease let me know the next steps!`;
  orderPrompt.textContent = prompt;
}

// Attach change listeners to all inputs
if (simForm) {
  $$('input[name="sim-base"], input[name="sim-color"], input[name="sim-extra"]').forEach(inp => {
    inp.addEventListener('change', updateReceipt);
  });
  // Initial render
  updateReceipt();
}

/* --- Copy to Clipboard --- */
const copyBtn = $('#btn-copy-prompt');
const copyToast = $('#copy-toast-msg');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const text = orderPrompt.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyToast.classList.add('show');
      setTimeout(() => copyToast.classList.remove('show'), 2000);
    }).catch(() => {
      alert('Copy failed. Please select the text manually and copy.');
    });
  });
}

/* --- Testimonial Slider --- */
const sliderTrack = $('#testimonials-slider-track');
let currentSlide = 0;
const slides = $$('#testimonials-slider-track .testimonial-slide');
function showSlide(index) {
  const total = slides.length;
  currentSlide = (index + total) % total;
  const offset = -currentSlide * 100;
  sliderTrack.style.transform = `translateX(${offset}%)`;
}
$('#btn-testimonial-prev')?.addEventListener('click', () => showSlide(currentSlide - 1));
$('#btn-testimonial-next')?.addEventListener('click', () => showSlide(currentSlide + 1));
// Auto‑rotate every 7 seconds
setInterval(() => showSlide(currentSlide + 1), 7000);

/* --- Initial Load Adjustments --- */
// Ensure the first testimonial is visible
showSlide(0);

/* --- End of app.js --- */
