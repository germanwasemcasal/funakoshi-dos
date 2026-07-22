// main.js - Funakoshi Dojo Interactividad y Animaciones

document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll style toggle
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    });
  }

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  }
  if (closeMenu && mobileMenu) {
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }
  
  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => mobileMenu && mobileMenu.classList.remove('open'));
  });

  document.querySelectorAll('.mob-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.mob-dropdown-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.mob-dropdown-item.open').forEach(openItem => {
        if (openItem !== item) openItem.classList.remove('open');
      });

      if (!isOpen) item.classList.add('open');
      else item.classList.remove('open');
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Counter animation
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const tick = () => {
          cur += step;
          if (cur >= target) { 
            el.textContent = target + (target >= 100 ? '+' : ''); 
            return; 
          }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

  // Gallery filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (f === 'all' || item.dataset.category === f) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Form submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Mensaje enviado';
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        e.target.reset();
      }, 2500);
    });
  }

  // Active nav link on scroll using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + id) {
            l.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  // Eventos: renderizado dinámico de timeline
  const events = [
    { date: '2010', title: 'Fundación del dojo', place: 'Pinamar Norte', status: 'realizado' },
    { date: 'A confirmar', title: 'Actividad destacada de la escuela', place: 'Pendiente de completar con datos reales del dojo', status: 'pendiente' },
    { date: 'A confirmar', title: 'Competencia, examen o graduación', place: 'Pendiente de completar con fecha, lugar y descripción confirmada', status: 'pendiente' }
  ];

  function renderEvents() {
    const container = document.getElementById('eventsTimeline');
    if (!container) return;
    container.innerHTML = '';
    events.sort((a, b) => (a.date > b.date ? 1 : -1)).forEach(ev => {
      const item = document.createElement('div');
      item.className = 'timeline-item bg-white/5 p-6 rounded-2xl';
      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      const date = document.createElement('div');
      date.className = 'text-crimson text-xs font-semibold tracking-widest uppercase mb-1';
      date.textContent = ev.date;
      const title = document.createElement('div');
      title.className = 'font-semibold text-lg';
      title.textContent = ev.title;
      const place = document.createElement('div');
      place.className = 'text-ash text-sm';
      place.textContent = ev.place;
      const status = document.createElement('div');
      status.className = 'mt-3 inline-block text-xs font-semibold px-2 py-1 rounded-full';
      status.textContent = ev.status === 'pendiente' ? 'Datos pendientes' : (ev.status === 'próximo' ? 'Próximo evento' : 'Realizado');
      status.style.background = ev.status === 'próximo' ? '#B91C1C' : 'transparent';
      status.style.color = ev.status === 'próximo' ? '#fff' : '#6B6B6B';
      item.appendChild(dot);
      item.appendChild(date);
      item.appendChild(title);
      item.appendChild(place);
      item.appendChild(status);
      container.appendChild(item);
    });
  }

  renderEvents();
});
