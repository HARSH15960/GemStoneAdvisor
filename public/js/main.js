document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Auto-dismiss Alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.6s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 600);
    }, 5000);
  });

  // AJAX Favorite Button Interaction
  const favoriteForms = document.querySelectorAll('.favorite-toggle-form');
  favoriteForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const actionUrl = form.getAttribute('action');
      const gemstoneIdInput = form.querySelector('input[name="gemstoneId"]');
      const submitBtn = form.querySelector('.btn-fav-toggle');
      
      if (!actionUrl || !gemstoneIdInput || !submitBtn) return;

      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ gemstoneId: gemstoneIdInput.value })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Update button styles/text dynamically
            if (data.favorited) {
              submitBtn.classList.remove('btn-secondary');
              submitBtn.classList.add('btn-gold');
              submitBtn.innerHTML = '★ Favorited';
            } else {
              submitBtn.classList.remove('btn-gold');
              submitBtn.classList.add('btn-secondary');
              submitBtn.innerHTML = '☆ Add to Favorites';
            }
          }
        } else {
          // If response not ok (e.g. session expired), perform traditional form submission
          form.submit();
        }
      } catch (err) {
        console.error('AJAX favoriting failed, fallback to direct submission.', err);
        form.submit();
      }
    });
  });

  // Client-side quick filter for tables
  const searchBar = document.getElementById('table-search');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const tableRows = document.querySelectorAll('.custom-table tbody tr');

      tableRows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        if (textContent.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Theme Switcher (Light / Dark Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      body.classList.add('light-theme');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-moon'; // Moon icon to switch back to dark
      }
    } else {
      body.classList.remove('light-theme');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun'; // Sun icon to switch to light
      }
    }

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLight = body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      
      if (themeIcon) {
        themeIcon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    });
  }

  // Password Visibility Toggle
  const passwordToggles = document.querySelectorAll('.password-toggle-icon');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const container = toggle.closest('.password-container');
      if (!container) return;
      const input = container.querySelector('input');
      const icon = toggle.querySelector('i') || toggle;

      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });

  // Animated counters on Homepage
  const counters = document.querySelectorAll('.counter-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target')) || 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function outQuad
      const value = Math.floor(progress * target);
      
      // Format display
      if (target >= 5000) {
        counter.textContent = value.toLocaleString() + '+';
      } else if (target === 95) {
        counter.textContent = value + '%';
      } else {
        counter.textContent = value + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Guarantee final numbers match format
        if (target >= 5000) counter.textContent = target.toLocaleString() + '+';
        else if (target === 95) counter.textContent = target + '%';
        else counter.textContent = target + '+';
      }
    };

    requestAnimationFrame(animate);
  });

  // Client-side Category Filter for History table
  const filterButtons = document.querySelectorAll('.filter-pill-btn');
  const historyRows = document.querySelectorAll('.custom-table tbody tr');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active state to clicked
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      historyRows.forEach(row => {
        // Find the category badge within the row
        const categoryBadge = row.querySelector('.badge-primary');
        if (!categoryBadge) return;

        const rowCategory = categoryBadge.textContent.trim();

        if (filterValue === 'All' || rowCategory === filterValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Cosmic recommendation step-loader overlay
  const recommendForm = document.getElementById('recommend-form');
  const loaderOverlay = document.getElementById('astro-loader');

  if (recommendForm && loaderOverlay) {
    recommendForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show overlay
      loaderOverlay.classList.add('active');

      const loaderText = loaderOverlay.querySelector('.astro-loader-text');
      const steps = loaderOverlay.querySelectorAll('.astro-loader-step');

      const stepMessages = [
        "Analyzing Birth Profile...",
        "Calculating Planetary Influence...",
        "Finding Compatible Gemstone...",
        "Preparing Cosmic Report..."
      ];

      let currentStep = 0;

      const runSteps = () => {
        if (currentStep < stepMessages.length) {
          // Update text
          loaderText.textContent = stepMessages[currentStep];

          // Mark active/completed steps
          steps.forEach((step, idx) => {
            if (idx === currentStep) {
              step.classList.add('active');
              step.classList.remove('completed');
              const icon = step.querySelector('i');
              if (icon) icon.className = 'fa-solid fa-spinner fa-spin';
            } else if (idx < currentStep) {
              step.classList.remove('active');
              step.classList.add('completed');
              const icon = step.querySelector('i');
              if (icon) icon.className = 'fa-solid fa-circle-check';
            } else {
              step.classList.remove('active', 'completed');
              const icon = step.querySelector('i');
              if (icon) icon.className = 'fa-regular fa-circle';
            }
          });

          currentStep++;
          setTimeout(runSteps, 1000); // 1s per step
        } else {
          // Trigger final submission
          recommendForm.submit();
        }
      };

      runSteps();
    });
  }
});

