/**
 * Main JavaScript
 * Mobile menu, scroll effects, reveal animations,
 * active navigation, contact form validation
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const contactForm = document.getElementById('contactForm');

  /* ------------------------------------------
     Header scroll behavior
     ------------------------------------------ */
  function initHeader() {
    if (!header) return;

    const hero = document.querySelector('.hero');
    const isHomePage = !!hero;

    if (isHomePage) {
      header.classList.add('header--dark');
    }

    function onScroll() {
      const scrolled = window.scrollY > 50;
      header.classList.toggle('header--scrolled', scrolled);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------
     Mobile hamburger menu
     ------------------------------------------ */
  function initMobileMenu() {
    if (!hamburger || !nav) return;

    function toggleMenu() {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------
     Active navigation highlighting
     ------------------------------------------ */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.split('#')[0].split('/').pop() || 'index.html';
      const isHashOnly = href.startsWith('#');
      const isCurrentPage = linkPage === currentPage || (currentPage === '' && linkPage === 'index.html');

      if (!isHashOnly && isCurrentPage && !href.includes('#')) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });

    if (currentPage === 'index.html' || currentPage === '') {
      const sections = document.querySelectorAll('section[id]');

      function highlightOnScroll() {
        let current = '';
        sections.forEach(function (section) {
          const sectionTop = section.offsetTop - 120;
          if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(function (link) {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === '#' + current || href === 'index.html#' + current) {
            link.classList.add('active');
          }
        });
      }

      window.addEventListener('scroll', highlightOnScroll, { passive: true });
    }
  }

  /* ------------------------------------------
     Scroll reveal animations (Intersection Observer)
     ------------------------------------------ */
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------
     Skill bar animations (resume page)
     ------------------------------------------ */
  function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-bar__fill');
    if (!skillFills.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const percent = fill.getAttribute('data-percent');
            fill.style.setProperty('--fill-width', percent + '%');
            fill.classList.add('animated');
            observer.unobserve(fill);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillFills.forEach(function (fill) {
      observer.observe(fill);
    });
  }

  /* ------------------------------------------
     Contact form validation
     ------------------------------------------ */
  function initContactForm() {
    if (!contactForm) return;

    const fields = {
      name: {
        input: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: function (value) {
          if (!value.trim()) return 'Name is required';
          if (value.trim().length < 2) return 'Name must be at least 2 characters';
          return '';
        }
      },
      email: {
        input: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: function (value) {
          if (!value.trim()) return 'Email is required';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
          return '';
        }
      },
      subject: {
        input: document.getElementById('subject'),
        error: document.getElementById('subjectError'),
        validate: function (value) {
          if (!value.trim()) return 'Subject is required';
          return '';
        }
      },
      message: {
        input: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: function (value) {
          if (!value.trim()) return 'Message is required';
          if (value.trim().length < 10) return 'Message must be at least 10 characters';
          return '';
        }
      }
    };

    const formSuccess = document.getElementById('formSuccess');

    function showError(field, message) {
      field.input.classList.toggle('error', !!message);
      field.error.textContent = message;
    }

    function validateField(key) {
      const field = fields[key];
      const message = field.validate(field.input.value);
      showError(field, message);
      return !message;
    }

    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      field.input.addEventListener('blur', function () {
        validateField(key);
      });
      field.input.addEventListener('input', function () {
        if (field.input.classList.contains('error')) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) isValid = false;
      });

      if (!isValid) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      setTimeout(function () {
        contactForm.reset();
        formSuccess.classList.add('visible');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        setTimeout(function () {
          formSuccess.classList.remove('visible');
        }, 5000);
      }, 1200);
    });
  }

  /* ------------------------------------------
     Smooth scroll for anchor links
     ------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ------------------------------------------
     Initialize all modules
     ------------------------------------------ */
  function init() {
    initHeader();
    initMobileMenu();
    initActiveNav();
    initRevealAnimations();
    initSkillBars();
    initContactForm();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
