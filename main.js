/* ===================================================================
   ATM EXPRESS — Interactions & animations
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 350);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('is-hidden'), 1800);

  /* ---------- HEADER ON SCROLL ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  } else {
    counters.forEach(el => {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqQuestions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* ---------- CONTACT FORM (front-end demo) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // NOTE: pas de back-end branché — à connecter à un service d'envoi
      // (ex: Formspree, EmailJS, ou une route serveur) avant mise en prod.
      formSuccess.classList.add('is-visible');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('is-visible'), 6000);
    });
  }

  /* ---------- HERO : TYPING ANIMÉ ---------- */
  const line1El = document.getElementById('heroLine1');
  const line2El = document.getElementById('heroLine2');
  const caret = document.getElementById('heroCaret');
  const heroAnims = document.querySelectorAll('.hero-anim');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const txt1 = 'Votre colis,';
  const txt2 = 'notre vitesse.';

  function revealHeroAnims() {
    heroAnims.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-shown'), i * 130);
    });
  }

  if (line1El && line2El) {
    if (reduceMotion) {
      line1El.textContent = txt1;
      line2El.textContent = txt2;
      if (caret) caret.classList.add('is-done');
      revealHeroAnims();
    } else {
      let i = 0, j = 0;
      const typeLine1 = () => {
        if (i <= txt1.length) {
          line1El.textContent = txt1.slice(0, i++);
          setTimeout(typeLine1, 45);
        } else {
          setTimeout(typeLine2, 140);
        }
      };
      const typeLine2 = () => {
        if (j <= txt2.length) {
          line2El.textContent = txt2.slice(0, j++);
          setTimeout(typeLine2, 45);
        } else {
          if (caret) setTimeout(() => caret.classList.add('is-done'), 600);
          revealHeroAnims();
        }
      };
      setTimeout(typeLine1, 500);
    }
  }

  /* ---------- HERO : POINT DE TRACKING ANIMÉ ---------- */
  const trackDot = document.getElementById('trackDot');
  if (trackDot && !reduceMotion) {
    let pos = -14;
    const moveDot = () => {
      pos += 1.4;
      if (pos > window.innerWidth + 14) pos = -14;
      trackDot.style.left = pos + 'px';
      requestAnimationFrame(moveDot);
    };
    moveDot();
  }

  /* ---------- SUIVI DE COLIS (démo) ---------- */
  const trackForm = document.getElementById('trackForm');
  const trackInput = document.getElementById('trackInput');
  const trackResult = document.getElementById('trackResult');

  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = trackInput.value.trim();
      if (!val) {
        trackResult.textContent = 'Veuillez saisir un numéro de suivi.';
        trackResult.classList.add('is-shown');
        return;
      }
      // Démo : pas de vrai système de tracking branché.
      trackResult.innerHTML = '📦 Colis <strong>' + val.replace(/[<>]/g, '') +
        '</strong> : en cours d\'acheminement. Pour le statut détaillé en temps réel, ' +
        'contactez-nous au +33 6 33 46 57 29.';
      trackResult.classList.remove('is-shown');
      void trackResult.offsetWidth;
      trackResult.classList.add('is-shown');
    });
  }

  /* ---------- CARTE FRANCE : dessin au scroll ---------- */
  const coverageMap = document.querySelector('.coverage-map');
  if (coverageMap && 'IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          mapObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    mapObserver.observe(coverageMap);
  } else if (coverageMap) {
    coverageMap.classList.add('is-visible');
  }

  /* ---------- BANDEAU COOKIES ---------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieRefuse = document.getElementById('cookieRefuse');

  // NOTE: pas de localStorage dans cet environnement de prévisualisation.
  // Le choix est mémorisé le temps de la session via une variable.
  if (cookieBanner) {
    setTimeout(() => cookieBanner.classList.add('is-visible'), 1500);
    const closeCookie = () => cookieBanner.classList.remove('is-visible');
    if (cookieAccept) cookieAccept.addEventListener('click', closeCookie);
    if (cookieRefuse) cookieRefuse.addEventListener('click', closeCookie);
  }

});
