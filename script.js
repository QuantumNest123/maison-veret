/* === Maison Veret — interactions === */

// --- Sticky header ---
const header = document.getElementById('header');
const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length <= 1) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => io.observe(el));

// --- Phone mask (light) ---
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.startsWith('8')) v = '7' + v.slice(1);
        if (!v.startsWith('7')) v = '7' + v;
        v = v.slice(0, 11);
        let out = '+7';
        if (v.length > 1) out += ' (' + v.slice(1, 4);
        if (v.length >= 5) out += ') ' + v.slice(4, 7);
        if (v.length >= 8) out += '-' + v.slice(7, 9);
        if (v.length >= 10) out += '-' + v.slice(9, 11);
        e.target.value = out;
    });
}

// --- Form submit ---
const form = document.getElementById('form');
const success = document.getElementById('success');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get('name') || '').toString().trim();
        const phone = (data.get('phone') || '').toString().trim();
        const goal = (data.get('goal') || '').toString().trim();
        const time = (data.get('time') || '').toString().trim();
        if (!name || !phone || !goal || !time) {
            form.querySelectorAll('input, select').forEach((f) => {
                if (!f.value) f.style.borderBottomColor = '#5a1a23';
                else f.style.borderBottomColor = '';
            });
            return;
        }
        success.classList.add('is-visible');
        form.reset();
        setTimeout(() => success.classList.remove('is-visible'), 5000);
    });
    form.querySelectorAll('input, select').forEach((f) => {
        f.addEventListener('input', () => { f.style.borderBottomColor = ''; });
        f.addEventListener('change', () => { f.style.borderBottomColor = ''; });
    });
}

// --- Mobile burger (basic toggle) ---
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');
if (burger && nav) {
    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        if (isOpen) {
            Object.assign(nav.style, {
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: '70px',
                left: '0',
                right: '0',
                background: 'rgba(13, 13, 14, 0.96)',
                padding: '28px 32px',
                gap: '20px',
                borderBottom: '1px solid rgba(244,239,231,0.18)',
                backdropFilter: 'blur(20px)',
            });
        } else {
            nav.removeAttribute('style');
        }
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        nav.removeAttribute('style');
    }));
}

// --- Subtle parallax on hero image ---
const heroImg = document.querySelector('.hero__bg img');
if (heroImg && window.matchMedia('(min-width: 720px)').matches) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > window.innerHeight) return;
        heroImg.style.transform = `translateY(${y * 0.12}px) scale(1.04)`;
    }, { passive: true });
}

// --- Hero cards subtle parallax on mouse move ---
const heroCards = document.querySelectorAll('.hero__card');
const heroSection = document.querySelector('.hero');
if (heroCards.length && heroSection && window.matchMedia('(min-width: 1101px)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroCards.forEach((card, i) => {
            const depth = (i + 1) * 6;
            card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    });
    heroSection.addEventListener('mouseleave', () => {
        heroCards.forEach((card) => { card.style.transform = ''; });
    });
}
