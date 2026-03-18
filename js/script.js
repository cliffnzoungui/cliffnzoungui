// ── THEME TOGGLE ──
const body = document.body;
document.getElementById('theme-toggle').addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') body.classList.add('light');

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// ── ACTIVE NAV ON SCROLL ──
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── CERTIF PASSWORD (inline — contourne les bloqueurs de popups) ──
function checkCertif(btn) {
  const row   = btn.closest('.certif-unlock');
  const input = row.querySelector('.certif-input');
  const msg   = row.querySelector('.certif-msg');
  const path  = input.dataset.path;
  const val   = input.value.trim();

  // Champ vide
  if (!val) {
    input.classList.add('error');
    msg.textContent = '⚠ Veuillez entrer le mot de passe.';
    msg.className = 'certif-msg err';
    setTimeout(() => input.classList.remove('error'), 400);
    return;
  }

  if (val === 'recrute_moi') {
    // Succès
    input.classList.remove('error');
    input.classList.add('success');
    msg.textContent = '✓ Accès accordé — ouverture…';
    msg.className = 'certif-msg ok';

    // Créer un <a> caché et le cliquer : bypass des bloqueurs de popups
    const a = document.createElement('a');
    a.href = path;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Reset après 3s
    setTimeout(() => {
      input.value = '';
      input.classList.remove('success');
      msg.textContent = '';
      msg.className = 'certif-msg';
    }, 3000);

  } else {
    // Échec
    input.classList.add('error');
    msg.textContent = '✗ Mot de passe incorrect.';
    msg.className = 'certif-msg err';
    input.value = '';
    setTimeout(() => input.classList.remove('error'), 400);
  }
}

// Touche Entrée dans le champ mot de passe
document.querySelectorAll('.certif-input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const btn = input.closest('.certif-input-row').querySelector('.certif-btn');
      checkCertif(btn);
    }
  });
});

// ── CONTACT FORM (feedback visuel) ──
function handleContactForm(btn) {
  btn.textContent = '✓ Message envoyé !';
  btn.style.background = 'var(--accent3)';
  setTimeout(() => {
    btn.textContent = 'Envoyer le message →';
    btn.style.background = '';
  }, 3000);
}
