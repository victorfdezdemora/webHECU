/* =========================================
   HECU Agrifood TM — main.js
   Vanilla JS, sin dependencias externas
   ========================================= */

/* --- AOS (Animate on Scroll) --- */
AOS.init({
  once: true,
  duration: 700,
  easing: 'ease-out-cubic',
  offset: 60,
});

/* --- Menú hamburguesa --- */
const navHamburger = document.getElementById('navHamburger');
const nav          = document.querySelector('.nav');

navHamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav-open');
  navHamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Cerrar menú al pulsar un enlace */
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav-open');
    document.body.style.overflow = '';
  });
});

/* Cerrar menú al pulsar fuera del panel */
document.addEventListener('click', (e) => {
  if (
    nav.classList.contains('nav-open') &&
    !e.target.closest('.nav__menu') &&
    !e.target.closest('.nav__hamburger')
  ) {
    nav.classList.remove('nav-open');
    document.body.style.overflow = '';
  }
});

/* --- Header: clase .scrolled al pasar 50px --- */
const header = document.getElementById('header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* --- Smooth scroll en anclas internas --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 72; /* altura del header fijo */
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* --- Accordion: tarjetas de servicios --- */
document.querySelectorAll('.btn--ver-mas').forEach(btn => {
  btn.addEventListener('click', () => {
    const card       = btn.closest('.servicio-card');
    const isExpanded = card.classList.contains('expanded');

    /* Colapsar todas las tarjetas */
    document.querySelectorAll('.servicio-card').forEach(c => {
      c.classList.remove('expanded');
      const b = c.querySelector('.btn--ver-mas');
      if (b) {
        b.innerHTML = 'Ver más <i class="fa-solid fa-chevron-down"></i>';
        b.classList.remove('active');
        b.setAttribute('aria-expanded', 'false');
      }
    });

    /* Si estaba cerrada, expandir */
    if (!isExpanded) {
      card.classList.add('expanded');
      btn.innerHTML = 'Ver menos <i class="fa-solid fa-chevron-down"></i>';
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* --- Formulario de contacto (Formspree, sin recarga) --- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn      = contactForm.querySelector('.btn--submit');
    const originalText   = submitBtn.textContent;
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const response = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        contactForm.reset();
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const data = await response.json().catch(() => ({}));
        const msg  = data?.errors?.map(err => err.message).join(', ')
          || 'Error al enviar el formulario. Inténtalo de nuevo.';
        alert(msg);
        submitBtn.disabled   = false;
        submitBtn.textContent = originalText;
      }
    } catch {
      alert('Error de conexión. Comprueba tu red e inténtalo de nuevo.');
      submitBtn.disabled   = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* --- Resaltar enlace de nav activo según sección visible --- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
