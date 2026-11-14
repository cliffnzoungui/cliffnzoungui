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

// ── CONTACT FORM — FORMSPREE (envoi réel par email) ──
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
