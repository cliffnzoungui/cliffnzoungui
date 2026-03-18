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

  if (!val) {
    input.classList.add('error');
    msg.textContent = '⚠ Veuillez entrer le mot de passe.';
    msg.className = 'certif-msg err';
    setTimeout(() => input.classList.remove('error'), 400);
    return;
  }

  if (val === 'recrute_moi') {
    input.classList.remove('error');
    input.classList.add('success');
    msg.textContent = '✓ Accès accordé — ouverture…';
    msg.className = 'certif-msg ok';

    // Bypass bloqueur de popups : créer un <a> et le cliquer
    const a = document.createElement('a');
    a.href = path;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      input.value = '';
      input.classList.remove('success');
      msg.textContent = '';
      msg.className = 'certif-msg';
    }, 3000);

  } else {
    input.classList.add('error');
    msg.textContent = '✗ Mot de passe incorrect.';
    msg.className = 'certif-msg err';
    input.value = '';
    setTimeout(() => input.classList.remove('error'), 400);
  }
}

// Touche Entrée dans les champs mot de passe certif
document.querySelectorAll('.certif-input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      checkCertif(input.closest('.certif-input-row').querySelector('.certif-btn'));
    }
  });
});

// ── CONTACT FORM — FORMSPREE (envoi réel par email) ──
// 👉 N'oublie pas de remplacer TON_ID_FORMSPREE dans index.html
//    par ton vrai ID obtenu sur https://formspree.io/register
const contactForm = document.getElementById('contact-form');
const feedback    = document.getElementById('form-feedback');
const submitBtn   = document.getElementById('form-submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // État chargement
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // ✅ Succès : cacher le formulaire, afficher confirmation
        contactForm.style.display = 'none';
        feedback.style.display = 'flex';
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
          <div class="feedback-icon">✓</div>
          <div>
            <strong>Message envoyé !</strong>
            <p>Merci, je vous répondrai dans les plus brefs délais.</p>
          </div>
        `;
      } else {
        throw new Error('Erreur serveur');
      }

    } catch (err) {
      // ❌ Erreur : afficher message d'erreur
      feedback.style.display = 'flex';
      feedback.className = 'form-feedback error';
      feedback.innerHTML = `
        <div class="feedback-icon">✗</div>
        <div>
          <strong>Échec de l'envoi</strong>
          <p>Vérifiez votre connexion ou contactez-moi directement par email.</p>
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Réessayer →';
    }
  });
}
