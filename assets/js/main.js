/**
 * FoundationGuard - Main Interactive JavaScript Module
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  /* ------------------------------------------------------------------------
   * 1. Dark / Light Theme Switcher
   * ------------------------------------------------------------------------ */
  const themeToggleBtns = document.querySelectorAll('.fg-theme-btn');
  const htmlElement = document.documentElement;

  // Initialize theme
  function initTheme() {
    const savedTheme = localStorage.getItem('fg-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('fg-theme', theme);

    // Update icons
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  initTheme();

  /* ------------------------------------------------------------------------
   * 1b. RTL Direction Switcher
   * ------------------------------------------------------------------------ */
  const rtlToggleBtns = document.querySelectorAll('.fg-rtl-btn');

  function initDirection() {
    const savedDir = localStorage.getItem('fg-direction') || 'ltr';
    setDirection(savedDir);
  }

  function setDirection(dir) {
    htmlElement.setAttribute('dir', dir);
    localStorage.setItem('fg-direction', dir);

    rtlToggleBtns.forEach(btn => {
      if (dir === 'rtl') {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Switch to LTR Layout');
        btn.textContent = 'LTR';
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Switch to RTL Layout');
        btn.textContent = 'RTL';
      }
    });
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = htmlElement.getAttribute('dir') || 'ltr';
      setDirection(currentDir === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  initDirection();

  /* ------------------------------------------------------------------------
   * 1c. Mobile Drawer Links Page Navigation Fix
   * ------------------------------------------------------------------------ */
  document.querySelectorAll('.mobile-nav-links a[href], .fg-offcanvas a.fg-logo-brand[href]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetUrl = this.getAttribute('href');
      if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('#')) {
        const offcanvasEl = document.getElementById('fgMobileNav');
        if (offcanvasEl && typeof bootstrap !== 'undefined') {
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
          if (bsOffcanvas) {
            bsOffcanvas.hide();
          }
        }
        
        // Navigate cleanly to target page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (targetUrl === currentPage || (currentPage === '' && targetUrl === 'index.html')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
   * 2. Back To Top Button & Sticky Header Scroll
   * ------------------------------------------------------------------------ */
  const backToTopBtn = document.getElementById('fgBackToTop');
  const headerMain = document.querySelector('.fg-header-main');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      if (backToTopBtn) backToTopBtn.classList.add('active');
      if (headerMain) headerMain.classList.add('shadow-md');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('active');
      if (headerMain) headerMain.classList.remove('shadow-md');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
   * 3. Interactive Before & After Image Comparison Sliders
   * ------------------------------------------------------------------------ */
  function initBeforeAfterSliders() {
    const containers = document.querySelectorAll('.fg-ba-container');

    containers.forEach(container => {
      const afterImg = container.querySelector('.fg-ba-after');
      const slider = container.querySelector('.fg-ba-slider');

      if (!afterImg || !slider) return;

      let isDragging = false;

      function setPosition(x) {
        const rect = container.getBoundingClientRect();
        let position = x - rect.left;
        let percentage = (position / rect.width) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        afterImg.style.width = `${percentage}%`;
        slider.style.left = `${percentage}%`;
      }

      // Mouse events
      slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setPosition(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch events
      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
      });

      container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        setPosition(e.touches[0].clientX);
      });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });
    });
  }

  initBeforeAfterSliders();

  /* ------------------------------------------------------------------------
   * 4. Form Validation & Free Inspection Request Submission
   * ------------------------------------------------------------------------ */
  const inspectionForms = document.querySelectorAll('.fg-inspection-form');

  inspectionForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      // Hide active modal if inside one
      const modalEl = form.closest('.modal');
      if (modalEl && typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }

      // Show Success Toast or Alert
      showSuccessAlert(form);
      form.reset();
      form.classList.remove('was-validated');
    });
  });

  function showSuccessAlert(form) {
    let alertBox = document.getElementById('fgSuccessToast');
    if (!alertBox) {
      alertBox = document.createElement('div');
      alertBox.id = 'fgSuccessToast';
      alertBox.className = 'position-fixed bottom-0 end-0 p-3';
      alertBox.style.zIndex = '1100';
      alertBox.innerHTML = `
        <div class="toast align-items-center text-white bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body fs-6 py-3 px-4">
              <i class="bi bi-check-circle-fill me-2 fs-5"></i>
              <strong>Thank you!</strong> Your inspection request has been received. A structural specialist will contact you shortly.
            </div>
            <button type="button" class="btn-close btn-close-white me-3 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      `;
      document.body.appendChild(alertBox);
    } else {
      alertBox.style.display = 'block';
    }

    setTimeout(() => {
      if (alertBox) alertBox.style.display = 'none';
    }, 6000);
  }

  /* ------------------------------------------------------------------------
   * 5. Interactive Category Filtering (Services, Gallery & Reviews)
   * ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.fg-filter-btn');
  const filterableItems = document.querySelectorAll('.fg-filter-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const targetFilter = this.getAttribute('data-filter');

      filterableItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (targetFilter === 'all' || category === targetFilter) {
          item.style.display = '';
          item.style.animation = 'fgFadeDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
   * 6. Home 2 Foundation Risk Self-Assessment Tool
   * ------------------------------------------------------------------------ */
  const assessmentCheckboxes = document.querySelectorAll('.fg-assessment-checkbox');
  const riskOutput = document.getElementById('fgRiskLevel');
  const riskProgress = document.getElementById('fgRiskProgress');

  if (assessmentCheckboxes.length > 0 && riskOutput) {
    function calculateRisk() {
      let count = 0;
      assessmentCheckboxes.forEach(cb => {
        if (cb.checked) count++;
      });

      let level = 'Low Risk';
      let percentage = 15;
      let badgeClass = 'bg-success';

      if (count === 1) {
        level = 'Mild Moisture / Minor Crack Risk';
        percentage = 35;
        badgeClass = 'bg-info text-dark';
      } else if (count === 2) {
        level = 'Moderate Structural Concerns';
        percentage = 65;
        badgeClass = 'bg-warning text-dark';
      } else if (count >= 3) {
        level = 'High Foundation Water Intrusion Risk';
        percentage = 95;
        badgeClass = 'bg-danger text-white';
      }

      riskOutput.className = `badge ${badgeClass} fs-6 px-3 py-2`;
      riskOutput.textContent = level;
      if (riskProgress) {
        riskProgress.style.width = `${percentage}%`;
        riskProgress.className = `progress-bar ${badgeClass}`;
      }
    }

    assessmentCheckboxes.forEach(cb => {
      cb.addEventListener('change', calculateRisk);
    });
  }

  /* ------------------------------------------------------------------------
   * 7. Coming Soon Countdown Timer
   * ------------------------------------------------------------------------ */
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    const targetDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000); // 45 days ahead

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
  }

  /* ------------------------------------------------------------------------
   * 8. GSAP ScrollReveal Animations (Graceful Fallback)
   * ------------------------------------------------------------------------ */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.utils.toArray('.fg-reveal').forEach(el => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 9. Mobile Navbar ESC key support & Offcanvas control
   * ------------------------------------------------------------------------ */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeOffcanvas = document.querySelector('.offcanvas.show');
      if (activeOffcanvas && typeof bootstrap !== 'undefined') {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(activeOffcanvas);
        if (offcanvasInstance) offcanvasInstance.hide();
      }
    }
  });

});
