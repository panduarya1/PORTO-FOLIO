/* =========================================================
   PORTFOLIO — script.js
   1) Navbar (scroll state, mobile toggle, active link)
   2) Scroll progress bar & back-to-top
   3) Scroll reveal animations
   4) Typewriter effect (hero role)
   5) Skill bar animation
   6) Contact form validation (frontend only, no backend)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  const setNavScrolled = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  setNavScrolled();
  window.addEventListener('scroll', setNavScrolled, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after clicking a link
  navLinkItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight active nav link based on section in view
  const sections = document.querySelectorAll('main section[id]');
  const highlightNav = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.toggle('active-link', link.dataset.section === currentId);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- 2. SCROLL PROGRESS & BACK TO TOP ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
    backToTop.classList.toggle('visible', scrollTop > 500);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 3. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 4. TYPEWRITER EFFECT ---------- */
  const typewriterEl = document.getElementById('typewriter');
  const roles = [
    'Siswa SMA Negeri 1 Temon',
    'Calon Web Developer',
    'UI/UX Enthusiast',
    'Belajar React & JavaScript'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeLoop() {
    if (!typewriterEl) return;

    if (prefersReducedMotion) {
      typewriterEl.textContent = roles[0];
      return;
    }

    const currentRole = roles[roleIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex <= currentRole.length) {
      typewriterEl.textContent = currentRole.slice(0, charIndex);
      charIndex++;
      if (charIndex > currentRole.length) {
        isDeleting = true;
        speed = 1800; // pause before deleting
      }
    } else if (isDeleting && charIndex >= 0) {
      typewriterEl.textContent = currentRole.slice(0, charIndex);
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 300;
      }
    }
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  /* ---------- 5. SKILL BAR ANIMATION ---------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const percent = bar.dataset.percent || 0;
          bar.style.width = percent + '%';
          skillObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ---------- 6. CONTACT FORM (frontend only — belum terhubung ke backend) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  const validators = {
    name: (v) => v.trim().length >= 3 || 'Nama minimal 3 karakter.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Masukkan alamat email yang valid.',
    subject: (v) => v.trim().length >= 3 || 'Subject minimal 3 karakter.',
    message: (v) => v.trim().length >= 10 || 'Pesan minimal 10 karakter.'
  };

  function showFieldError(field, message) {
    const group = field.closest('.form-group');
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (message) {
      group.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
    } else {
      group.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  if (form) {
    ['name', 'email', 'subject', 'message'].forEach((fieldName) => {
      const field = form.elements[fieldName];
      field.addEventListener('blur', () => {
        const result = validators[fieldName](field.value);
        showFieldError(field, result === true ? '' : result);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      ['name', 'email', 'subject', 'message'].forEach((fieldName) => {
        const field = form.elements[fieldName];
        const result = validators[fieldName](field.value);
        if (result !== true) {
          isValid = false;
          showFieldError(field, result);
        } else {
          showFieldError(field, '');
        }
      });

      if (!isValid) {
        formNote.textContent = 'Periksa kembali isian form kamu.';
        formNote.style.color = '#F87171';
        return;
      }

      // NOTE: Website ini belum terhubung ke backend/email service.
      // Untuk mengaktifkan pengiriman email sungguhan, hubungkan form ini
      // ke layanan seperti EmailJS, Formspree, atau backend milikmu sendiri.
      const submitBtn = form.querySelector('.form-submit');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Mengirim...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        formNote.style.color = 'var(--accent)';
        formNote.textContent = 'Pesan berhasil disiapkan! (Hubungkan form ke EmailJS/Formspree agar benar-benar terkirim.)';
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        form.reset();
      }, 900);
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
