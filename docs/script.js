(() => {
  const root = document.documentElement;
  document.body.classList.add('has-js');
  const themeButton = document.querySelector('#themeToggle');
  const menuButton = document.querySelector('#menuToggle');
  const nav = document.querySelector('#navLinks');
  const progress = document.querySelector('#readingProgress');
  const year = document.querySelector('#year');
  const storedTheme = (() => { try { return localStorage.getItem('void-theme'); } catch { return null; } })();
  const preferredTheme = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : preferredTheme;
  const updateThemeAccessibility = () => {
    if (themeButton) themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#080911' : '#f7f7fc');
  };
  updateThemeAccessibility();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('void-theme', root.dataset.theme); } catch {}
    updateThemeAccessibility();
  });
  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  menuButton?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => { if (!nav?.contains(e.target) && !menuButton?.contains(e.target)) setMenu(false); });
  const filters = [...document.querySelectorAll('.filter')];
  const cards = [...document.querySelectorAll('.project-card')];
  filters.forEach(filter => filter.addEventListener('click', () => {
    const selected = filter.dataset.filter;
    filters.forEach(button => { const active = button === filter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    cards.forEach(card => { card.hidden = selected !== 'todos' && !card.dataset.category.split(' ').includes(selected); });
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  } else { document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible')); }
  let scheduled = false;
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();
  if (year) year.textContent = new Date().getFullYear();
})();
